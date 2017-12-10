const express = require('express');
const app = express();
const http = require('http');
const url = require('url');
const Handlebars = require('hbs');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;
const mongoConnect = require('./mongo-connect');

app.use(express.static('public'));

app.set('view-engine', 'hbs');

var routes = require('./routes.js');

const db = new mongoConnect(MONGO_URI);

db.getInstance()
	.then(() =>{
		routes(app, db);

		app.listen(3000, function() {
			console.log("Running on port 3000");
		});
});

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

module.exports = app;