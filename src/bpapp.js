/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/

var debugTrack = "C";
var yqlurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback='

var stationPaper;
var stationPaper;
var tc = new TrackConverter();
var byenspuls = ByensPuls;
var p;
var len;

$(document).ready(function () {
    var w = 600;
    var h = 200;
    stationPaper = Raphael("stations");
    stationPaper.setViewBox(0,0,w,h,true);

    p = stationPaper.path("M50,0L550,0").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 5
    });

    trainPaper = Raphael("trains");
    trainPaper.setViewBox(0,0,w,h,true);

    trainp = trainPaper.path("M50,200L550,200").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 5
    });

    /*var svg = document.querySelectorAll("svg").iterator();
    for(var element in svg) {
        element.removeAttribute("width");
        element.removeAttribute("height");
    }*/

    len = p.getTotalLength();

    var track = tc.tracks[debugTrack];

    for(stationNo in track.stations) {
        var station = track.stations[stationNo];
        var point = p.getPointAtLength(station.percentage * len);
        stationPaper.path("M"+point.x+","+point.y+"m0,-5l0,10").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 1
        });
        stationPaper.text(point.x, point.y+10, station.name).transform("r-90").attr({
            "font-family": "Sansita One",
            "text-anchor": "end"
        });
    }

    main();
});

function main() {
    $.get(
        yqlurl,
        function (data) {
            var togdata = atob(data.query.results.url.split(',')[1]);
            byenspuls.parse(togdata);
            tc.calculateTrainPercentages(byenspuls.bp.getTogListe());
            drawRaphaelTrack(byenspuls.bp.getTogListe());
        }
    );
    setTimeout(main, 5000);
}

function drawRaphaelTrack(trains) {
    for(trainId in trains) {
        var train = trains[trainId];
        if(!train.data || !train.position) {
            continue;
        }
        if(trains[trainId].data.linie[0] == debugTrack) {
            var trainPosition = train.percentage;
            var point = trainp.getPointAtLength(trainPosition * len);
            var marker = byenspuls.bp.getMarker(trainId);
            if(!marker) {
                    circle = trainPaper.circle(point.x, point.y, 5).attr({
                    stroke: "none",
                    fill: "#f0f"
                });
                byenspuls.bp.setMarker(trainId, circle);
            } else {
                var currentx = marker.attr("cx");
                var currenty = marker.attr("cy");
                var transformx = point.x - currentx;
                var transformy = point.y - currenty;
                marker.transform("T" + transformx + "," + transformy);
            }
        }
    }
}