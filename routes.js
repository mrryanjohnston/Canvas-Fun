module.exports = function routes_function(app) {

app.get('/', function(req, res) {
    res.render('index', {
        page: '',
        context: ''
    }); 
});

app.get('/login', function(req, res) {
    res.render('login', {
        page: ': Login',
        context: ''
    }); 
});

app.get('/signup', function(req, res) {
    res.render('signup', {
        page: ': Sign Up',
        context: ''
    }); 
});

app.get('*', function(req, res, next) {
    res.render('404', {
        page: ': Error',
        context: ''
    });
});

}
