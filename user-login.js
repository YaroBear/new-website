const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

class UserLogin {

	constructor(db){
		this.db = db;
	}

	getUser(user){
		return this.db.getUser('users', user)
			.then((user) => {
				if(user) return user;
				else throw new Error("Invalid credentials");
			});
	}

	checkCredentials(entryPassword, actualPassword){
		return bcrypt.compare(entryPassword, actualPassword)
			.then((valid) =>{
				if (valid) return true;
				else throw new Error("Invalid credentials");
			})
	}

	generateToken(payload){
		let token = jwt.sign(payload, JWT_SECRET, {
			expiresIn: "1h"
		});
		return token;
	}

	doTheLogin(username, password){
		let payload = {};
		return this.db.getInstance()
			.then(() =>{
				return this.getUser(username);
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