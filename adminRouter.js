const express = require('express');
const app = express();
require('dotenv').config();
var jwt = require('jsonwebtoken');
var JWT_SECRET = process.env.JWT_SECRET;

app.use('/admin/', function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, JWT_SECRET, function(err, decoded) {
			if (err) {
				res.status(403).send("failed to authenticate user");
			}
			else {
				req.decoded = decoded;
				next();
			}
		});
	}
	else {
		res.status(403).send("forbidden");
	}
});

