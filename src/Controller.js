/** Byens Puls HTML5 0.9.9
 *  (c) 2013 Jacob Salomonsen
 */

/*> ../build/parsergrammar.js */

/*> ../src/View.js */

/*> ../src/lib/raphael-min.js */

var converter = new Worker('src/Converter.js');
var byenspuls = BPParser;
var view = new View();
// select * from data.uri where url = "http://byenspuls.dsb.dk/byens_puls/BPServlet" 
var yqlurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback=';
var yqlurl1 = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%3FTID%3D';
var yqlurl2 = '%26ID%3D';
var yqlurl3 = '%22&format=json&callback=';

var id = new Date().getTime();
var tid = 0;

$(document).ready(function() {
    view.initializeView();

    $("#atrain").click(function() {
        view.changeTrack("A");
    });
    $("#btrain").click(function() {
        view.changeTrack("B");
    });
    $("#bxtrain").click(function() {
        view.changeTrack("BX");
    });
    $("#ctrain").click(function() {
        view.changeTrack("C");
    });
    $("#etrain").click(function() {
        view.changeTrack("E");
    });
    $("#ftrain").click(function() {
        view.changeTrack("F");
    });
    $("#htrain").click(function() {
        view.changeTrack("H");
    });

    converter.onmessage = function(event) {
        switch (event.data.type) {
            case "debug":
                console.log(event.data.message);
                break;
            case "data":
                view.updateTrains(event.data.message);
                break;
        }
    };

    main();
});

function main() {
    $.get(
        yqlurl1 + tid + yqlurl2 + id + yqlurl3,
        function(data) {
            var togdata = atob(data.query.results.url.split(',')[1]);
            byenspuls.parse(togdata);
            var testJSON = byenspuls.getTrainJSON();
            tid = byenspuls.bp.getTid();
            converter.postMessage(testJSON);
        }
    );
    setTimeout(main, 5000);
}
