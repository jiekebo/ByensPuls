/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/

var debugTrack = "A";
var yqlurl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback='

var raphael;
var tc = new TrackConverter();
var byenspuls = ByensPuls;
var p;

$(document).ready(function () {
    raphael = Raphael("holder", "100%", "100%");
    p = raphael.path("M100,100L1000,100").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 1
    });
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
    
    var len = p.getTotalLength();

    for(trainId in trains) {
        var train = trains[trainId];
        if(!train.data || !train.position) {
            continue;
        }
        if(trains[trainId].data.linie[0] == debugTrack) {
            var trainPosition = train.percentage;
            var point = p.getPointAtLength(trainPosition * len);
            var marker = byenspuls.bp.getMarker(trainId);
            if(!marker) {
                    circle = raphael.circle(point.x, point.y, 5).attr({
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