

const findShortUrl = function(collection, originalURL, callback) {
	collection.findOne({"original_url":originalURL }, callback);
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
	let newLinkObj = {"original_url": originalURL, "short_url": index};
	collection.insert(newLinkObj, (err, result) => {
		if(err){
			return callback(err);
		}
		callback(null, newLinkObj);
	});
};

// exports find\ get short functions
module.exports.findOriginalUrl = function(db, shortUrl, callback) {
			let collection = db.collection('links');
			collection.findOne({"short_url":parseInt(shortUrl)}, callback);
};

// try to find. If none - create new.
module.exports.getShortUrl = function(db, originalURL, cb) {
		let collection = db.collection('links');
		findShortUrl(collection, originalURL, function(err, result) {
			if(err) {
				return cb(err);
			}

			if(result) {
				return cb(null, result);
			}

			// inc counter
			getNextIndex(collection, function(err, nextIndex) {
					if(err) {
						return err;
					}
					// create new
					insertNewLink(collection, originalURL, nextIndex, function (err, newLink) {
						if(err) {
							return cb(err);
						}
						return cb(null, newLink);
					})

				});
		});
};
