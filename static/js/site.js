$(document).ready(function on_page_load() {
    $('#loginform').submit(function click_login(){
        event.preventDefault();
        $.ajax({
            url: 'login',
            data: {
                username : $('#username').val(),
                password : $('#password').val()
                },
            type: 'post',
            error: function on_login_failure(){
                $("#login_error").html("<p class='text-error'>The credentials you provided are invalid.</p>");
            },
            success: function on_login_success(){
                window.location.replace("/");
            }
        });
    });
})
