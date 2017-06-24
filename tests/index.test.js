const expect = require('expect');
const request = require('supertest');
const {app} = require('./../index.js');


describe("UrlChecker", function ()  {
	describe("#Valid urls are passed", function ()  {

		it("http://google.com should pass as valid url", function(done) {
			urlchecker("http://google.com",  done);
		});

		it("https://docs.mongodb.com/ecosystem/drivers/ should pass as valid url", function (done) {
			urlchecker("https://docs.mongodb.com/ecosystem/drivers/", done);
		});

	});


	describe("#Invalid urls are not passed", function ()  {
		this.slow(10000);

		it("http://hooli.com should not pass as valid url", function(done) {
			urlchecker("http://notvalidsiteeverexisted.commocha",  (err, result) => {
				if (err) { 
					done(null, err);
				}
				else {
					done("error");
				}

			});
		});


		it("bazoooka,org should not pass as valid url", function(done) {
			urlchecker("bazoooka,org",  (err, result) => {
				if (err) { 
					done(null, err);
				}
				else {
					done("error");
				}

			});
		});

		
	});


});

