/**
* Basic settings
*/
var project_directory = __dirname;
var views_directory = project_directory+"/views/";
var static_directory = project_directory+"/static";
var favicon_path = static_directory+"/img/favicon-16.ico";
var port = 8060;
var session_key = "p2(236cVb3S#a'25gffDxrR|tb{{bddR31aAz35917";

/**
* Initialize node modules
*/
var http = require('http')
  , express = require('express')
  , cons = require('consolidate')
  , swig = require('swig');

/**
* Initialize express and give it middleware
*/
var app = express()
    .use(express.favicon(favicon_path))
    .use(express.logger('dev'))
    .use(express.static(static_directory))
    .use(express.cookieParser())
    .use(express.session({ secret: session_key }));

/**
* View settings
*/
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', views_directory ); // Tells swig where to look for templates
swig.init({ root: views_directory }); // Tells swig where to look for extended templates

/**
* Load the routes
*/
var routes = require(project_directory + '/routes.js')(app);

/**
* Start the app
*/
app.listen(port);
console.log("Server is listening on port "+port+".");
