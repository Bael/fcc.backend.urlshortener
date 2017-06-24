const url = require('url');
const dns = require('dns');


module.exports = function(rawURL, callback) {

var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);

		if (!rawURL.match(regex))
    {
      callback({"error": "invalid URL: " + rawURL});  
    }
    else
    {
      let host = url.parse(rawURL).hostname;
      
        dns.lookup(host, (err, dnsres) => {
          if (err) {
            callback({"error": "unknown host: " + rawURL});
          }
          else {
            callback(null, rawURL);
          }
        });
    }
	
};