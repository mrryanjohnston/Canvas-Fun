module.exports = function sockets_function(settings, io, app, models, string){
    io.set('log level', 0);
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
    chat_clients = new Object();
    chat_clients.duplicates = [];

    io.sockets.on('connection', function(socket){
        socket.handshake.session.username = string(socket.handshake.session.username).escapeHTML().s;
        socket.mid = socket.handshake.session._id // mongo ID

        socket.on('connect', function(data){
            connect(socket, data);
        });

        socket.on('message', function(data){
            message(socket, data);
        });

        socket.on('disconnect', function(){
            disconnect(socket);
        });

        socket.on('invite', function(data){
            invite_to_game(socket, data.user);
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
        data.message = string(data.message).escapeHTML().s;
        io.sockets.emit('message', data );
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
        setTimeout(emit_clients_in_room, 1000); // Without a delay this call says that the user that just left is still in the room. Probably should work around this another way, because with many users this could spawn too many processes(or however node handles timeouts) and tank the app.
    }

    function join(socket){
        console.log("join called");
    }

    function emit_clients_in_room(){
        var user_keys = io.sockets.manager.rooms[""];
        var users = {};
        if (user_keys !== undefined){
            for(var i=0; i<user_keys.length; i++){
                var key = user_keys[i];
                var mid = io.sockets.sockets[user_keys[i]].mid;
                var username = string(io.sockets.sockets[user_keys[i]].handshake.session.username).escapeHTML().s;
                users[mid] = {username: username, key: key }
            }
            io.sockets.emit('userlist', { users : users });
        }
    };

    function subscribe_to_room(socket, data){
        socket.join(data.room);
        console.log("subscribe_to_room called");
    };

    function unsubscribe_from_room(socket, data){
        socket.leave(data.room)
    };

    function invite_to_game(socket, invitee){
        if(socket.id === invitee){
            data = { user: "Server",
                     message: "You cannot invite yourself to a game." };
            socket.emit('message', data);
        }else{
            data_invitee = { user: "Server",
                             message: string(socket.handshake.session.username).escapeHTML().s+" invited you to a game." };
            data_inviter = { user: "Server",
                             message: "You invited "+string(io.sockets.socket(invitee).handshake.session.username).escapeHTML().s+" to a game." };
            subscribe_to_room(socket, { room: socket.id });
            io.sockets.socket(invitee).emit('message', data_invitee);
            socket.emit('message', data_inviter );
            io.sockets.socket(invitee).emit('invite', {user: string(socket.handshake.session.username).escapeHTML().s});
        }
    };
}
