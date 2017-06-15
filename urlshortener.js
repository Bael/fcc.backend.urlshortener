const {MongoClient} = require('mongodb')
const test = require('assert');
const {mongoURL: dburl } = require('./config');
const {connectToMongo} = require('./db');





const findShortUrl = function(collection, originalURL, callback) {

	collection.find({originalURL}).limit(1).toArray((err, result) => {
		let value = null;
		if (result !== null && result.length > 0) {
			value = result[0];
		}
		callback(err, value);
	})
};


const getNextIndex = function(collection, callback) {
	
	collection.count((err, count) => {
		if (err) { 
			callback(err);
		} else { 
			callback(null, count+1);
		};
	});;
}

const insertNewLink = function(collection, originalURL, index, callback) {
	let newLinkObj = {originalURL:originalURL, shortUrl:index};
	console.log(newLinkObj);
	collection.insert(newLinkObj, (err, result) => {
		if(err){
			console.error("error creating new link " + err);
			return callback(err);
		}
		callback(null, result);

	});
}

module.exports.getShortUrl = function(originalURL, cb) { 

	connectToMongo((err, db) => {
		if (err) {
			db.close();
			return cb(err)
		};

		let collection = db.collection('links');

		findShortUrl(collection, originalURL, function(err, result) {
			if(err) return cb(err);

			if(result) {
				return cb(null, result);
			} else {
				// get new index
				getNextIndex(collection, function(err, nextIndex) {
					if(err) return err;

					// create new 

					insertNewLink(collection, originalURL, nextIndex, function (err, newLink) {
						if(err) return cb(err);

						return cb(null, newLink);
					})

				});

			};

		});

		

	});
};

/*


module.exports.getShortUrl = function(urlToShort, cb) {
	
	// Connect using MongoClient
	const options = {server: {socketOptions: {keepAlive: 1}}};
	MongoClient.connect("mongodb://localhost:27017/shorturl", options, function(err, db) {
		if(err){
			cb(err);
			return;
		}
 

	 	var collection = db.collection('links');
	 	// Add an unique index to shortUrl to force errors in the batch insert
		collection.ensureIndex({shortUrl:1}, {unique:true}, function(err) {	
			if(err) {
				cb(err);
				return;
			}


		  	collection.count((err, data) => {
		  		if (err) { 
		  			db.close();
		  			cb(err);

		  		} else { 
		  			 collection.insert({originalURL:urlToShort, shortUrl:data+1}, 
		  			 	function(err, result) {
		  			 		if (err) { 
		  			 			console.log("error on insert " + err);
		  			 			db.close();
		  			 			cb(err) ;
		  			 		} else {
		  			 				console.log('count is '+data);
		  			 				cb(null, data+1);
		  			 			};
		  			 			db.close();
		  			 	});
		  		};
		     	
		 	});
	  });

 	
	});
};

module.exports.getOriginalUrl = function(shortUrl) {
	return shortUrl;
};
*/