const express = require('express');
const http = require('http');
const url = require('url');
const app = express();
const WebSocket = require('ws');
const Handlebars = require('hbs');
const MongoClient = require('mongodb').MongoClient;

var uri = "secret";


app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set('view-engine', 'hbs');

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

const customHelpers = require('./customHelpers.js');

app.get('/posts', function (req, res) {
	var request = (req.query || req.body);
	var context;
	MongoClient.connect(uri, function(err, db){
		console.log("Connected to db");
		db.collection('posts').find().toArray(function(err, documents){
			var context = {posts: documents};
			res.render('posts.hbs', context);
		});
		db.close();
	});
});

app.post('/posts', function (req, res) {
	var request = (req.query || req.body);
	MongoClient.connect(uri, function(err, db){
		console.log("Connected to db");
		var posts = db.collection('posts');
		var newPost = {title: request.title, body: request.body, date: Date.now()};
		posts.insertOne(newPost);
		db.close();
	});

	res.send("Success");


});



app.use(function (req, res, next) {
	res.status(404).send("Sorry can't find that!");
});

app.listen(3000, function() {
	console.log("Running on port 3000");
});

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
})