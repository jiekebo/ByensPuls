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
var tracks = {};

$(document).ready(function () {
    trackVectors(ftrackcoordinates, "F");
    getData();
})

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
    console.log("Closest line to train " + trainId + " is " + smallestDistanceIndices[1]);
    return smallestDistanceIndices[1];
}

function calculateTrainCompletion(point, closestLineIndex, trackName, trainId) {
    closestLine = tracks[trackName].lines[closestLineIndex];
    var lineStartToPoint = closestLine.line.projection(point);
    var distanceTravelled = closestLine.length + lineStartToPoint.length();
    var totalDistance = tracks[trackName].length;
    console.log("Percentage of track completed " + distanceTravelled/totalDistance * 100 + "%");
}

function drawTracks() {
    canvas.fillStyle = '#000000';
    canvas.beginPath();
    var origin = ftrackcoordinates[0];
    canvas.moveTo(convertWidth(origin.x), convertHeight(origin.y));
    for(var i = 1; i < ftrackcoordinates.length; i++) {
        var coordinates = ftrackcoordinates[i];
        canvas.lineTo(convertWidth(coordinates.x), convertHeight(coordinates.y));
    }
    canvas.stroke();
}

function getData() {
    $.get('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.uri%20where%20url%20%3D%20%22http%3A%2F%2Fbyenspuls.dsb.dk%2Fbyens_puls%2FBPServlet%22&format=json&callback=',

    function (data) {
        var togdata = atob(data.query.results.url.split(',')[1]);
        tog = ByensPuls.parse(togdata);
        canvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
        drawTracks();
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
            //console.log("F train found! At " + train.position.x + ", " + train.position.y);
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