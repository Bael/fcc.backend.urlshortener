const { URL } = require('url');
const dns = require('dns');

module.exports = function(rawURL, callback) {

	try {
		const myURL = new URL(rawURL);
		dns.lookup(myURL.host, (err, dnsres) => {
			if (err) { 
				callback({"error": "unknown host: " + rawURL});

			} 
			else {
				callback(null, myURL.toString());
			}
		});
	} 
	catch (e)
	{
		if (typeof(e) === TypeError)
		{
			callback({"error": "invalid URL: " + rawURL});
		}
		else
		{
			callback({"erorr": e.toString()});
		}
	}

};