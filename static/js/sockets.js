/***
* Clientside sockets configuration
*/


(function($){

    var NICK_MAX_LENGTH = 15,
        ROOM_MAX_LENGTH = 10,
        lockShakeAnimation = false,
        socket = null,
        clientId = null,
        nickname = null,
        currentRoom = null,
        serverAddress = 'http://localhost:3000',
        serverDisplayName = 'Server',
        serverDisplayColor = '#1c5380',
        tmplt = {
            room: [
                '<li data-roomId="${room}">',
                    '<span class="icon"></span> ${room}',
                '</li>'
            ].join(""),
            client: [
                '<li data-clientId="${clientId}" class="cf">',
                    '<div class="fl clientName"><span class="icon"></span> ${nickname}</div>',
                    '<div class="fr composing"></div>',
                '</li>'
            ].join(""),
            message: [
                '<li class="cf">',
                    '<div class="fl sender">${sender}: </div><div class="fl text">${text}</div><div class="fr time">${time}</div>',
                '</li>'
            ].join("")
        };

    function bindDOMEvents(){
        
        $('.chat-input input').on('keydown', function(e){
            var key = e.which || e.keyCode;
            if(key == 13) { handleMessage(); }
        });

        $('.chat-submit button').on('click', function(){
            handleMessage();
        });

//        $('#nickname-popup .input input').on('keydown', function(e){
//            var key = e.which || e.keyCode;
//            if(key == 13) { handleNickname(); }
//        });
//
//        $('#nickname-popup .begin').on('click', function(){
//            handleNickname();
//        });
        
        $('#addroom-popup .input input').on('keydown', function(e){
            var key = e.which || e.keyCode;
            if(key == 13) { createRoom(); }
        });

        $('#addroom-popup .create').on('click', function(){
            createRoom();
        });

//        $('.big-button-green.start').on('click', function(){
//            $('#nickname-popup .input input').val('');
//            //Avgrund.show('#nickname-popup');
//            window.setTimeout(function(){
//                $('#nickname-popup .input input').focus();
//            },100);
//        });

        $('.chat-rooms .title-button').on('click', function(){
            $('#addroom-popup .input input').val('');
            //Avgrund.show('#addroom-popup');
            window.setTimeout(function(){
                $('#addroom-popup .input input').focus();
            },100);
        });

        $('.chat-rooms ul').on('scroll', function(){
            $('.chat-rooms ul li.selected').css('top', $(this).scrollTop());
        });

        $('.chat-messages').on('scroll', function(){
            var self = this;
            window.setTimeout(function(){
                if($(self).scrollTop() + $(self).height() < $(self).find('ul').height()){
                    $(self).addClass('scroll');
                } else {
                    $(self).removeClass('scroll');
                }
            }, 50);
        });

        $('.chat-rooms ul li').live('click', function(){
            var room = $(this).attr('data-roomId');
            if(room != currentRoom){
                socket.emit('unsubscribe', { room: currentRoom });
                socket.emit('subscribe', { room: room });
            }
        });
    }

    function bindSocketEvents(){
        socket.on('connect', function(){
            socket.emit('connect', { nickname: nickname });
        });
        
        socket.on('ready', function(data){
            $('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                $(this).hide();
                $('.chat input').focus();
            });
            clientId = data.clientId;
        });

        socket.on('roomslist', function(data){
            for(var i = 0, len = data.rooms.length; i < len; i++){
                if(data.rooms[i] != ''){
                    addRoom(data.rooms[i], false);
                }
            }
        });

        socket.on('chatmessage', function(data){
            var nickname = data.client.nickname;
            var message = data.message;
            insertMessage(nickname, message, true, false, false);
        });
        
        socket.on('roomclients', function(data){
            addRoom(data.room, false);
            setCurrentRoom(data.room);
            insertMessage(serverDisplayName, 'Welcome to the room: `' + data.room + '`... enjoy!', true, false, true);
            $('.chat-clients ul').empty();
            addClient({ nickname: nickname, clientId: clientId }, false, true);
            for(var i = 0, len = data.clients.length; i < len; i++){
                if(data.clients[i]){
                    addClient(data.clients[i], false);
                }
            }

            $('.chat-shadow').animate({ 'opacity': 0 }, 200, function(){
                $(this).hide();
                $('.chat input').focus();
            });
        });
        
        socket.on('addroom', function(data){
            addRoom(data.room, true);
        });
        
        socket.on('removeroom', function(data){
            removeRoom(data.room, true);
        });
        
        socket.on('presence', function(data){
            if(data.state == 'online'){
                addClient(data.client, true);
            } else if(data.state == 'offline'){
                removeClient(data.client, true);
            }
        });
    }

    function addRoom(name, announce){
        name = name.replace('/','');
        if($('.chat-rooms ul li[data-roomId="' + name + '"]').length == 0){
            $.tmpl(tmplt.room, { room: name }).appendTo('.chat-rooms ul');
            if(announce){
                insertMessage(serverDisplayName, 'The room `' + name + '` created...', true, false, true);
            }
        }
    }

    function removeRoom(name, announce){
        $('.chat-rooms ul li[data-roomId="' + name + '"]').remove();
        if(announce){
            insertMessage(serverDisplayName, 'The room `' + name + '` destroyed...', true, false, true);
        }
    }

    function addClient(client, announce, isMe){
        var $html = $.tmpl(tmplt.client, client);
        if(isMe){
            $html.addClass('me');
        }

        if(announce){
            insertMessage(serverDisplayName, client.nickname + ' has joined the room...', true, false, true);
        }
        $html.appendTo('.chat-clients ul')
    }

    function removeClient(client, announce){
        $('.chat-clients ul li[data-clientId="' + client.clientId + '"]').remove();
        if(announce){
            insertMessage(serverDisplayName, client.nickname + ' has left the room...', true, false, true);
        }
    }

    function createRoom(){
        var room = $('#addroom-popup .input input').val().trim();
        if(room && room.length <= ROOM_MAX_LENGTH && room != currentRoom){
            $('.chat-shadow').show().find('.content').html('Creating room: ' + room + '...');
            $('.chat-shadow').animate({ 'opacity': 1 }, 200);
            socket.emit('unsubscribe', { room: currentRoom });
            socket.emit('subscribe', { room: room });
            //Avgrund.hide();
        } else {
            shake('#addroom-popup', '#addroom-popup .input input', 'tada', 'yellow');
            $('#addroom-popup .input input').val('');
        }
    }

    function setCurrentRoom(room){
        currentRoom = room;
        $('.chat-rooms ul li.selected').removeClass('selected');
        $('.chat-rooms ul li[data-roomId="' + room + '"]').addClass('selected');
    }

//    function handleNickname(){
//        var nick = $('#nickname-popup .input input').val().trim();
//        if(nick && nick.length <= NICK_MAX_LENGTH){
//            nickname = nick;
//            //Avgrund.hide();
//            connect();
//        } else {
//            shake('#nickname-popup', '#nickname-popup .input input', 'tada', 'yellow');
//            $('#nickname-popup .input input').val('');
//        }
//    }

    function handleMessage(){
        var message = $('.chat-input input').val().trim();
        if(message){
            socket.emit('chatmessage', { message: message, room: currentRoom });
            insertMessage(nickname, message, true, true);
            $('.chat-input input').val('');
        } else {
            shake('.chat', '.chat input', 'wobble', 'yellow');
        }
    }

    function insertMessage(sender, message, showTime, isMe, isServer){
        var $html = $.tmpl(tmplt.message, {
            sender: sender,
            text: message,
            time: showTime ? getTime() : ''
        });
        if(isMe){
            $html.addClass('marker');
        }
        if(isServer){
            $html.find('.sender').css('color', serverDisplayColor);
        }
        $html.appendTo('.chat-messages ul');
        $('.chat-messages').animate({ scrollTop: $('.chat-messages ul').height() }, 100);
    }

    function getTime(){
        var date = new Date();
        return (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours()) + ':' +
                (date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes());
    }

    function shake(container, input, effect, bgColor){
        if(!lockShakeAnimation){
            lockShakeAnimation = true;
            $(container).addClass(effect);
            $(input).addClass(bgColor);
            window.setTimeout(function(){
                $(container).removeClass(effect);
                $(input).removeClass(bgColor);
                $(input).focus();
                lockShakeAnimation = false;
            }, 1500);
        }
    }
    
    function connect(){
        $('.chat-shadow .content').html('Connecting...');
        socket = io.connect(serverAddress);
        bindSocketEvents();
    }

    $(function(){
        bindDOMEvents();
    });

})(jQuery);
