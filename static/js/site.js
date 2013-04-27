$(document).ready(function on_page_load() {
    $('#login_form').submit(function click_login(){
        event.preventDefault();
        $.ajax({
            url: 'login',
            data: {
                email : $('#email').val(),
                password : $('#password').val()
                },
            type: 'post',
            error: function on_login_failure(){
                $("#login_error").removeClass("none");
                $("#login_error p").text("The credentials you provided are invalid.");
            },
            success: function on_login_success(){
                window.location.replace("/");
            }
        });
    });
})
