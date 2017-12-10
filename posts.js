class Posts {

	constructor(db){
		this.db = db;
	}

	newPost(collection, post){
		return this.db.newPost(collection, post)
			.catch((error) => {
				throw error;
			});

	}

	getPosts(collection, sort){
		return this.db.getPosts(collection, sort)
			.catch((error) =>{
				throw error;
			});
	}
}

module.exports = Posts;