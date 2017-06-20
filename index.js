const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const urlchecker = require('./urlchecker');
const {MongoClient} = require('mongodb');
const urlshortener = require('./urlshortener');

let db;

// Initialize connection once
MongoClient.connect("mongodb://localhost:27017/shorturl", function(err, database) {
  if(err) throw err;

  db = database;

  app.listen(port);
  console.log("Listening on port 3000");
});



app.use(express.static(path.join(__dirname, "/views")));
app.use(bodyParser.urlencoded({extended: 'false'}));



app.get("/api/shorturl/:url", function(req, res) {
	console.time("getshorturl");
	let shorturl = req.params.url;
	console.log(JSON.stringify(req.params));
	urlshortener.findOriginalUrl(db, shorturl, function(err, result) {
		if (err) {
			res.send(err);
			res.end();
		}
		else {
			console.log("got result"+JSON.stringify(result));
			if (result) {
				console.timeEnd("getshorturl");
				res.redirect(result.originalURL);
			}
			else {
				res.end();
			}
		}
	})

});
app.post("/api/shorturl/new/", function(req, res) {

	let rawURL = req.body.url;
	urlchecker(rawURL, function(err, checkedURL) {
		if(err) {
			res.send(err);
		}
		else {
			urlshortener.getShortUrl(db, checkedURL, (err, shorturl) => {
					if (err) {
						res.send(err);
					} else {
						res.send({shortURL: shorturl, originalURL:rawURL});
					}
				});
			}
		});
	});


module.exports = app;