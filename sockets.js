module.exports = function sockets_function(settings, io, app, models, string){
    io.set('log level', 0);
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
    chat_clients = new Object();
    chat_clients.duplicates = [];

    io.sockets.on('connection', function(socket){
        socket.username = string(socket.handshake.session.username).escapeHTML().s;
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

        socket.on('respond', function(data){
            respond_to_invitation(socket, data);
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
            io.sockets.emit('ready', { message: '<a href="/user?id='+socket.mid+'" target="_blank">'+socket.username+'</a> connected.'});
            emit_clients_in_room();
        }
    }

    function message(socket, data){
        data.user = socket.username;
        data.message = string(data.message).escapeHTML().s;
        io.sockets.emit('message', data );
    }

    function disconnect(socket){
        console.log("A client disconnected.");
        data = {
            username: socket.username,
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
        emit_clients_in_room(socket.mid);
    }

    function respond_to_invitation(socket, inviter){
        data_invitee = { user: "Server" }
        data_inviter = { user: "Server" }
        if(data.response == "accept"){
            //subscribe invitee to room
            //launch game
            //unsubscribe from lobby?
        }else{
            //unsubscribe inviter from room
            data_invitee.message = "You declined a game offer from "+socket.username;
            data_inviter.message = string(io.sockets.socket(inviter).handshake.session.username).escapeHTML().s+" declined your invitation.";
            io.sockets.socket(inviter).emit('message', data_inviter)
            socket.emit('message', data_invitee );
        }
    }

    function emit_clients_in_room(exclude_user_mid){
        var user_keys = io.sockets.manager.rooms[""];
        var users = {};
        if (user_keys !== undefined){
            for(var i=0; i<user_keys.length; i++){
                var key = user_keys[i];
                var mid = io.sockets.sockets[user_keys[i]].mid;
                var username = string(io.sockets.sockets[user_keys[i]].handshake.session.username).escapeHTML().s;
                users[mid] = {username: username, key: key }
            }
            if(typeof excluse_user_mid !== undefined){
                delete users[exclude_user_mid];
            }
            io.sockets.emit('userlist', { users : users });
        }
    };

    function subscribe_to_room(socket, data){
        console.log(socket.id+" subscribed to room "+data.room);
        socket.join(data.room);
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
            // Add a limiter so only one active invitation can go to a player
            data_invitee = { user: "Server",
                             message: socket.username+" invited you to a game." };
            data_inviter = { user: "Server",
                             message: "You invited "+string(io.sockets.socket(invitee).handshake.session.username).escapeHTML().s+" to a game." };
            subscribe_to_room(socket, { room: invitee+"__v__"+socket.id });
            io.sockets.socket(invitee).emit('message', data_invitee);
            socket.emit('message', data_inviter );
            io.sockets.socket(invitee).emit('invite', {user: socket.username, key: socket.id });
        }
    };
}
