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
* Load the database and models
*/
var mongoose = require('mongoose');
mongoose.connect(settings().database_host+":"+settings().database_port, settings().mongodb_options);
var models = require(settings().models_path)(settings);

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
* Start the app
*/
app.listen(settings().port_http);
server.listen(settings().port_sockets);

var color = require(settings().colors_path);

console.log(color.fggreen+"HTTP"+color.reset+" server is listening on port "+color.fggreen+color.bold+settings().port_http+color.reset+".");
console.log(color.fgred+"Sockets"+color.reset+" server is listening on port "+color.fgred+color.bold+settings().port_sockets+color.reset+".");
console.log(color.fgblue+color.bold+"========================================="+color.reset);

/**
* Load websockets
*/
var io_config = require(settings().project_directory + '/sockets.js')(settings);
