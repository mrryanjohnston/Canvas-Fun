var port = 8060;
var session_key = "p2(236cVb3S#a'25gffDxrR|tb{{bddR31aAz35917";
var static_dir = "static";
var http = require('http')
  , express = require('express');
var app = express()
 .use(express.favicon('static/img/favicon-16.ico'))
 .use(express.logger('dev'))
 .use(express.static(static_dir))
 .use(express.directory(static_dir))
 .use(express.cookieParser())
 .use(express.session({ secret: session_key }));
app.listen(port);
console.log("Server is listening on port "+port+".");
