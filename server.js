var port = 8040;
var session_key = "p2(236cVb3S#a'25gffDxrR|tb{{bddR31aAz35917";
var static_dir = "static";
var favicon_path = static_dir+"/img/favicon-16.ico";

var http = require('http')
  , express = require('express')
  , cons = require('consolidate')
  , swig = require('swig');
var app = express()
    .use(express.favicon(favicon_path))
    .use(express.logger('dev'))
    .use(express.static(static_dir))
    //.use(express.directory(static_dir))
    .use(express.cookieParser())
    .use(express.session({ secret: session_key }));
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.init({ root: __dirname + '/views' });

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

app.listen(port);
console.log("Server is listening on port "+port+".");
