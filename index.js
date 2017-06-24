const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const mongoPort = process.env.MONGODB_URI || 27017;
const bodyParser = require('body-parser');
const urlchecker = require('./urlchecker');
const {MongoClient} = require('mongodb');
const urlshortener = require('./urlshortener');

let db;

// Initialize connection once
MongoClient.connect(`mongodb://localhost:${mongoPort}/shorturl`, function(err, database) {
  if(err) {
    throw err;
  }

  db = database;
  app.listen(port);
  console.log(`Listening on port ${port} at ` + new Date());
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
				res.redirect(result.original_url);
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
			urlshortener.getShortUrl(db, checkedURL, (err, urlInfo) => {
					if (err) {
						res.send(err);
					} else {
            const {short_url, original_url} = urlInfo;

						res.send({short_url, original_url});

					}
				});
			}
		});
	});


module.exports = app;
