/** Byens Puls HTML5 0.9.9
 *  (c) 2013 Jacob Salomonsen
 */

/*> ../build/BPParser-Grammar.js */

/*> ../src/Line.js */

/*> ../src/Vector.js */

/*> ../src/Constants.js */

/*> ../src/View.js */

/*> ../src/lib/raphael-min.js */

var yqlurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback='

var trainPaper;
var stationPaper;
var tc = new Worker('src/Converter.js');
var byenspuls = BPParser;
var trackLength;

var markerDistance = -10;
var selectedTrack = "A";
var trackText;

$(document).ready(function () {
	var view = new View();
	view.drawView();

    tc.onmessage = function(event) {
    	switch (event.data.type) {
    		case "debug":
    			console.log(event.data.message);
    			break;
    	}
    }

    main();
});

function main() {
    $.get(
        yqlurl,
        function (data) {
            var togdata = atob(data.query.results.url.split(',')[1]);
            byenspuls.parse(togdata);
            var testJSON = byenspuls.getTrainJSON();
            tc.postMessage(testJSON);
            //drawTrains(byenspuls.bp);
            console.log("noop");
        }
    );
    setTimeout(main, 5000);
}

function changeTrack(track) {
    selectedTrack = track;
    setSelectedTrackText();
    tc.calculateTrainPercentages(byenspuls.bp);
    drawTrains(byenspuls.bp);
    stationPaper.clear();
    //drawStations(track);
}