function calculateTrainPercentages(e){var t="undefined",n=null,r="getTrainLine";for(var i in e){var s=e[i];if(typeof s===t||s===n)continue;if(typeof s.action===t||s.action===n||typeof s.x===t||s.x===n)continue;var o=new Vector(s.x,s.y),u=util.findClosestLine(o,util[r](s.linie),i),a=util.convertPointToPercentage(o,u,util[r](s.linie[0]),i);s.percentage=a,self.postMessage({type:"debug",message:" train with id "+i+" found at "+s.x+", "+s.y+" closest line is "+u+" completed "+a+"%"})}}importScripts("lib-min.js");var util=new Util;addEventListener("message",function(e){var t=JSON.parse(e.data);calculateTrainPercentages(t),self.postMessage({type:"data",message:t})});