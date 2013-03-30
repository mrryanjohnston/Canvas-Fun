module.exports = function(app) {

app.get('/', function(req, res) {
    res.render('index', {
        page: ''
    }); 
});

app.get('/login', function(req, res) {
    res.render('login', {
        page: ': Login'
    }); 
});

app.get('/signup', function(req, res) {
    res.render('signup', {
        page: ': Sign Up' 
    }); 
});

}
