module.exports = function sockets_function(settings, io, app, models, string){
    io.set('log level', 0); // See https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
    chat_clients = new Object();

    io.sockets.on('connection', function(socket){
        socket.handshake.session.username = string(socket.handshake.session.username).escapeHTML().s; //Escape HTML in username
        socket._id = socket.handshake.session._id

        socket.on('connect', function(data){
            connect(socket, data);
            //emit_clients_in_room('lobby');
            //emit_public_chat_rooms();
        });

        socket.on('message', function(data){
            message(socket, data);
        });

        socket.on('disconnect', function(){
            disconnect(socket);
        });

        socket.on('invite', function(data){
            invite_to_room(socket, room, data);
        });

    });

    function connect(socket, data){
        console.log("A client connected {session.id: "+socket.handshake.sessionID+", session._id: "+socket._id+"}");
        if(socket._id in chat_clients){
            //console.log("This client is already connected and the attempted second connection will be terminated.");
            socket.emit('message', { user: "Server", message: "Your account is already signed on from another location. Please disconnect from the other location before attempting to reconnect." });
            socket.disconnect();
        }else{
            //Subscribe user to room lobby
            var room = "lobby";
            chat_clients[socket._id] = data;
            //console.log("Chat clients j: "+JSON.stringify(chat_clients));
            //console.log("Chat clients: "+chat_clients);
            //subscribe_to_room(socket, { room: 'lobby' });
            io.sockets.emit('ready', { message: '<a href="/user?id='+socket.handshake.session._id+'" target="_blank">'+socket.handshake.session.username+'</a> connected.'});
        }
    }

    function message(socket, data){
        data.user = socket.handshake.session.username;
        data.message = string(data.message).escapeHTML().s; //Escape html in message
        io.sockets.emit('message', data );
        //console.log("A client sent a message.");
        //console.log("data: "+JSON.stringify(data));
        //console.log(io.sockets.manager.rooms);
    }

    function disconnect(socket){
        console.log("A client disconnected.");
        data = {
            username: socket.handshake.session.username,
            user_id : socket.handshake.session._id
        };
        if(!(socket._id in chat_clients)){
            delete chat_clients[socket._id];
            io.sockets.emit('disconnect', data);
        }
        //emit_clients_in_room(room);
    }

    function emit_public_chat_rooms(){
        //io.sockets.emit('roomlist', { rooms: get_list_of_public_rooms() });
    };

    function emit_clients_in_room(room){
        //io.sockets.emit('userlist', { users : get_clients_in_room(room), room : room});
    };

    function subscribe_to_room(socket, room){
        //
    };

    function unsubscribe_from_room(socket, room){
        //
    };

    function invite_to_room(socket, room, data){
        //
    };

    function get_clients_in_room(room){
        var socket_connections = io.sockets.manager.rooms['/' + room];
        var clients = [];
        if(socket_connections && socket_connections.length > 0){
            sockets_count = socket_connections.length;
            for(var i = 0, len = socket_connections.length; i < len; i++){
                if(socket_connections[i] != socket_id){
                    clients.push(chat_clients[socket_connections[i]]);
                }
            }
        }
        return clients;
    }

    /*
    // Tutorial by http://udidu.blogspot.com/2012/11/chat-evolution-nodejs-and-socketio.html
    // https://github.com/uditalias/chat-nodejs
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
        chat_clients[socket.id] = data;
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
        delete chat_clients[socket.id];
    }
    function chatmessage(socket, data){
        socket.broadcast.to(data.room).emit('chatmessage', { client: chat_clients[socket.id], message: data.message, room: data.room });
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
            socketsCount = socketIds.length;
            for(var i = 0, len = socketIds.length; i < len; i++){
                if(socketIds[i] != socketId){
                    clients.push(chat_clients[socketIds[i]]);
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
        socket.broadcast.to(room).emit('presence', { client: chat_clients[socket.id], state: state, room: room });
    }

    function generateId(){
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    */
}
