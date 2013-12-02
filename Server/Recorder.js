var request = require('request');
var fs = require('fs');

var yqlurl1 = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%3FTID%3D';
var yqlurl2 = '%26ID%3D';
var yqlurl3 = '%22&format=json&callback=';

var id = new Date().getTime();
var tid = 0;
var filename = './logs/bp';
var count = 0;

var main = function() {
    request({
		url: yqlurl1 + tid + yqlurl2 + id + yqlurl3,
		encoding: 'utf-8'
    }, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var json = JSON.parse(body);
			var buf = new Buffer(json.query.results.url.split(',')[1], 'base64');
			var array = buf.toString().split('\n');
			tid = array[array.length-1].split(' ')[1];
			fs.writeFile(filename + count, body);
			count++;
		}
	});
	setTimeout(main, 5000);
};

if (require.main === module) {
    main();
}