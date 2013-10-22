importScripts('Constants.js', 'Line.js', 'Vector.js');

var constants = new Constants();

addEventListener('message', function(e) {
	var messageObject = JSON.parse(e.data);

	calculateTrainPercentages(messageObject);
});

function calculateTrainPercentages(trains) {
    for (var trainNo in trains) {
        var train = trains[trainNo];
        if(train == null) {
        	continue;
        }
        if (train.action == null || train.x == null) {
            continue;
        }

        
        
        var point = new Vector(train.x, train.y);
        var closestLineIndex = constants._findClosestLine(point, _getTrainLine(train.linie), trainNo);
        var percentage = constants._convertPointToPercentage(point, closestLineIndex, _getTrainLine(train.linie[0]), trainNo);

        train.percentage = percentage;

        self.postMessage({
	    	type: "debug",
	    	message: percentage
	    });
        
		//trainPositions[trainNo] = percentage;

        /*if(_getTrainLine(train.data.linie) == selectedTrack) {
            console.log(_getTrainLine(train.data.linie) + " train with id " + trainNo + " found at " + point.getx() + ", " + point.gety() + " closest line is " + closestLineIndex + " completed " + percentage + "%");
            
        }*/
        
    }
    //return trainPositions;
}

function _getTrainLine(trainLineString) {
    return trainLineString.match(/[a-zA-Z]*/)[0];
}