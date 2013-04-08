module.exports = function routes_function(app, settings) {

var page_context = settings.context;

var debug = function(req){
    console.log(req.session);
};

/***
* /
*/
app.get('/', function(req, res) {
    page_context.page_title = '';
    res.render('index', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

/***
* /chat
*/
app.get('/chat', function(req, res) {
    page_context.page_title = ': Chat';
    res.render('chat', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

/***
* /game
*/
app.get('/game', function(req, res) {
    page_context.page_title = ': Game in progress';
    res.render('game', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

/***
* /login
*/
app.get('/login', function(req, res) {
    page_context.page_title = ': Login';
    res.render('login', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

app.post('/login', function(req, res) {
    var username = req.body.username
    ,   password = req.body.password;
    if( username === "username" && password === "password" ){
        req.session.username = req.body.username;
        //req.session.messages.push("<li><p class=\"text-success\">You are signed in.</p></li>"); //This will never be seen.
        res.redirect('/chat');
    }else{
        page_context.page_title = ': Login';
        req.session.messages.push("<li><p class=\"text-error\">Error: The credentials you provided are not valid.</p></li>");
        res.render('login', {
            session: req.session,
            context: page_context
        });
    }
    debug(req);
});

/***
* /logout
*/
app.get('/logout', function(req, res) {
    req.session.destroy();
    page_context.page_title = ': Logout';
    //req.session.messages.push("<li><p class=\"text-success\">You are signed out.</p></li>"); //This will never be seen.
    res.redirect('/login');
    debug(req);
});

/***
* /signup
*/
app.get('/signup', function(req, res) {
    page_context.page_title = ': Sign Up';
    res.render('signup', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

/***
* /user
*/
app.get('/user', function(req, res, next) {
    page_context.page_title = ': User Settings';
    res.render('user', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

/***
* /about
*/
app.get('/about', function(req, res, next) {
    page_context.page_title = ': About';
    res.render('about', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

/***
* 404 error
*/
app.get('*', function(req, res, next) {
    page_context.page_title = ': Error';
    res.render('404', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

}
