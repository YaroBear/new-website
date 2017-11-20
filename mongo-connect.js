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
				this.close();
				return user;
			})
			.catch((error) =>{
				this.close();
				throw error;
			});
	}

	getPosts(collection, sort){
		return this.instance.collection(collection).find().sort(sort).toArray()
			.then((posts) => {
				this.close();
				return posts;
			})
			.catch((error) => {
				this.close();
				throw error;
			});
	}

	newPost(collection, post){
		return this.instance.collection(collection).insertOne(post)
			.then((success) => {
				this.close();
				return success;
			})
			.catch((error) => {
				this.close();
				throw error;
			});
	}
}

module.exports = MongoConnect;