importScripts('Util.js', 'Line.js', 'Vector.js');

var util = new Util();

addEventListener('message', function(e) {
	var messageObject = JSON.parse(e.data);

	calculateTrainPercentages(messageObject);

    self.postMessage({
        message: messageObject
    });
});

function calculateTrainPercentages(trains) {
    for (var trainNo in trains) {
        var train = trains[trainNo];
        // When marshalling sparse array to JSON, a lot of nulls occur, don't know if it's good at all...
        if(train == null) {
        	continue;
        }
        // Check if train is added or has a position, originates from BPServlet which sends out separate messages.
        if (train.action == null || train.x == null) {
            continue;
        }

        var point = new Vector(train.x, train.y);
        var closestLineIndex = util.findClosestLine(point, util.getTrainLine(train.linie), trainNo);
        var percentage = util.convertPointToPercentage(point, closestLineIndex, util.getTrainLine(train.linie[0]), trainNo);

        train.percentage = percentage;

        self.postMessage({
	    	type: "debug",
	    	message: " train with id " + trainNo + " found at " + train.x + ", " + train.y + " closest line is " + closestLineIndex + " completed " + percentage + "%"
	    });
    }
}