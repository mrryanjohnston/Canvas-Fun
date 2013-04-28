module.exports = function sockets_function(settings, io, app) {
    io.set('log level', 3); // See https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

    // Tutorial by http://udidu.blogspot.com/2012/11/chat-evolution-nodejs-and-socketio.html
    // Ripped off of https://github.com/uditalias/chat-nodejs
    io.sockets.on('connection', function(socket){

        socket.on('connect', function(data){
            connect(socket, data);
        });
        socket.on('chatmessage', function(data){
            chatmessage(socket, data);
        });
        socket.on('subscribe', function(data){
            subscribe(socket, data);
        });
        socket.on('unsubscribe', function(data){
            unsubscribe(socket, data);
        });
        socket.on('disconnect', function(){
            disconnect(socket);
        });
    });

    function connect(socket, data){
        data.clientId = generateId(); //Grab from req.session._id
        chatClients[socket.id] = data;
        socket.emit('ready', { clientId: data.clientId });
        subscribe(socket, { room: 'lobby' });
        socket.emit('roomslist', { rooms: get_rooms() });
    }

    function disconnect(socket){
        var rooms = io.sockets.manager.roomClients[socket.id];
        for(var room in rooms){
            if(room && rooms[room]){
                unsubscribe(socket, { room: room.replace('/','') });
            }
        }
        delete chatClients[socket.id];
    }

    function chatmessage(socket, data){
        socket.broadcast.to(data.room).emit('chatmessage', { client: chatClients[socket.id], message: data.message, room: data.room });
    }

    function subscribe(socket, data){
        var rooms = get_rooms();
        if(rooms.indexOf('/' + data.room) < 0){
            socket.broadcast.emit('addroom', { room: data.room });
        }
        socket.join(data.room);
        update_presence(data.room, socket, 'online');
        socket.emit('roomclients', { room: data.room, clients: get_clients_in_room(socket.id, data.room) });
    }

    function unsubscribe(socket, data){
        update_presence(data.room, socket, 'offline');
        socket.leave(data.room);
        if(!count_clients_in_room(data.room)){
            io.sockets.emit('removeroom', { room: data.room });
        }
    }

    function get_rooms(){
        return Object.keys(io.sockets.manager.rooms);
    }

    function get_clients_in_room(socketId, room){
        var socketIds = io.sockets.manager.rooms['/' + room];
        var clients = [];
        if(socketIds && socketIds.length > 0){
            socketsCount = socketIds.lenght;
            for(var i = 0, len = socketIds.length; i < len; i++){
                if(socketIds[i] != socketId){
                    clients.push(chatClients[socketIds[i]]);
                }
            }
        }
        return clients;
    }

    function count_clients_in_room(room){
        if(io.sockets.manager.rooms['/' + room]){
            return io.sockets.manager.rooms['/' + room].length;
        }
        return 0;
    }

    function update_presence(room, socket, state){
        room = room.replace('/','');
        socket.broadcast.to(room).emit('presence', { client: chatClients[socket.id], state: state, room: room });
    }

    function generateId(){
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
}
