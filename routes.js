const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
var uri = process.env.MONGO_URI;
var bcrypt = require('bcrypt');

// -- API endpoints

require('./customHelpers.js');

app.get('/', function(req, res){
	res.send("Nothing here yet");
});

app.post('/createAdmin', function(req, res){
	var request = (req.query || req.body);
	var db;
	bcrypt.compare(request.secretPassword, process.env.SECRET)
		.then(function(same){
			if (same)
			{
				MongoClient.connect(uri)
					.then(function(cursor){
						db = cursor;
						console.log("connected to db");
						return bcrypt.hash(request.userPassword, 8);
					})
					.then(function(hash)
					{
						var newAdmin = {
							username: request.username,
							password: hash,
							admin: true,
							dateCreated: Date.now()
						};
						return db.collection('users').insertOne(newAdmin);
					})
					.then(function(success){
						console.log("new admin created");
						res.send("new admin created");
					})
					.catch(function(err){
						console.log(err);
						res.send("error");
					})
					.then(function(){
						db.close();
						console.log("db closed");
					});
			}
			else res.status(403).send("wrong password");
	});
});

app.get('/login', function(req, res) {
	res.render('login.hbs');
});

app.post('/login', function(req, res) {
	var request = (req.query || req.body);
	var db;
	console.log(request);
	MongoClient.connect(uri)
		.then(function(cursor){
			db = cursor;
			console.log("connected to db");
			return db.collection('users').findOne({username: request.username});
		})
		.then(function(user){
			console.log(user);
			return bcrypt.compare(request.password, user.password);
		})
		.then(function(same){
			if (same)
			{
				console.log("They're the same!");
				//produce jwt
				res.send("Logged in");	
			}
			else res.status(401).send({message: "wrong username and/or password"});
		})
		.catch(function(err){
			console.log(err);
			res.send("error");
		})
		.then(function(){
			db.close();
		});
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

app.post('/admin/newpost', function (req, res) {
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