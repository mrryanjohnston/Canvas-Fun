module.exports = function sockets_function(settings, io, app, models, string){
    io.set('log level', 0);
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
    chat_clients = new Object();
    chat_clients.duplicates = [];
    invitations = new Object();
    invitees = new Object();

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

        socket.on('cancel', function(data){
            cancel_invitation(socket, data.user);
        });

    });

    function connect(socket, data){
        //console.log("A client connected {session.id: "+socket.handshake.sessionID+", session.mid: "+socket.mid+"}");
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
        //console.log("A client disconnected.");
        //delete invitations to the disconnecting user and delete the user from invitees, if he/she is in it
        delete_invitee(socket);
        delete_invitation(socket);
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

    function respond_to_invitation(socket, data){
        var inviter = io.sockets.socket(data.key);
        delete_invitee(socket);
        delete_invitation(inviter);
        data_invitee = { user: "Server" }
        data_inviter = { user: "Server" }
        if(data.response == "accept"){
            subscribe_to_room(socket, { room: socket.id+"__v__"+io.sockets.socket(data.key).id});
            //launch game
            //unsubscribe from lobby?
            data_invitee.message = "You accepted a game offer from "+socket.username;
            data_inviter.message = io.sockets.socket(data.key).username+" accepted your invitation.";
        }else{
            unsubscribe_from_room(io.sockets.socket(data.key), { room: socket.id+"__v__"+io.sockets.socket(data.key).id });
            data_invitee.message = "You declined a game offer from "+socket.username;
            data_inviter.message = io.sockets.socket(data.key).username+" declined your invitation.";
        }
        io.sockets.socket(data.key).emit('message', data_inviter)
        socket.emit('message', data_invitee );
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
        //console.log(io.sockets.manager.rooms);
    };

    function unsubscribe_from_room(socket, data){
        console.log(socket.id+" unsubscribed from room "+data.room);
        socket.leave(data.room)
        //console.log(io.sockets.manager.rooms);
    };

    function cancel_invitation(socket, invitee){
        console.log("cancel_invitation() called");
        delete_invitee(invitee);
        delete_invitation(socket);
        // Send a remove-invitation-from-invitee message
    };

    function delete_invitee(invitee){
        if(invitee.id in invitees){
            delete invitees[invitee.id];
        }
    }

    function delete_invitation(invitation){
        if(invitation.id in invitations){
            delete invitations[invitation.id];
        }
    }

    function invite_to_game(socket, invitee){
        if(socket.id === invitee){
            data = { user: "Server",
                     message: "You cannot invite yourself to a game." };
            socket.emit('message', data);
        }else{
            var invitee = io.sockets.socket(invitee);
            if(invitee.id in invitees){
                console.log("That user has a pending invitation already.");
                socket.emit('message', { user: "Server",
                    message: invitee.username+" has a pending invitation and cannot be invited to a game until responding to it."});
                return;
            }
            if(socket.id in invitations){
                console.log("You have a pending invitation already.");
                socket.emit('message', { user: "Server",
                    message: "You cannot send another invitation until "+io.sockets.socket(invitations[socket.id]).username+" responds to your pending invitation." });
                return;
            }
            invitations[socket.id] = invitee.id;
            invitees[invitee.id] = socket.id;
            data_invitee = { user: "Server",
                             message: socket.username+" invited you to a game." };
            data_inviter = { user: "Server",
                             message: "You invited "+invitee.username+" to a game." };
            subscribe_to_room(socket, { room: invitee.id+"__v__"+socket.id });
            io.sockets.socket(invitee.id).emit('message', data_invitee);
            socket.emit('message', data_inviter );
            io.sockets.socket(invitee.id).emit('invite', {user: socket.username, key: socket.id });
            // Send a prepare-cancel-button message to the inviter
        }
    };
}
