function calculateTrainPercentages(trains){for(var trainNo in trains){var train=trains[trainNo];if("undefined"!=typeof train&&null!==train&&"undefined"!=typeof train.action&&null!==train.action&&"undefined"!=typeof train.x&&null!==train.x){var point=new Vector(train.x,train.y),trackName=util.getTrainLine(train.linie),closestLineIndex=util.findClosestLine(point,trackName,trainNo),percentage=util.convertPointToPercentage(point,closestLineIndex,trackName,trainNo);train.percentage=percentage}}}importScripts("lib-min.js");var util=new Util;addEventListener("message",function(e){var messageObject=JSON.parse(e.data);calculateTrainPercentages(messageObject),self.postMessage({type:"data",message:messageObject})});