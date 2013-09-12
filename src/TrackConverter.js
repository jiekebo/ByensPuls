TrackConverter = function() {
	var atrack = [{x:1509, y:8647},{x:5675, y:8647},{x:5955, y:9027},{x:6091, y:9137},{x:6264, y:9171},{x:6433, y:9137},{x:6585, y:9028},{x:7920, y:7147},{x:7959, y:7062},{x:7965, y:6985},{x:7917, y:6853},{x:7580, y:6289},{x:7581, y:1122}];
	var btrack = [{x:2355, y:7635},{x:5249, y:7635},{x:6035, y:8748},{x:6134, y:8851},{x:6258, y:8901},{x:6389, y:8854},{x:6479, y:8781},{x:8188, y:6355},{x:8191, y:2715}];
	var bxtrack = [{x:2362, y:7495},{x:5301, y:7497},{x:6094, y:8630},{x:6166, y:8706},{x:6262, y:8751},{x:6355, y:8719},{x:6433, y:8655},{x:7150, y:7626}];
	var ctrack = [{x:4181, y:325},{x:4181, y:5708},{x:6148, y:8506},{x:6206, y:8568},{x:6269, y:8606},{x:6339, y:8563},{x:6380, y:8508},{x:8053, y:6146},{x:8484, y:6146},{x:8965, y:5460}]

	var etrack = [{x:678, y:8503},{x:5721, y:8503},{x:6011, y:8902},{x:6114, y:8991},{x:6259, y:9033},{x:6417, y:8999},{x:6558, y:8882},{x:8284, y:6423},{x:8284, y:1530}];
	var etrackstations = [{name:"Køge", x:678, y:8503},
						  {name:"Ølby", x:958, y:8503},
						  {name:"Jersie", x:1237, y:8503},
						  {name:"Solrød Str.", x:1520, y:8503},
						  {name:"Karlslunde", x:1800, y:8503},
						  {name:"Greve", x:2080, y:8503},
						  {name:"Hundige", x:2357, y:8503},
						  {name:"Ishøj", x:2632, y:8503},
						  {name:"Friheden", x:3754, y:8503},
						  {name:"Ny Ellebjerg", x:4316, y:8503},
						  {name:"Sjælør", x:4596, y:8503},
						  {name:"Sydhavn", x:4874, y:8503},
						  {name:"Dybbølsbro", x:5820, y:8639},
						  {name:"København H", x:6825, y:8500},
						  {name:"Vesterport", x:7027, y:8213},
						  {name:"Nørreport", x:7220, y:7939},
						  {name:"Østerport", x:7414, y:7662},
						  {name:"Nordhavn", x:7612, y:7381},
						  {name:"Svanemøllen", x:7811, y:7096},
						  {name:"Hellerup", x:8019, y:6801},
						  {name:"Lyngby", x:8284, y:3952},
						  {name:"Holte", x:8284, y:2767},
						  {name:"Birkerød", x:8284, y:2386},
						  {name:"Allerød", x:8284, y:1996},
						  {name:"Hillerød", x:8284, y:1530}];

	var ftrack = [{x: 4400, y: 8492}, {x: 4397, y: 7193}, {x: 5131, y: 6160}, {x: 7798, y: 6155}];
	var htrack = [{x:4277, y:317},{x:4277, y:5628},{x:6270, y:8473},{x:7546, y:6655},{x:7573, y:6595},{x:7561, y:6548},{x:7476, y:6413},{x:7476, y:1121}];

	this.tracks = {};

	this._convertCoordinatesToVectors(atrack, "A");
    this._convertCoordinatesToVectors(btrack, "B");
    this._convertCoordinatesToVectors(bxtrack, "Bx");
    this._convertCoordinatesToVectors(ctrack, "C");
    this._convertCoordinatesToVectors(etrack, "E");
    this._calculateStationsPercentages(etrackstations, "E");
    this._convertCoordinatesToVectors(ftrack, "F");
    this._convertCoordinatesToVectors(htrack, "H");
}

TrackConverter.prototype = {
	// Assumes the coordinates are ordered from start to end of the track.
	_convertCoordinatesToVectors: function (coordinates, trackName) {
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
	    this.tracks[trackName] = {
	        length: length,
	        lines: lines
	    };
	},

	calculateTrainPercentages: function (trains) {
	    var trainPositions = [];
	    for (var trainNo in trains) {
	        var train = trains[trainNo];
	        if (train.data == null || train.position == null) {
	            continue;
	        }
	        
	        var point = new Vector(train.position.x, train.position.y);
	        var closestLineIndex = this._findClosestLine(point, train.data.linie[0], trainNo);
	        var percentage = this._calculateTrainCompletion(point, closestLineIndex, train.data.linie[0], trainNo);
	        
	        if(train.data.linie[0] == debugTrack) {
	            trainPositions[trainNo] = percentage;
	            console.log(train.data.linie[0] + " train with id " + trainNo + " found at " + point.getx() + ", " + point.gety() + " closest line is " + closestLineIndex + " completed " + percentage + "%");
	        }

	        train.percentage = percentage;
	    }
	    return trainPositions;
	},

	_calculateStationsPercentages: function (stationPositions, trackName) {
		var stations = [];
		for(stationPositionNo in stationPositions) {
			var stationPosition = stationPositions[stationPositionNo];

			var point = new Vector(stationPosition.x, stationPosition.y);
			var closestLineIndex = this._findClosestLine(point, trackName, 0);
			var percentage = this._calculateTrainCompletion(point, closestLineIndex, trackName, 0);

			stations.push({name: stationPosition.name, percentage: percentage});
		}
		this.tracks[trackName].stations = stations;
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

	_calculateTrainCompletion: function(point, closestLineIndex, trackName, trainId) {
	    closestLine = this.tracks[trackName].lines[closestLineIndex];
	    var lineStartToPoint = closestLine.line.projection(point);
	    var distanceTravelled = closestLine.length + lineStartToPoint.length();
	    var totalDistance = this.tracks[trackName].length;
	    return distanceTravelled/totalDistance;
	},

	// Visual debug tools. Remember to clear canvas for each frame with clearRect(0, 0, window.innerWidth, window.innerHeight)
	drawTrains: function (trains) {
	    canvas.fillStyle = '#FF0000';
	    for (var trainNo in trains) {
	        var train = trains[trainNo];
	        if (train.position == null || train.position == 'undefined') {
	            continue;
	        }
	        var positionx = this.convertWidth(train.position.x);
	        var positiony = this.convertHeight(train.position.y);
	        canvas.fillRect(positionx, positiony, 2, 2);
	    }
	},

	drawTrack: function (debugTrack) {
	    var track = tracks[debugTrack];
	    canvas.fillStyle = '#000000';
	    canvas.beginPath();
	    var lines = track.lines;
	    
	    for(var lineNo in lines) {
	        var line = lines[lineNo];
	        if(lineNo == 0) {
	            canvas.moveTo(this.convertWidth(line.start.getx()), this.convertHeight(line.start.gety()));
	        }
	        var x = line.end.getx();
	        var y = line.end.gety();
	        canvas.lineTo(this.convertWidth(x), this.convertHeight(y));
	    }
	    canvas.stroke();
	},

	drawAllTracks: function () {
	    for (var trackNo in tracks) {
	        var track = tracks[trackNo];
	        canvas.fillStyle = '#000000';
	        canvas.beginPath();
	        var lines = track.lines;
	        for (var lineNo in lines) {
	            var line = lines[lineNo];
	            if(lineNo == 0) {
	                canvas.moveTo(this.convertWidth(line.start.getx()), this.convertHeight(line.start.gety()));
	            }
	            var x = line.end.getx();
	            var y = line.end.gety();
	            canvas.lineTo(this.convertWidth(x), this.convertHeight(y));
	        }
	        canvas.stroke();
	    }
	},

	convertWidth: function (width) {
	    return width / 10000 * window.innerWidth;
	},

	convertHeight: function (height) {
	    return height / 10000 * window.innerHeight;
	}
}