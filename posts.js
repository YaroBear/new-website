class Posts {

	constructor(db){
		this.db = db;
	}

	newPost(){

	}

	getPosts(collection, sort){
		return this.db.getInstance()
			.then(() => {
				return this.db.getPosts(collection, sort);
			})
			.catch((error) =>{
				throw error;
			});
	}
}

module.exports = Posts;