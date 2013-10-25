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

var converter = new Worker('src/Converter.js');
var byenspuls = BPParser;
var view = new View();

$(document).ready(function () {
	view.drawView();

    $("#atrain").click(function() {
        view.changeTrack("A")
    });
    $("#btrain").click(function() {
        view.changeTrack("B")
    });
    $("#bxtrain").click(function() {
        view.changeTrack("BX")
    });
    $("#ctrain").click(function() {
        view.changeTrack("C")
    });
    $("#etrain").click(function() {
        view.changeTrack("E")
    });
    $("#ftrain").click(function() {
        view.changeTrack("F")
    });
    $("#htrain").click(function() {
        view.changeTrack("H")
    });

    converter.onmessage = function(event) {
    	switch (event.data.type) {
    		case "debug":
    			//console.log(event.data.message);
    			break;
            case "data":
                view.updateTrains(event.data.message);
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
            converter.postMessage(testJSON);
        }
    );
    setTimeout(main, 5000);
}