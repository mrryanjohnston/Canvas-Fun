$(document).ready(function(){
    $("a#login_dropdown_button").on("click", function(event){
        event.preventDefault();
        if($("#login_form").is(":visible")){
            $("#login_form").fadeOut("fast");
        }else{
            $("#login_form").fadeIn("fast", function() {
                $("#email").focus();
            });
        }
    });
});

var helpers = {
    login: function attempt_login(){
        $.ajax({
            url: 'login',
            data: {
                email : $('#email').val(),
                password : $('#password').val(),
                remember_me : $('#remember_me').is(":checked")
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
    }
}
