var http = require('http');
var fs = require('fs');
var count = 0;

var server = http.createServer(function (req, res) {
	if(true) {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': 'http://localhost:8000',
			'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
			'Access-Control-Allow-Headers': 'X-PINGOTHER',
			'Access-Control-Max-Age': 1728000,
		});
		var fileBuffer = fs.readFileSync('./logs/bp' + count);
		res.end(fileBuffer);
		count++;
	}
});
server.listen(8001);