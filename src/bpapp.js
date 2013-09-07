var tog;
var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;
var ftrackcoordinates = [{
    x: 4400,
    y: 8492
}, {
    x: 4397,
    y: 7193
}, {
    x: 5131,
    y: 6160
}, {
    x: 7798,
    y: 6155
}];

$(document).ready(function () {

    getData();
});

function getData() {
    $.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback=',

    function (data) {
        var togdata = atob(data.query.results.url.split(',')[1]);
        tog = ByensPuls.parse(togdata);
        drawTrains(tog.togListe);
        calculateTrainPosition(tog.togListe);
    });
    setTimeout(getData, 5000);
}

function calculateTrainPosition(trains) {
    for (var trainNo in trains) {
        var train = trains[trainNo];
        if (train.data == null || train.position == null) {
            continue;
        }
        if (train.data.linie[0] == "F") {
            console.log("F train found! At " + train.position.x + ", " + train.position.y);
        }
    }
}

function drawTrains(trains) {
    canvas.fillStyle = '#FF0000';
    canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (var trainNo in trains) {
        var train = trains[trainNo];
        if (train.position == null || train.position == 'undefined') {
            continue;
        }
        var positionx = train.position.x / 10000 * window.innerWidth;
        var positiony = train.position.y / 10000 * window.innerHeight;
        canvas.fillRect(positionx, positiony, 2, 2);
    }
}