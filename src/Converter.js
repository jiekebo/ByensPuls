addEventListener('message', function(e) {
	self.postMessage({
        type: "debug",
        message: e.data
    });
});

/*
Converter.prototype = {
	calculateTrainPercentages: function (bp) {
	    var trainPositions = [];
	    var trains = bp.getTogListe()
	    for (var trainNo in trains) {
	        var train = trains[trainNo];
	        if (train.data == null || train.position == null) {
	            continue;
	        }
	        
	        var point = new Vector(train.position.x, train.position.y);
	        var closestLineIndex = this._findClosestLine(point, bp.getTrainLine(train.data.linie), trainNo);
	        var percentage = this._convertPointToPercentage(point, closestLineIndex, bp.getTrainLine(train.data.linie[0]), trainNo);
	        
			trainPositions[trainNo] = percentage;

	        if(bp.getTrainLine(train.data.linie) == selectedTrack) {
	            console.log(bp.getTrainLine(train.data.linie) + " train with id " + trainNo + " found at " + point.getx() + ", " + point.gety() + " closest line is " + closestLineIndex + " completed " + percentage + "%");
	            train.percentage = percentage;
	        }
	        
	    }
	    return trainPositions;
	},

	_findClosestLine: function (point, trackName, trainId) {
	    var track = this.tracks[trackName];
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
	},

	_convertPointToPercentage: function(point, closestLineIndex, trackName, trainId) {
	    closestLine = this.tracks[trackName].lines[closestLineIndex];
	    var lineStartToPoint = closestLine.line.projection(point);
	    var distanceTravelled = closestLine.length + lineStartToPoint.length();
	    var totalDistance = this.tracks[trackName].length;
	    return distanceTravelled/totalDistance;
	}
}*/