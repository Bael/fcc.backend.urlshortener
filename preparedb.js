//const {connectToMongo} = require('./db');

/*

const ensureUniqueIndexes = function(collection, fieldsNamesArray, callback) {
	
	let indexes = (fieldsNamesArray || []).map(function (field) {
				return {name: field+"index", key: {field:1}, unique: true};

			});

	console.log(JSON.stringify(indexes));


	collection.createIndexes(indexes, function(err, result){
        if (err) return callback(err);
        callback(null, result);
    });
};


let prepareDb = function(callback) {
	connectToMongo((err, db) => {
		if(err) {
			return callback(err);
		}

		ensureUniqueIndexes(db.collection("links"), ["originalURL", "shortenedUrl"], (err, res) => {
			if(err) return callback(err);
			callback(null, res);
		});

	});
};
*/


//module.exports.prepareDb = prepareDb;
/*
prepareDb(

	function(err, res) {
	if(err) {
		console.log("error prepare db " + err.toString());
		//process.exit(1);
		return;
	}

	console.log("prepared indexes " + JSON.stringify(res));
	//	process.exit(1);
});*/	