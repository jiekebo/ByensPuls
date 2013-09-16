/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/


var yqlurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback='

var trainPaper;
var stationPaper;
var tc = new TrackConverter();
var byenspuls = ByensPuls;
var trackLength;

var markerDistance = -10;
var selectedTrack = "C";

$(document).ready(function () {
    var w = 600;
    var h = 200;

    trainPaper = Raphael("trains");
    trainPaper.setViewBox(0,0,w,h,true);

    trainPath = trainPaper.path("M50,200L550,200").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 5
    });

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
        changeTrack("Bx")
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

    drawStations();

    main();
});

function main() {
    $.get(
        yqlurl,
        function (data) {
            var togdata = atob(data.query.results.url.split(',')[1]);
            byenspuls.parse(togdata);
            tc.calculateTrainPercentages(byenspuls.bp.getTogListe());
            drawTrains(byenspuls.bp.getTogListe());
        }
    );
    setTimeout(main, 5000);
}

function changeTrack(track) {
    selectedTrack = track;
    tc.calculateTrainPercentages(byenspuls.bp.getTogListe());
    drawTrains(byenspuls.bp.getTogListe());
    stationPaper.clear();
    drawStations(track);
}

function drawTrains(trains) {
    for(trainId in trains) {
        var train = trains[trainId];
        if(!train.data || !train.position) {
            continue;
        }
        if(trains[trainId].data.linie[0] == selectedTrack) {
            var trainPosition = train.percentage;
            var point = trainPath.getPointAtLength(trainPosition * trackLength);
            var marker = byenspuls.bp.getMarker(trainId);
            if(!marker) {
                    circle = trainPaper.circle(point.x, (point.y+markerDistance), 5).attr({
                    stroke: "none",
                    fill: "#f0f"
                });
                byenspuls.bp.setMarker(trainId, circle);
            } else {
                var currentx = marker.attr("cx");
                var currenty = marker.attr("cy");
                var transformx = point.x - currentx;
                var transformy = point.y - currenty;
                marker.transform("T" + transformx + "," + (transformy+markerDistance));
            }
        }
        // Clean up when selecting another train.
        if(trains[trainId].data.linie[0] != selectedTrack) {
            var marker = byenspuls.bp.getMarker(trainId);
            if(marker) {
                marker.remove();
                byenspuls.bp.setMarker(trainId, null);
            }
        }
    }
}

function drawStations() {
    var stationPath = stationPaper.path("M51,0L549,0").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 10
    });

    var track = tc.tracks[selectedTrack];

    var stationPathBBox = stationPath.getBBox();

    var stationPathCenterX = Math.floor(stationPathBBox.x + stationPathBBox.width/2.0);

    for(stationNo in track.stations) {
        var station = track.stations[stationNo];
        var point = stationPath.getPointAtLength(station.percentage * trackLength);
        stationPaper.path("M"+point.x+","+point.y+"m0,l0,8").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 3
        });
        var textRotation;
        var textAnchor;
        if(point.x <= stationPathCenterX) {
            textRotation = "-90";
            textAnchor = "end";
        } else {
            textRotation = "90";
            textAnchor = "start";
        }
        stationPaper.text(point.x, point.y+15, station.name).transform("r"+textRotation).attr({
            "font-family": "Quicksand",
            "text-anchor": textAnchor
        });
    }
}