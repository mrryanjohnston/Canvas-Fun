module.exports = function sockets_function(settings, io, app, models, string){
    io.set('log level', 0); // See https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
    chat_clients = new Object();
    chat_clients.duplicates = [];

    io.sockets.on('connection', function(socket){
        socket.handshake.session.username = string(socket.handshake.session.username).escapeHTML().s; //Escape HTML in username
        socket.mid = socket.handshake.session._id //user's mongoID

        socket.on('connect', function(data){
            connect(socket, data);
            //emit_public_chat_rooms();
        });

        socket.on('message', function(data){
            message(socket, data);
        });

        socket.on('disconnect', function(){
            disconnect(socket);
        });

        socket.on('invite', function(data){
            /*
            //example data
            data = { room: data.room,
                     socket.id: data.user_id };
            */
            invite_to_room(socket, data);
        });

    });

    function connect(socket, data){
        console.log("A client connected {session.id: "+socket.handshake.sessionID+", session.mid: "+socket.mid+"}");
        if(socket.mid in chat_clients){
            chat_clients.duplicates = chat_clients.duplicates.concat(socket.mid);
            socket.emit('message', { user: "Server", message: "Your account is already signed on from another location. Please disconnect from the other location before attempting to reconnect." });
            socket.disconnect();
        }else{
            chat_clients[socket.mid] = data;
            io.sockets.emit('ready', { message: '<a href="/user?id='+socket.mid+'" target="_blank">'+socket.handshake.session.username+'</a> connected.'});
            emit_clients_in_room();
        }
    }

    function message(socket, data){
        data.user = socket.handshake.session.username;
        data.message = string(data.message).escapeHTML().s; //Escape html in message
        io.sockets.emit('message', data );
        //console.log("A client sent a message.");
        //console.log("data: "+JSON.stringify(data));
        //console.log(io.sockets.manager.rooms);
        //console.log(io.sockets.manager.rooms[""]);
    }

    function disconnect(socket){
        console.log("A client disconnected.");
        data = {
            username: socket.handshake.session.username,
            user_id : socket.mid
        };
        var duplicate_id = chat_clients.duplicates.indexOf(socket.mid);
        if(duplicate_id !== -1){
            chat_clients.duplicates = chat_clients.duplicates.slice(0,duplicate_id).concat(chat_clients.duplicates.slice(duplicate_id+1));
            socket.emit('disconnect', data);
        }else{
            io.sockets.emit('disconnect', data);
            delete chat_clients[socket.mid];
        }
        setTimeout(emit_clients_in_room, 1000); // Without a delay this call thinks the user that left is still in the room.
    }

    function emit_public_chat_rooms(){
        //io.sockets.emit('roomlist', { rooms: get_list_of_public_rooms() });
    };

    //function emit_clients_in_room(room){
    function emit_clients_in_room(){
        //io.sockets.emit('userlist', { users : get_clients_in_room() });
        //io.sockets.emit('userlist', { users : io.sockets.manager.rooms[""] });
        var user_keys = io.sockets.manager.rooms[""];
        var users = {};
        for(var i=0; i<user_keys.length; i++){
            var key = user_keys[i];
            var mid = io.sockets.sockets[user_keys[i]].mid;
            var username = string(io.sockets.sockets[user_keys[i]].handshake.session.username).escapeHTML().s;
            users[mid] = {username: username, key: key }
        }
        io.sockets.emit('userlist', { users : users });
    };

    function subscribe_to_room(socket, data){
        socket.join(data.room);
    };

    function unsubscribe_from_room(socket, data){
        socket.leave(data.room)
    };

    function invite_to_room(socket, data){
        // Target the invited user
        //socket.emit('invite', { room: data.room });
    };

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
