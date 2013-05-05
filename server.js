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

//var cookie_parser = express.cookieParser(settings.session_secret);
var cookie_parser = express.cookieParser(settings.session_secret);
var cookie_signature = require('cookie-signature');
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
//var SessionSockets = require('session.socket.io');
//var session_sockets = new SessionSockets(io, session_store, cookie_parser, settings.session_secret);
var io_config = require(settings.project_directory + '/sockets.js')(settings, io, app, models);//, session_sockets);
// Authenticate sockets with sessions stored in redis
// https://github.com/alphapeter/socket.io-express
var socket_authentication = require('socket.io-express').createAuthFunction(cookie_parser, redis_store);
io.set('authorization', function(handshake, callback){
    console.log(handshake);
    console.log("##");
    //try{
        if (handshake.headers.cookie) {
            var sessionCookie = cookie.parse(handshake.headers.cookie)[settings.session_key];
            //var sessionID = cookie.parseCookie(sessionCookie, settings.session_secret);
            //var sessionID = cookie.parseSignedCookies(sessionCookie, settings.session_secret);
            //var sessionID = express.utils.parseSignedCookie(sessionCookie[settings.session_key], settings.session_secret);
            //var sessionID = express.utils.parseCookie(cookie.parse(sessionCookie[settings.session_key]), settings.session_secret);
            //console.log(sessionCookie);
            //console.log("----");
            var sessionID = sessionCookie.slice(2,26);
            var sessionID1 = sessionCookie.slice(2, sessionCookie.lastIndexOf('.'));
            var sessionID2 = sessionCookie.slice(2);
            //var sessionID2 = sessionCookie.slice(2,111);
//            var sessionID3 = sessionCookie;
//            var sessionID4 = sessionCookie.slice(0,26);
//            var sessionID5 = sessionCookie.slice(0,sessionCookie.lastIndexOf('.'));
//            var sessionID6 = sessionCookie.slice(2,sessionCookie.lastIndexOf('.'));
//            var sessionIb = cookie_signature.unsign(sessionID4, settings.session_secret);
            //var sessionIc = cookie_signature.unsign(sessionID2, settings.session_secret);
            //console.log(express.session.Store);
            console.log(sessionCookie);
            //console.log(sessionID);
            //console.log("/////");
            console.log("s:"+cookie_signature.sign(sessionID, settings.session_secret));
            console.log("s:"+cookie_signature.sign(sessionID2, settings.session_secret));
            var sessionIDU1 = cookie_signature.unsign(sessionID, settings.session_secret);
            var sessionIDU2 = cookie_signature.unsign(sessionID1, settings.session_secret);
            var sessionIDU3 = cookie_signature.unsign(sessionID2, settings.session_secret);
            console.log("!!! >>> "+sessionIDU1);
            console.log("!!! >>> "+sessionIDU2);
            console.log("!!! >>> "+sessionIDU3);
            console.log(cookie_signature.sign("_t92ptnewGjXKfShCUQY2S1e", settings.session_secret));
            //console.log(sessionCookie);
            //console.log("----");
//            console.log(cookie_signature.sign(sessionID, settings.session_secret));
            //console.log(cookie_signature.sign(sessionID2, settings.session_secret));
//            console.log(cookie_signature.sign(sessionID3, settings.session_secret));
//            console.log(cookie_signature.sign(sessionID4, settings.session_secret));
//            console.log(cookie_signature.sign(sessionID5, settings.session_secret));
//            console.log(cookie_signature.sign(sessionID6, settings.session_secret));
            //console.log(sessionID);
            //handshake.sessionID = sessionCookie;
            
            session_store.get(sessionID, function(error, session) {
                if (error || !session) {
                    callback('Error'+error, false);
                    console.log("Auth Error");
                } else {
                    handshake.session = session;
                    handshake.sessionID = sessionID;
                    console.log("Auth OK!");
                    callback(null, true);
                }
            });
            //callback(null, true);
        } else {
            callback('No cookie', false);
        }
    //}catch(error){
    //    callback('No cookie. '+error, false);
    //}
});

/**
* Start the app
*/
server.listen(settings.port);

console.log(color.fgwhite+color.bold+"========================================="+color.reset);
console.log(color.fgwhite+"Running release number "+color.bold+settings.context.version+color.reset);
console.log(color.fggreen+"HTTP"+color.reset+" and "+color.fgred+"Socket"+color.reset+" servers are listening on port "+color.fggreen+color.bold+settings.port+color.reset+".");
console.log(color.fgwhite+color.bold+"========================================="+color.reset);

