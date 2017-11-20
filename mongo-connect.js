const MongoClient = require('mongodb').MongoClient;

class MongoConnect {

	constructor(uri){
		this.uri = uri;
		this.instance;
	}

	getInstance(){
		return MongoClient.connect(this.uri)
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
		return this.instance.collection(collection).findOne({username: user});
	}
}

module.exports = MongoConnect;