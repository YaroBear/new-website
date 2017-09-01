const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
var uri = process.env.MONGO_URI;

// -- API endpoints

require('./customHelpers.js');

app.get('/', function(req, res){
	res.send("Nothing here yet");
});

app.get('/posts', function (req, res) {
	var request = (req.query || req.body);
	var db;
	MongoClient.connect(uri)
		.then(function(cursor){
			db = cursor;
			console.log("connected to db");
			return db.collection('posts').find().sort({date: -1}).toArray();
		})
		.then(function(documents){
			var context = {posts: documents};
			res.render('posts.hbs', context);

		})
		.catch(function(err){
			console.log(err);
			res.send("error");
		})
		.then(function(){
			db.close();
			console.log("db closed");
		});
});

app.post('/posts', function (req, res) {
	var request = (req.query || req.body);
	var db;
	MongoClient.connect(uri)
		.then(function(cursor){
			db = cursor;
			console.log("connected to db");
			var posts = db.collection('posts');
			var newPost = {title: request.title, body: request.body, date: Date.now()};
			return posts.insertOne(newPost);
		})
		.then(function(response){
			console.log("post added");
			res.send("post added");
		}).catch(function(err){
			console.log(err);
			res.send("error");
		})
		.then(function(){
			db.close();
			console.log("db closed");
		});
});

app.use(function (req, res, next) {
	res.status(404).send("Sorry can't find that!");
});


module.exports = app;