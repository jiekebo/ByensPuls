var tog;
/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/

var debugTrack = "B";

var raphael;
var tc = new TrackConverter();
var bp = ByensPuls;

$(document).ready(function () {
    raphael = Raphael("holder", "100%", "100%");
    main();
});

function main() {
    $.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback=',
    function (data) {
        var togdata = atob(data.query.results.url.split(',')[1]);
        bp.parse(togdata);
        tc.calculateTrainPercentages(bp.bp.getTogListe());
        drawRaphaelTrack(bp.bp.getTogListe());
    });
    setTimeout(main, 5000);
}

function drawRaphaelTrack(tog) {
    p = raphael.path("M100,100L1000,100").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 10
    });
    var len = p.getTotalLength();

    for(trainId in tog) {
        var trainPosition = tog[trainId].percentage;
        var point = p.getPointAtLength(trainPosition * len);
        raphael.circle(point.x, point.y, 5).attr({
            stroke: "none",
            fill: "#fff"
        });
    }
}