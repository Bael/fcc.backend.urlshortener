const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const urlchecker = require('./urlchecker');
const urlshortener = require('./urlshortener');

app.use(express.static(path.join(__dirname, "/views")));
app.use(bodyParser.urlencoded({extended: 'false'}));

app.listen(port);


app.post("/api/shorturl/new/", function(req, res) {

	let rawURL = req.body.url;
	urlchecker(rawURL, function(err, checkedURL) {
		if(err) {
			res.send(err);
		}
		else {
			urlshortener.getShortUrl(checkedURL, (err, shorturl) => {
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