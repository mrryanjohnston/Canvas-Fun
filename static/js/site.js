//$(document).ready(function on_page_load() {
//
//})

$('#login_form').submit(function(event){
    event.preventDefault();
    helpers.login();
});
