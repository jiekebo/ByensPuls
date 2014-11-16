var http = require('http');
var fs = require('fs');
var count = 0;
var file = './logs/bp';

var server = http.createServer(function (req, res) {
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

	req.on('close', function() {
		count = 0;
	})
});

server.listen(8001, function() {
	console.log("server bound!");
});
server.on('connection', function() {
	console.log("Client connected");
	count = 0;
});
