/**
* Load settings
*/
var Settings = require('./settings.js');
var settings = new Settings();
console.log("Settings loaded.");
var color = require(settings.colors_path);
console.log(color.fgred+"C"+color.fggreen+"o"+color.fgyellow+"l"+color.fgblue+"o"+color.fgmagenta+"r"+color.fgcyan+"s "+color.fgwhite+"l"+color.fgred+"o"+color.fggreen+"a"+color.fgyellow+"d"+color.fgblue+"e"+color.fgmagenta+"d"+color.fgcyan+"."+color.reset);

/**
* Initialize node modules and express middleware
*/
var express = require('express');
console.log(color.fgmagenta+"Express loaded."+color.reset);
var redis_store = require('connect-redis')(express);
console.log(color.fgblue+"Redis loaded."+color.reset);
var session_store = new redis_store(settings.redis_settings);
var app = express()
    .use(express.favicon(settings.favicon_path))
    .use(express.logger('dev'))
    .use(express.static(settings.static_directory))
    .use(express.compress())
//    .use(express.cookieParser(settings.cookie_secret))
//    .use(express.cookieParser(settings.session_secret))
    .use(express.bodyParser())
    .use(express.methodOverride());
//    .use(express.session({ store: session_store, key: settings.session_key }));

var cookie_parser = express.cookieParser(settings.session_secret);
var cookie = require('cookie');
//var parseSignedCookie = require('cookie');
app.use(cookie_parser)
app.use(express.session({ store: session_store, key: settings.session_key, secret: settings.session_secret }));

console.log(color.bgmagenta+color.fgblack+"Express started."+color.reset);
console.log(color.bgblue+"Redis connected."+color.reset);

app.response.message = function(msg){
    var session = this.req.session;
    session.messages = session.messages || [];
    session.messages.push(msg);
};

app.use(function(req, res, next){
    var msgs = req.session.messages || [];
    res.locals.messages = msgs;
    res.locals.hasMessages = !! msgs.length;
    req.session.messages = [];
    next();
});

var server = require('http').createServer(app);
console.log(color.fggreen+"HTTP Server started."+color.reset);
var cons = require('consolidate');
console.log(color.fgyellow+"Consolidate loaded."+color.reset);
var swig = require('swig');
console.log(color.fgred+"Swig loaded."+color.reset);
var io = require('socket.io').listen(server);
console.log(color.fgcyan+"Socket.io loaded."+color.reset);

/**
* Load the database and models
*/
var mongoose = require('mongoose');
console.log(color.fgwhite+"DB loaded."+color.reset);
mongoose.connect(settings.database_host+":"+settings.database_port+"/"+settings.mongodb_database_name, settings.mongodb_options);
console.log(color.bgwhite+color.fgblack+"DB connected."+color.reset);
var models = require(settings.models_path)(mongoose, settings);
console.log(color.fgblue+"Models loaded."+color.reset);

/**
* View settings
*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', settings.views_directory );//Tells swig where to look for templates
swig.init({ root: settings.views_directory, autoescape: false });//Tells swig where to look for extended templates

var crypto = require('crypto');
console.log(color.fggreen+"Crypto loaded."+color.reset);

/**
* Load the routes
*/
var routes = require(settings.routes_path)(app, settings, models, crypto, color);
console.log(color.fgyellow+"Routes loaded."+color.reset);

/**
* Load websockets
*/
var SessionSockets = require('session.socket.io');
var session_sockets = new SessionSockets(io, session_store, cookie_parser, settings.session_secret);
var io_config = require(settings.project_directory + '/sockets.js')(settings, io, app, models, session_sockets);
// Authenticate sockets with sessions stored in redis
// https://github.com/alphapeter/socket.io-express
//var socket_authentication = require('socket.io-express').createAuthFunction(cookie_parser, redis_store);
//io.set('authorization', function(handshake, callback){
//    console.log(handshake);
//    //try{
//        if (handshake.headers.cookie) {
//            var sessionCookie = require('cookie').parse(handshake.headers.cookie);
//            //var sessionID = require('cookie').parseSignedCookies(sessionCookie, settings.session_secret);
//            //var sessionID = express.utils.parseSignedCookie(sessionCookie[settings.session_key], settings.session_secret);
//            var sessionID = express.utils.parseCookie(require('cookie').parse(sessionCookie[settings.session_key]), settings.session_secret);
//            var session_d = sessionCookie[settings.session_key];
//            console.log(sessionCookie);
//            //console.log(express.session.Store);
//            //console.log("----");
//            console.log(sessionID);
//            session_store.get(sessionID, function(error, session) {
//                if (error || !session) {
//                    callback('Error'+error, false);
//                } else {
//                    handshake.session = session;
//                    handshake.sessionID = sessionID;
//                    callback(null, true);
//                }
//            });
//        } else {
//            callback('No cookie', false);
//        }
//    //}catch(error){
//    //    callback('No cookie. '+error, false);
//    //}
//});

/**
* Start the app
*/
server.listen(settings.port);

console.log(color.fgwhite+color.bold+"========================================="+color.reset);
console.log(color.fgwhite+"Running release number "+color.bold+settings.context.version+color.reset);
console.log(color.fggreen+"HTTP"+color.reset+" and "+color.fgred+"Socket"+color.reset+" servers are listening on port "+color.fggreen+color.bold+settings.port+color.reset+".");
console.log(color.fgwhite+color.bold+"========================================="+color.reset);

