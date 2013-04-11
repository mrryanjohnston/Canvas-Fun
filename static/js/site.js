$(document).ready(function on_page_load() {
    $('#loginform').submit(function click_login(){
        event.preventDefault();
        $.post('login', {
            username : $('#username').val(),
            password : $('#password').val()
            },
        function response_to_login(data) {
            if(data=="OK"){
                window.location.replace("/");
            }else{
                $("#login_error").html("<p class='text-error'>The credentials you provided are invalid.</p>");
            }
        })
    });
})
