module.exports = function routes_function(app, settings) {

var context = settings.context;

/***
* /
*/
app.get('/', function(req, res) {
    context.page = '';
    res.render('index', {
        context: context
    });
});

/***
* /chat
*/
app.get('/chat', function(req, res) {
    context.page = ': Chat';
    res.render('chat', {
        context: context
    });
});

/***
* /game
*/
app.get('/game', function(req, res) {
    context.page = ': Game in progress';
    res.render('game', {
        context: context
    });
});

/***
* /login
*/
app.get('/login', function(req, res) {
    context.page = ': Login';
    res.render('login', {
        context: context
    });
});

app.post('/login', function(req, res) {
    var username = req.body.username
    ,   password = req.body.password;
    if( username === "username" && password === "password" ){
        context.page = ': Signed in!';
        res.render('index', {
            context: context
        });
    }else{
        context.page = ': Login';
        context.errors.push("Error: The credentials you provided are not valid.");
        res.render('login', {
            context: context
        });
    }
});

/***
* /logout
*/
app.get('/logout', function(req, res) {
    context.page = ': Logout';
    context.messages.push("You were successfully signed out.");
    res.render('index', {
        context: context
    });
});

/***
* /signup
*/
app.get('/signup', function(req, res) {
    context.page = ': Sign Up';
    res.render('signup', {
        context: context
    });
});

/***
* /user
*/
app.get('/user', function(req, res, next) {
    context.page = ': User Settings';
    res.render('user', {
        context: context
    });
});

/***
* /about
*/
app.get('/about', function(req, res, next) {
    context.page = ': About';
    res.render('about', {
        context: context
    });
});

/***
* 404 error
*/
app.get('*', function(req, res, next) {
    context.page = ': Error';
    res.render('404', {
        context: context
    });
});

}
