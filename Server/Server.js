var http = require('http');
var url = require('url');
var fs = require('fs');
var count = 0;
var id = 0;
var file = './logs/bp';

var server = http.createServer(function (req, res) {
	var url_parts = url.parse(req.url, true);
	if (url_parts.query.id != id) {
                console.log("client with id " + url_parts.query.id + " connected.");
		id = url_parts.query.id;
		count = 0;
	}
	res.writeHead(200, {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': 'http://localhost:8000',
		'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
		'Access-Control-Allow-Headers': 'X-PINGOTHER',
		'Access-Control-Max-Age': 1728000,
	});
	var fileBuffer = fs.readFileSync(file + count);
	res.end(fileBuffer);
	console.log("loaded file " + file + count);
	count++;
});

server.listen(8001, function() {});
