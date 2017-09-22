var App = require('../app.js');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

describe('API endpoint test', function() {
	it('should pass this canary test', function(){
		expect(true).to.be.true;
	});

	it('should get the index page', (done) => {
		chai.request(App)
			.get('/')
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});

	it('should get a 401 error for not providing username or password at /login', function(){
		chai.request(App)
			.post('/login')
			.send()
			.end((err, res) => {
				expect(true).to.be.false;
				/* tests end before this is even run???
				expect(err.status).to.be.eql(500);
				err.should.have.status(200);
				expect(err.message).to.eventually.have("you must provide username and password");
				/*
			});	
	});
});