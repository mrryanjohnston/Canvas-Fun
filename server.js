/**
* Load settings
*/
var Settings = require('./settings.js');
var settings = new Settings();
console.log("Settings loaded.");
var color = require(settings.colors_path);
console.log(color.fgred+"C"+color.fggreen+"o"+color.fgyellow+"l"+color.fgblue+"o"+color.fgmagenta+"r"+color.fgcyan+"s "+color.fgwhite+"l"+color.fgred+"o"+color.fggreen+"a"+color.fgyellow+"d"+color.fgblue+"e"+color.fgmagenta+"d"+color.fgcyan+"."+color.reset);

/**
* Initialize node modules
*/
var http = require('http');
console.log(color.fggreen+"HTTP loaded."+color.reset);
var express = require('express');
console.log(color.fgmagenta+"Express loaded."+color.reset);
var server = http.createServer(app);
console.log(color.bggreen+color.fgblack+"HTTP Server started."+color.reset);
var cons = require('consolidate');
console.log(color.fgyellow+"Consolidate loaded."+color.reset);
var swig = require('swig');
console.log(color.fgred+"Swig loaded."+color.reset);
var io = require('socket.io').listen(server);
console.log(color.fgcyan+"Socket.io loaded."+color.reset);

/**
* Initialize express and give it middleware
*/
var app = express()
    .use(express.favicon(settings.favicon_path))
    .use(express.logger('dev'))
    .use(express.static(settings.static_directory))
    .use(express.cookieParser())
    .use(express.bodyParser())
    .use(express.methodOverride())
    .use(express.session({ secret: settings.session_key }));

app.response.message = function(msg){
    var sess = this.req.session;
    sess.messages = sess.messages || [];
    sess.messages.push(msg);
};

app.use(function(req, res, next){
    var msgs = req.session.messages || [];
    res.locals.messages = msgs;
    res.locals.hasMessages = !! msgs.length;
    req.session.messages = [];
    next();
});

console.log(color.bgmagenta+color.fgblack+"Express started."+color.reset);

/**
* Load the database and models
*/
var mongoose = require('mongoose');
console.log(color.fgwhite+"DB loaded."+color.reset);
mongoose.connect(settings.database_host+":"+settings.database_port, settings.mongodb_options);
console.log(color.bgwhite+color.fgblack+"DB connected."+color.reset);
var models = require(settings.models_path)(mongoose);
console.log(color.fgblue+"Models loaded."+color.reset);

/**
* View settings
*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', settings.views_directory );//Tells swig where to look for templates
swig.init({ root: settings.views_directory, autoescape: true });//Tells swig where to look for extended templates

/**
* Load the routes
*/
var routes = require(settings.routes_path)(app, settings);
console.log(color.fgyellow+"Routes loaded."+color.reset);

/**
* Load websockets
*/
var io_config = require(settings.project_directory + '/sockets.js')(settings);

/**
* Start the app
*/
app.listen(settings.port_http);
server.listen(settings.port_sockets);

console.log(color.fgwhite+color.bold+"========================================="+color.reset);
console.log(color.fgwhite+"Running release number "+color.bold+settings.context.version+color.reset);
console.log(color.fggreen+"HTTP"+color.reset+" server is listening on port "+color.fggreen+color.bold+settings.port_http+color.reset+".");
console.log(color.fgred+"Sockets"+color.reset+" server is listening on port "+color.fgred+color.bold+settings.port_sockets+color.reset+".");
console.log(color.fgwhite+color.bold+"========================================="+color.reset);

var crypto = require('crypto');
//console.log(crypto.createHash("sha1").update("saltypassword").digest("hex"));
//console.log(crypto.createHmac("sha1","salty").update("password").digest("hex"));
