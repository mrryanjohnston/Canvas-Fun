$(document).ready(function(){

var socket
,   server_address = "helium";

connect();

function connect(){
    socket = io.connect(server_address);
    bind_sockets(socket)
}

function bind_sockets(socket){
    socket.on('chat_message', function(data) {
        console.log(data);
    });
}

});
