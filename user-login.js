const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const URI = process.env.MONGO_URI;

class UserLogin{
	static connectToDB(uri){
		return MongoClient.connect(uri);
	}
	static findUser(cursor, user){
		return cursor.collection('users').findOne({username: user})
			.then((user) => {
				if(user) return user;
				else throw new Error("Invalid credentials");
			});
	}

	static checkCredentials(entryPassword, actualPassword){
		return bcrypt.compare(entryPassword, actualPassword)
			.then((valid) =>{
				if (valid) return true;
				else throw new Error("Invalid credentials");
			})
	}

	static generateToken(payload){
		let token = jwt.sign(payload, JWT_SECRET, {
			expiresIn: "1h"
		});
		return token;
	}

	static doTheLogin(username, password){
		let payload = {};
		return this.connectToDB(URI)
			.then((cursor) =>{
				return this.findUser(cursor, username);
			})
			.then((user) => {
				payload.username = user.username;
				return this.checkCredentials(password, user.password);
			})
			.then((passwordMatch) =>{
				return this.generateToken(payload);
			})
			.catch((error) => {
				throw error;
			});
	}
}

module.exports = UserLogin;