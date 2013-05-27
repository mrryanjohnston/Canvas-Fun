$(document).ready(function(){
    connect();
});

function connect(){
    var socket
    ,   server_address = "/";
    socket = io.connect(server_address);
    bind_chat_listeners(socket);
    bind_sockets(socket);
}

function bind_sockets(socket){
    socket.on('connect', function(data) {
        create_chat_element("connect");
        socket.emit('connect');
    });
    socket.on('ready', function(data) {
        create_chat_element("ready", data);
    });
    socket.on('message', function(data) {
        create_chat_element("message", data);
    });
    socket.on('disconnect', function(data) {
        create_chat_element("disconnect", data);
    });
    socket.on('userlist', function(data) {
        update_user_list(data, socket);
    });
    socket.on('invite', function(data) {
        helpers.notify();
        helpers.add_notification(data.user+" invited you to a game.");
    });
};

function bind_chat_listeners(socket){
    $("#chat_form").submit(function(event){
        event.preventDefault();
        if($("#chat_input").val().length > 0){
            socket.emit("message", { message : $("#chat_input").val() });
            $("#chat_input").val("");
            $('#chat_input').focus();
        }
    });
}

function update_user_list(data, socket){
    $("#user_window").empty();
    for (var mid in data.users){
        var user = ' \
            <div class="dropdown user"> \
            <a id="dropdownMenu_'+mid+'" class="dropdown-toggle" data-toggle="dropdown" href="/user?id='+mid+'"> \
            <div class="user_block"> \
            '+data.users[mid].username+'\
            </div> \
            </a>\
                <ul class="dropdown-menu user_drop_down" role="menu" aria-labelledby="dropdownMenu_'+mid+'"> \
                    <li><p class="muted user_heading">'+data.users[mid].username+'</p> \
                    <li class="divider"> \
                    <li><a target="_blank" href="/user?id='+mid+'">View profile</a></li> \
                    <li class="divider"></li> \
                    <li><a href="/add_friend">Add to friend list</a></li> \
                    <li><a id="invite_'+data.users[mid].key+'" href="/invite/'+mid+'">Invite to game</a></li> \
                </ul> \
            </div>';
        $("#user_window").append(user);
        $("a#invite_"+data.users[mid].key).click(function(event){
            event.preventDefault();
            socket.emit("invite", { user: $(this).context.id.slice(7) });
        });
    }
}

function create_chat_element(element, data){
    var chat_space = $("#chat_window .container-fluid")

    if( element === "message" ){
        var item = '<div class="row-fluid"> \
                        <div class="span12"> \
                            <p>['+helpers.now()+'] '+data.user+': '+data.message+'</p> \
                        </div> \
                    </div>';
        chat_space.append(item);

    }else if( element === "connect"){
        var item = '<div class="row-fluid"> \
                        <div class="span12"> \
                            <p>['+helpers.now()+'] You are connecting.</p> \
                        </div> \
                    </div>';
        chat_space.append(item);

    }else if( element === "ready"){
        var item = '<div class="row-fluid"> \
                        <div class="span12"> \
                            <p>['+helpers.now()+'] '+data.message+'</p> \
                        </div> \
                    </div>';
        chat_space.append(item);

    }else if( element === "disconnect"){
        // vvv This tidbit prevents errors trying to access a nonexistent property
        var o1 = (o1=data) && (o1=data.user_id);
        var o2 = (o2=data) && (o2=data.username);
        var original = (o1 && o2);
        if(original){
            var item = '<div class="row-fluid"> \
                            <div class="span12"> \
                                <p>['+helpers.now()+'] <a href="/user?id='+data.user_id+'" target="_blank">'+data.username+'</a> disconnected.</p> \
                            </div> \
                        </div>';
            chat_space.append(item); 
        }else{
            var item = '<div class="row-fluid"> \
                            <div class="span12"> \
                                <p>['+helpers.now()+'] Your connection was terminated.</p> \
                            </div> \
                        </div>';
            chat_space.append(item); 
        }
    }
    $('#chat_window').scrollTop($('#chat_window')[0].scrollHeight);
}
