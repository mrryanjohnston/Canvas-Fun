var port = 8060;
var session_key = "p2(236cVb3S#a'25gffDxrR|tb{{bddR31aAz35917";
var connect = require('connect')
  , http = require('http');
var app = connect()
    .use(connect.favicon())
    .use(connect.logger('dev'))
    .use(connect.static('static'))
    .use(connect.directory('static'))
    .use(connect.cookieParser())
    .use(connect.session({ secret: session_key }));
http.createServer(app).listen(port);
console.log("Server is listening on port "+port+".");
