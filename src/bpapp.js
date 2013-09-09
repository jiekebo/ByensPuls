var tog;
var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;

var atrack = [{x:1509, y:8647},{x:5675, y:8647},{x:5955, y:9027},{x:6091, y:9137},{x:6264, y:9171},{x:6433, y:9137},{x:6585, y:9028},{x:7920, y:7147},{x:7959, y:7062},{x:7965, y:6985},{x:7917, y:6853},{x:7580, y:6289},{x:7581, y:1122}];
var btrack = [{x:2355, y:7635},{x:5249, y:7635},{x:6035, y:8748},{x:6134, y:8851},{x:6258, y:8901},{x:6389, y:8854},{x:6479, y:8781},{x:8188, y:6355},{x:8191, y:2715}];
var bxtrack = [{x:2362, y:7495},{x:5301, y:7497},{x:6094, y:8630},{x:6166, y:8706},{x:6262, y:8751},{x:6355, y:8719},{x:6433, y:8655},{x:7150, y:7626}];
var ctrack = [{x:4181, y:316},{x:4181, y:5700},{x:10366, y:14259},{x:16637, y:22866},{x:22986, y:31427},{x:31031, y:37571},{x:31473, y:37571}];
var etrack = [{x:678, y:8503},{x:5721, y:8503},{x:6011, y:8902},{x:6114, y:8991},{x:6259, y:9033},{x:6417, y:8999},{x:6558, y:8882},{x:8284, y:6423},{x:8284, y:1530}];
var ftrack = [{x: 4400, y: 8492}, {x: 4397, y: 7193}, {x: 5131, y: 6160}, {x: 7798, y: 6155}];
var htrack = [{x:4280, y:330},{x:8557, y:5963},{x:10550, y:8803},{x:11799, y:7028},{x:11828, y:6972},{x:11854, y:6910},{x:11755, y:6694},{x:11755, y:1453}];

var tracks = {};

var debugTrack = "B";

$(document).ready(function () {
    trackVectors(atrack, "A");
    trackVectors(btrack, "B");
    trackVectors(bxtrack, "Bx");
    trackVectors(ctrack, "C");
    trackVectors(etrack, "E");
    trackVectors(ftrack, "F");
    trackVectors(htrack, "H");
    getData();
});

// Assumes the coordinates are ordered from start to end of the track.
function trackVectors(coordinates, trackName) {
    var lines = [];
    var length = 0;
    for(var i = 0; i < coordinates.length-1; i++) {
        current = coordinates[i];
        next = coordinates[i+1];
        start = new Vector(current.x, current.y);
        end = new Vector(next.x, next.y);
        direction = new Vector(current.x, current.y, next.x, next.y);
        var line = {
            start: start, 
            end: end, 
            length: length, 
            line: new Line(start, direction)
        };
        length += direction.length()
        lines.push(line);
    }
    tracks[trackName] = {
        length: length,
        lines: lines
    };
}

function findClosestLine(point, trackName, trainId) {
    var track = tracks[trackName];
    var distances = [];
    for (lineNo in track.lines) {
        var line = track.lines[lineNo];
        var startLength = line.start.newFromVector(point).length();
        var endLength = line.end.newFromVector(point).length();
        var distance = line.line.distance(point);
        lineDistance = []
        lineDistance.push(startLength);
        lineDistance.push(endLength);
        lineDistance.push(distance);
        distances.push(lineDistance);
    }
    var smallestDistanceIndices = []
    for(var i = 0; i < distances.length; i++) {
        var start = distances[i][0];
        var end = distances[i][1];
        var distance = distances[i][2];

        if (smallestDistanceIndices[0] == null && smallestDistanceIndices[1] == null && smallestDistanceIndices[2] == null) {
            smallestDistanceIndices[0] = i;
            smallestDistanceIndices[1] = i;
            smallestDistanceIndices[2] = i;
            continue;
        }

        if(distances[smallestDistanceIndices[0]][0] > start) {
            smallestDistanceIndices[0] = i;
        }

        if(distances[smallestDistanceIndices[1]][1] > end) {
            smallestDistanceIndices[1] = i;
        }

        if(distances[smallestDistanceIndices[2]][2] > distance) {
            smallestDistanceIndices[2] = i;
        }
    }
    // The closest line will occur >= 2 times therefore it is the median, sort the array and choose the middle element.
    smallestDistanceIndices.sort();
    return smallestDistanceIndices[1];
}

function calculateTrainCompletion(point, closestLineIndex, trackName, trainId) {
    closestLine = tracks[trackName].lines[closestLineIndex];
    var lineStartToPoint = closestLine.line.projection(point);
    var distanceTravelled = closestLine.length + lineStartToPoint.length();
    var totalDistance = tracks[trackName].length;
    console.log(trackName + " train with id " + trainId + " found at " + point.getx() + ", " + point.gety() + " closest line is " + closestLineIndex + " completed " + distanceTravelled/totalDistance * 100 + "%");
}

function drawTracks(debugTrack) {
    var track = tracks[debugTrack];
    canvas.fillStyle = '#000000';
    canvas.beginPath();
    var lines = track.lines;
    
    for(var lineNo in lines) {
        var line = lines[lineNo];
        if(lineNo == 0) {
            canvas.moveTo(convertWidth(line.start.getx()), convertHeight(line.start.gety()));
        }
        var x = line.end.getx();
        var y = line.end.gety();
        canvas.lineTo(convertWidth(x), convertHeight(y));
    }
    canvas.stroke();
}

function getData() {
    $.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback=',

    function (data) {
        var togdata = atob(data.query.results.url.split(',')[1]);
        tog = ByensPuls.parse(togdata);
        canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawTracks(debugTrack);
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
        if(train.data.linie[0] == debugTrack) {
            var point = new Vector(train.position.x, train.position.y);
            var closestLineIndex = findClosestLine(point, train.data.linie[0], trainNo);
            var percentage = calculateTrainCompletion(point, closestLineIndex, train.data.linie[0], trainNo);
        }    
    }
}

function convertWidth(width) {
    return width / 10000 * window.innerWidth;
}

function convertHeight(height) {
    return height / 10000 * window.innerHeight;
}

function drawTrains(trains) {
    canvas.fillStyle = '#FF0000';
    for (var trainNo in trains) {
        var train = trains[trainNo];
        if (train.position == null || train.position == 'undefined') {
            continue;
        }
        var positionx = convertWidth(train.position.x);
        var positiony = convertHeight(train.position.y);
        canvas.fillRect(positionx, positiony, 2, 2);
    }
}