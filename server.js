/*
* SimpleServer
*/
var http = require('http');
var path = require('path');

var express = require('express');

/*
* SimpleServer `SimpleServer(obj)`
* Creates a new instance of SimpleServer with the following options:
* `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
*/
var app = express();
var server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, 'public')));

/*
*	this is required for angular to load urls properly when user requests url directly, e.g.
*	user if user requests dnbhub.com/index by typing it in browser's address bar
*/
app.use((req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});


server.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function(){
	var addr = server.address();
	console.log('Dnbhub server listening at', addr.address + ':' + addr.port);
});
