module.exports = function routes_function(app, settings) {

var page_context = settings.context;

var debug = function(req){
    console.log(req.session);
};

/***
* / - About
*/
app.get('/', function(req, res) {
        page_context.page_title = '';
        res.render('about', {
            session: req.session,
            context: page_context
        });
    debug(req);
});

/***
* /chat - Global chat
*/
app.get('/chat', function(req, res) {
    if (req.session.username){
        page_context.page_title = ': Chat';
        res.render('chat', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /game - Playing games
*/
app.get('/game', function(req, res) {
    if (req.session.username){
        page_context.page_title = ': Game in progress';
        res.render('game', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /login - Login
*/

app.post('/login', function(req, res) {
    if(!req.session.username){
        var username = req.body.username
        ,   password = req.body.password;
        if( username === "username" && password === "password" ){
            req.session.username = req.body.username;
            res.send("OK");
        }else{
            res.send("Error.");
        }
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /logout - Logout
*/
app.get('/logout', function(req, res) {
    if (req.session.username){
        req.session.destroy();
        page_context.page_title = ': Logout';
        //req.session.messages.push("<li><p class=\"text-success\">You are signed out.</p></li>"); //This will never be seen.
        res.redirect('/');
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /signup - Registration
*/
app.get('/signup', function(req, res) {
    if (!req.session.username){
        page_context.page_title = ': Sign Up';
        res.render('signup', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /user - User Dashboard
*/
app.get('/user', function(req, res, next) {
    if (req.session.username){
        page_context.page_title = ': User Dashboard';
        res.render('user', {
            session: req.session,
            context: page_context
        });
    }else{
        res.redirect('*');
    }
    debug(req);
});

/***
* /404 and /* - 404 error
*/
app.get('/404', function(req, res, next) {
    page_context.page_title = ': Error';
    res.render('404', {
        session: req.session,
        context: page_context
    });
    debug(req);
});

app.get('*', function(req, res, next) {
    page_context.page_title = ': Error';
    res.redirect('/404');
    debug(req);
});

}
