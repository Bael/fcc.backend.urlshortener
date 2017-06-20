
const findShortUrl = function(collection, originalURL, callback) {
	collection.findOne({originalURL}, callback);
};

const getNextIndex = function(collection, callback) {
	
	collection.count((err, count) => {
		if (err) { 
			callback(err);
		} else { 
			callback(null, count+1);
		}
	});
};

const insertNewLink = function(collection, originalURL, index, callback) {
	let newLinkObj = {originalURL:originalURL, shortUrl:index};
	// console.log(newLinkObj);
	collection.insert(newLinkObj, (err, result) => {
		if(err){
			//console.error("error creating new link " + err);
			return callback(err);
		}
		callback(null, result);

	});
};
module.exports.findOriginalUrl = function(db, shortUrl, callback) {
			let collection = db.collection('links');
			collection.findOne({shortUrl:parseInt(shortUrl)}, callback);
	};


module.exports.getShortUrl = function(db, originalURL, cb) { 

	
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

};

