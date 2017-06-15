const {MongoClient} = require('mongodb');
const test = require('assert');
const {mongoURL: dburl } = require('./config');


const connectToMongo = function(successcallback) {
	MongoClient.connect("mongodb://localhost:27017/shorturl", function(err, db) {
		if(err){
			successcallback(err);
			return;
		}
		successcallback(null, db);
	});
};

module.exports.connectToMongo = connectToMongo;


