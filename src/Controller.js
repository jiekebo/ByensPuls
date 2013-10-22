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
var tc = new Worker('src/TrackConverter.js');
var byenspuls = BPParser;
var trackLength;

var markerDistance = -10;
var selectedTrack = "A";
var trackText;

$(document).ready(function () {
    var w = 600;
    var h = 180;

    trainPaper = Raphael("trains");
    trainPaper.setViewBox(0,0,w,h,true);

    trainPath = trainPaper.path("M70,180L530,180").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 5
    });

    trainPaper.text(300, 30, "Byens Puls HTML5").attr({
        "font-family": "Quicksand",
        "font-weight": "bold",
        "font-size": 30,
        "text-anchor": "middle"
    });

    setSelectedTrackText();

    stationPaper = Raphael("stations");
    stationPaper.setViewBox(0,0,w,h,true);

    trackLength = trainPath.getTotalLength();

    $("#atrain").click(function() {
        changeTrack("A")
    });
    $("#btrain").click(function() {
        changeTrack("B")
    });
    $("#bxtrain").click(function() {
        changeTrack("BX")
    });
    $("#ctrain").click(function() {
        changeTrack("C")
    });
    $("#etrain").click(function() {
        changeTrack("E")
    });
    $("#ftrain").click(function() {
        changeTrack("F")
    });
    $("#htrain").click(function() {
        changeTrack("H")
    });

    //drawStations();

    // Following does not produce the desired result...
    var svg = document.querySelectorAll("svg");
    for(var i = 0; i < svg.length; i++) {
        svg[i].setAttribute("width", "100%");
        svg[i].setAttribute("height", "100%");
        svg[i].setAttribute("preserveAspectRatio", "none");
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
            //tc.postMessage(byenspuls.bp, [byenspuls.bp]);
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