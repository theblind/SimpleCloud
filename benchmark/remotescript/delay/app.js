/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var WebSocketServer = require("ws").Server;

var uploadresult = require("./routes/uploadresult");
var ajaxbench = require("./routes/ajaxbench");
var constwebsocket = require("./routes/constantwebsocket");
var wslib = require("./lib/wslib");
var setting = require("./setting");

var app = express();

// all environments
app.set('port', setting.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));

app.use(express.bodyParser());

app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.post("/uploadresult", uploadresult.index);
app.get("/ajaxbench", ajaxbench.index);
app.get("/websocket", constwebsocket.index);


var wsapp = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


var wss = new WebSocketServer({server: wsapp});

wss.on("connection", function(ws){
	console.log("new websocket client is connecting....");
	ws.on("message", function(message, flags){
		wslib.wsinteractive(message, flags, ws);
	});
	ws.on("close", function(code, message){
		wslib.wsclosed(code, message, ws);
		console.log("current connection number is %d", wss.clients);
	});
})