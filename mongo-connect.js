const MongoClient = require('mongodb').MongoClient;

class MongoConnect {

	constructor(uri){
		this.uri = uri;
		this.instance;
	}

	open(){
		return MongoClient.connect(this.uri);
	}

	close(){
		this.instance.close();
	}

	getInstance(){
		return this.open()
			.then((db) =>{
				this.instance = db;
				return this.instance;
			})
			.catch((error) =>{
				if(this.instance) return this.instance;
				throw error;
			});
	}

	getUser(collection, user){
		return this.instance.collection(collection).findOne({username: user})
			.then((user) =>{
				return user;
			})
			.catch((error) =>{
				throw error;
			});
	}

	getPosts(collection, sort){
		return this.instance.collection(collection).find().sort(sort).toArray()
			.then((posts) => {
				return posts;
			})
			.catch((error) => {
				throw error;
			});
	}

	newPost(collection, post){
		return this.instance.collection(collection).insertOne(post)
			.then((success) => {
				return success;
			})
			.catch((error) => {
				throw error;
			});
	}
}

module.exports = MongoConnect;