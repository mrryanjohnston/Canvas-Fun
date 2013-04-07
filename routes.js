module.exports = function routes_function(app) {

app.get('/', function(req, res) {
    context.page = '';
    res.render('index', {
        context: context
    });
});

app.get('/chat', function(req, res) {
    context.page = ': Chat';
    res.render('chat', {
        context: context
    });
});

app.get('/game', function(req, res) {
    context.page = ': Game in progress';
    res.render('game', {
        context: context
    });
});

app.get('/login', function(req, res) {
    context.page = ': Login';
    res.render('login', {
        context: context
    });
});

app.get('/logout', function(req, res) {
    context.page = ': Logout';
    res.render('logout', {
        context: context
    });
});

app.get('/signup', function(req, res) {
    context.page = ': Sign Up';
    res.render('signup', {
        context: context
    });
});

app.get('/user', function(req, res, next) {
    context.page = ': User Settings';
    res.render('user', {
        context: context
    });
});

app.get('/about', function(req, res, next) {
    context.page = ': About';
    res.render('about', {
        context: context
    });
});

app.get('*', function(req, res, next) {
    context.page = ': Error';
    res.render('404', {
        context: context
    });
});

}
