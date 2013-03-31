/**
* Load settings
*/
var settings = require('./settings.js');

/**
* Initialize node modules
*/
var http = require('http')
  , express = require('express')
  , server = http.createServer(app)
  , cons = require('consolidate')
  , swig = require('swig')
  , mongo = require('mongodb')
  , io = require('socket.io').listen(server);

/**
* Initialize express and give it middleware
*/
var app = express()
    .use(express.favicon(settings().favicon_path))
    .use(express.logger('dev'))
    .use(express.static(settings().static_directory))
    .use(express.cookieParser())
    .use(express.session({ secret: settings().session_key }));

/**
* View settings
*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', settings().views_directory );//Tells swig where to look for templates
swig.init({ root: settings().views_directory });//Tells swig where to look for extended templates

/**
* Load the routes
*/
var routes = require(settings().routes_path)(app);

/**
* Load the database
*/
var database = require(settings().database_path)(settings);

/**
* Start the app
*/
app.listen(settings().port_http);
server.listen(settings().port_sockets);

var color = require('./colors.js');

console.log(color.green+"Server "+color.reset+"is listening on port "+color.green_b+settings().port_http+color.reset+".");
console.log(color.red+"Sockets "+color.reset+"are listening on port "+color.red_b+settings().port_sockets+color.reset+".");

/**
* Load websockets
*/
var io_config = require(settings().project_directory + '/sockets.js')(settings);
