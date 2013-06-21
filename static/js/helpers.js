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
    $("a#notification_button").on("click", function(event){
        if($("#notification_icon").hasClass('icon-white')){
            $("#notification_icon").removeClass('icon-white');
            $("#notification_icon").addClass('icon-black');
        };
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
    },
    notify: function trigger_notification(){
        if($("#notification_icon").hasClass('icon-black')){
            $("#notification_icon").removeClass("icon-black");
            $("#notification_icon").addClass("icon-white");
        }
    },
    add_notification: function add_notification(message){
        if(($("#notifications_list").children().length === 1) && ($("#notifications_list").children(0).text() === "You have no notifications." )){
            $("#notifications_list").empty();
        }
        $("#notifications_list").prepend('<li class="notification">['+helpers.now()+'] '+message+'</li>');
        if($("#notifications_list").children().length > 10){
            // Make a function to check if element is allowed to be removed. e.g. it cannot be a pending invitation.
            // Wrap the above function in an if statement to remove the last element if it matches the specified conditions. If it does not, try the previous element, and so on. 
            $("#notifications_list").children().last().remove();
        }
    },
    now: function get_time_now(){
        var time = new Date
        ,   hour = time.getHours()
        ,   mins = time.getMinutes();
        if(mins < 10){
            mins = "0"+mins;
        }
        return hour+":"+mins;
    }
}
