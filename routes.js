const userLogin = require('./user-login');
const posts = require('./posts');
require('./custom-helpers.js');

module.exports = function(app, db){

	app.post('/login', function(req, res) {

		if (!req.body.username || !req.body.password) {
			res.status(401).send({message: "you must provide a username and password"});
		}

		else {
			let login = new userLogin(db).forTime("1h");

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

		let post = new posts(db);

		return post.getPosts('posts', {date: -1})
			.then((posts) => {
				res.status(200).send(posts)
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({message: "error retrieving posts"});
			});
	});

	app.get('/notes', function(req, res) {

		let post = new posts(db);

		return post.getPosts('notes', {date: -1})
			.then((posts) => {
				res.status(200).send(posts)
			})
			.catch((error) => {
				console.log(error);
				res.status(500).send({message: "error retrieving notes"});
			});
	});

	const adminRouter = require('./adminRouter.js');
	app.use(adminRouter);

	app.post('/admin/newpost', function(req, res) {

		if (!req.body.title || !req.body.body){
			res.status(400).send({message : 'title and body required'});
		}

		else {
			let post = new posts(db);

			let data = {};
			data.title = req.body.title;
			data.body = req.body.body;
			data.date = new Date(Date.now());
			if(req.body.tags){
				data.tags = req.body.tags.split(',');
			}
			

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

	app.post('/admin/newnote', function(req, res) {

		if (!req.body.title || !req.body.body){
			res.status(400).send({message : 'title and body required'});
		}

		else {
			let post = new posts(db);

			let data = {};
			data.title = req.body.title;
			data.body = req.body.body;
			data.date = new Date(Date.now());
			if(req.body.tags){
				data.tags = req.body.tags.split(',');
			}
			

			post.newPost('notes', data)
				.then(() =>{
					res.status(201).send({message : 'note added'});
				})
				.catch((error) => {
					console.log(error);
					res.status(500).send({message : 'error adding note'});
				});
		}
	});

	app.use(function (req, res, next) {
		res.status(404).send("Sorry can't find that!");
	});

	return app;
};
