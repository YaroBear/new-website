const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
var uri = process.env.MONGO_URI;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET;

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
						if (db) {
							db.close();
							console.log("db closed");
						}
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
	var payload;
	MongoClient.connect(uri)
		.then(function(cursor){
			db = cursor;
			console.log("connected to db");
			return db.collection('users').findOne({username: request.username});
		})
		.then(function(user){
			console.log("user found");
			payload = {
				userID: user["_id"],
				username: user.username
			};
			return bcrypt.compare(request.password, user.password);
		})
		.then(function(same){
			if (same)
			{
				console.log("user " + payload.username + " given token");
				var token = jwt.sign(payload, JWT_SECRET, {
					expiresIn: 60 * 60
				});
				res.send(token);	
			}
			else res.status(401).send({message: "wrong username and/or password"});
		})
		.catch(function(err){
			console.log(err);
			res.send("error");
		})
		.then(function(){
			if (db) {
				db.close();
				console.log("db closed");
			}
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
			if (db) {
				db.close();
				console.log("db closed");
			}
		});
});

app.get('/notes', function (req, res) {
	var request = (req.query || req.body);
	var db;
	MongoClient.connect(uri)
		.then(function(cursor){
			db = cursor;
			console.log("connected to db");
			return db.collection('notes').find().sort({date: -1}).toArray();
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
			if (db) {
				db.close();
				console.log("db closed");
			}
		});
});

const adminRouter = require('./adminRouter.js');
app.use(adminRouter);

app.post('/admin/newpost', function (req, res) {
	var request = (req.query || req.body);
	var db;
	MongoClient.connect(uri)
		.then(function(cursor){
			db = cursor;
			console.log("connected to db");
			var posts = db.collection('posts');
			var tagsString = request.tags;
			var tagsArray = tagsString.split(',');
			var newPost = {title: request.title, body: request.body, date: Date.now(), tags: tagsArray};
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
			if (db) {
				db.close();
				console.log("db closed");
			}
		});
});

app.post('/admin/newnote', function (req, res) {
	var request = (req.query || req.body);
	var db;
	MongoClient.connect(uri)
		.then(function(cursor){
			db = cursor;
			console.log("connected to db");
			var posts = db.collection('notes');
			var tagsString = request.tags;
			var tagsArray = tagsString.split(',');
			var newNote = {title: request.title, body: request.body, date: Date.now(), tags: tagsArray};
			return posts.insertOne(newNote);
		})
		.then(function(response){
			console.log("node added");
			res.send("note added");
		}).catch(function(err){
			console.log(err);
			res.send("error");
		})
		.then(function(){
			if (db) {
				db.close();
				console.log("db closed");
			}
		});
});

app.use(function (req, res, next) {
	res.status(404).send("Sorry can't find that!");
});


module.exports = app;