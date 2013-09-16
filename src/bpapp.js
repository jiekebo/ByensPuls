/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/


var yqlurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback='

var trainPaper;
var stationPaper;
var tc = new TrackConverter();
var byenspuls = ByensPuls;
var trackLength;

var trainDistance = -10;
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

    // Following does not produce the desired result...
    /*var svg = document.querySelectorAll("svg");
    for(var i = 0; i < svg.length; i++) {
        svg[i].removeAttribute("width");
        svg[i].removeAttribute("height");
    }*/

    trackLength = trainPath.getTotalLength();

    main();
});

function main() {
    $.get(
        yqlurl,
        function (data) {
            var togdata = atob(data.query.results.url.split(',')[1]);
            byenspuls.parse(togdata);
            tc.calculateTrainPercentages(byenspuls.bp.getTogListe());
            drawStations(selectedTrack);
            drawTrains(byenspuls.bp.getTogListe(), selectedTrack, trainDistance);
        }
    );
    setTimeout(main, 5000);
}

function drawTrains(trains, selectedTrack, trainDistance) {
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
                    circle = trainPaper.circle(point.x, point.y+trainDistance, 5).attr({
                    stroke: "none",
                    fill: "#f0f"
                });
                byenspuls.bp.setMarker(trainId, circle);
            } else {
                var currentx = marker.attr("cx");
                var currenty = marker.attr("cy");
                var transformx = point.x - currentx;
                var transformy = point.y - currenty;
                marker.transform("T" + transformx + "," + transformy+trainDistance);
            }
        }
        // Clean up when selecting another train.
        if(trains[trainId].data.linie[0] != selectedTrack) {
            var marker = byenspuls.bp.getMarker(trainId);
            if(marker) {
                marker.remove()
            }
        }
    }
}

function drawStations(selectedTrack) {
    var stationPath = stationPaper.path("M50,0L550,0").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 5
    });

    var track = tc.tracks[selectedTrack];

    for(stationNo in track.stations) {
        var station = track.stations[stationNo];
        var point = stationPath.getPointAtLength(station.percentage * trackLength);
        stationPaper.path("M"+point.x+","+point.y+"m0,0l0,10").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 3
        });
        stationPaper.text(point.x, point.y+15, station.name).transform("r-60").attr({
            "font-family": "Quicksand",
            "text-anchor": "end"
        });
    }
}