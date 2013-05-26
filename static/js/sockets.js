$(document).ready(function(){

    connect();

});

function connect(){
    var socket
    ,   server_address = "/";
    socket = io.connect(server_address);
    bind_dom_listeners(socket);
    bind_sockets(socket);
}

function bind_sockets(socket){
    socket.on('connect', function(data) {
        create_chat_element("connect");
        socket.emit('connect');
        //console.log("Connecting...");
    });
    socket.on('ready', function(data) {
        create_chat_element("ready", data);
        //console.log("User ready: "+data);
    });
    socket.on('message', function(data) {
        create_chat_element("message", data);
        //console.log("message: "+JSON.stringify(data));
    });
    socket.on('disconnect', function(data) {
        create_chat_element("disconnect", data);
        //console.log("disconnect: "+data);
    });
    socket.on('userlist', function(data) {
        update_user_list(data);
    });
    socket.on('roomlist', function(data) {
        console.log("rooms: "+data);
    });
};

function bind_dom_listeners(socket){
    $("#chat_form").submit(function(event){
        event.preventDefault();
        if($("#chat_input").val().length > 0){
            socket.emit("message", { message : $("#chat_input").val() });
            $("#chat_input").val("");
            $('#chat_input').focus();
        }
    });
}

function update_user_list(data){
    $("#user_window").empty();
    for (var mid in data.users){
        $("#user_window").append('<p><a target="_blank" href="/user?id='+mid+'">'+data.users[mid].username+'</a></p>');
    }
}

function create_chat_element(element, data){
    var chat_space = $("#chat_window .container-fluid")
    ,   time = new Date
    ,   hour = time.getHours()
    ,   mins = time.getMinutes();
    if( mins < 10 ){
        mins = "0"+mins;
    }
    var now = hour+":"+mins;

    if( element === "message" ){
        var item = '<div class="row-fluid"> \
                        <div class="span12"> \
                            <p>['+now+'] '+data.user+': '+data.message+'</p> \
                        </div> \
                    </div>';
        chat_space.append(item);

    }else if( element === "connect"){
        var item = '<div class="row-fluid"> \
                        <div class="span12"> \
                            <p>['+now+'] You are connecting.</p> \
                        </div> \
                    </div>';
        chat_space.append(item);

    }else if( element === "ready"){
        var item = '<div class="row-fluid"> \
                        <div class="span12"> \
                            <p>['+now+'] '+data.message+'</p> \
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
                                <p>['+now+'] <a href="/user?id='+data.user_id+'" target="_blank">'+data.username+'</a> disconnected.</p> \
                            </div> \
                        </div>';
            chat_space.append(item); 
        }else{
            var item = '<div class="row-fluid"> \
                            <div class="span12"> \
                                <p>['+now+'] Your connection was terminated.</p> \
                            </div> \
                        </div>';
            chat_space.append(item); 
        }
    }
    $('#chat_window').scrollTop($('#chat_window')[0].scrollHeight);
}
