$(document).ready(function() {
    $('#login_form').submit(function(event){
        event.preventDefault();
        helpers.login();
    });
})
