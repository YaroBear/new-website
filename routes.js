const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const userLogin = require('./user-login');
const mongoConnect = require('./mongo-connect');

const posts = require('./posts');

// -- API endpoints

require('./custom-helpers.js');

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
				MongoClient.connect(MONGO_URI)
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
	res.sendFile('/views/login.html', {root: __dirname});
});

app.post('/login', function(req, res) {

	if (!req.body.username || !req.body.password) {
		res.status(401).send({message: "you must provide a username and password"});
	}

	else {
		let mongoConnection = new mongoConnect(MONGO_URI);
		let login = new userLogin(mongoConnection).forTime("1h");

		login.doTheLogin(req.body.username, req.body.password)
			.then((token) => {
				res.send({token : token});
			})
			.catch((error) => {
				Object.defineProperty(error, 'message', {enumerable: true});
				res.status(500).send(error);
			});
	}
});

app.get('/posts', function(req, res) {

	let mongoConnection = new mongoConnect(MONGO_URI);
	let post = new posts(mongoConnection);

	return post.getPosts('posts', {date: -1})
		.then((posts) => {
			res.render('posts.hbs', {posts : posts});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send({message: "error retrieving posts"});
		});
});

app.get('/notes', function(req, res) {

	let mongoConnection = new mongoConnect(MONGO_URI);
	let post = new posts(mongoConnection);

	return post.getPosts('notes', {date: -1})
		.then((posts) => {
			res.render('posts.hbs', {posts : posts});
		})
		.catch((error) => {
			console.log(error);
			res.status(500).send({message: "error retrieving notes"});
		});
});

const adminRouter = require('./adminRouter.js');
app.use(adminRouter);

app.get('/admin/newpost', function(req,res) {
	res.sendFile('/views/newpost.html', {root: __dirname});
});

app.post('/admin/newpost', function (req, res) {

	if (!req.body.title || !req.body.body){
		res.status(400).send({message : 'title and body required'});
	}

	else {
		let mongoConnection = new mongoConnect(MONGO_URI);
		let post = new posts(mongoConnection);

		let data = {};
		data.title = req.body.title;
		data.body = req.body.body;
		data.date = new Date(Date.now());
		data.tags = req.body.tags.split(',');

		post.newPost('posts', data)
			.then(() =>{
				res.status(201).send({message : 'post added'});
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({message : 'error adding post'});
			});
	}
});

app.post('/admin/newnote', function (req, res) {
	var request = (req.query || req.body);
	var db;
	MongoClient.connect()
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