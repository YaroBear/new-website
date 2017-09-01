const express = require('express');
const app = express();
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const Handlebars = require('hbs');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

app.set('view-engine', 'hbs');

var routes = require('./routes.js');
app.use('/', routes);

// -- websocket

wss.on('connection', function connection(ws, req) {
	const location = url.parse(req.url, true);
	// You might use location.query.access_token to authenticate or share sessions
	// or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

	ws.on('message', function incoming(message) {
	console.log('received: %s', message);
	});

	ws.send('Got your message!');
	});

server.listen(3001, function listening() {
	console.log('Listening on %d', server.address().port);
});

app.listen(3000, function() {
	console.log("Running on port 3000");
});

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});