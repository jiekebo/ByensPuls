/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/

function setSelectedTrackText() {
    if(trackText) {
        trackText.remove();
    }
    trackText = trainPaper.text(300, 50, "Track: " + selectedTrack).attr({
        "font-family": "Quicksand",
        "font-weight": "bold",
        "font-size": 10,
        "text-anchor": "middle" 
    });
}

function drawTrains(bp) {
    var trains = bp.getTogListe();
    for(trainId in trains) {
        var train = trains[trainId];
        if(!train.data || !train.position) {
            continue;
        }
        if(bp.getTrainLine(trains[trainId].data.linie) == selectedTrack) {
            var trainPosition = train.percentage;
            var point = trainPath.getPointAtLength(trainPosition * trackLength);
            var marker = byenspuls.bp.getMarker(trainId);
            if(!marker) {
                    circle = trainPaper.circle(point.x, (point.y+markerDistance), 5).attr({
                    stroke: "none",
                    fill: "#f0f"
                });
                byenspuls.bp.setMarker(trainId, circle);
            } else {
                var currentx = marker.attr("cx");
                var currenty = marker.attr("cy");
                var transformx = point.x - currentx;
                var transformy = point.y - currenty;
                marker.transform("T" + transformx + "," + (transformy+markerDistance));
            }
        }
        // Clean up when selecting another train.
        if(bp.getTrainLine(trains[trainId].data.linie) != selectedTrack) {
            var marker = byenspuls.bp.getMarker(trainId);
            if(marker) {
                marker.remove();
                byenspuls.bp.setMarker(trainId, null);
            }
        }
    }
}

function drawStations() {
    var stationPath = stationPaper.path("M70,0L530,0").attr({
        stroke: "#000",
        opacity: 1,
        "stroke-width": 10
    });

    var track = tc.tracks[selectedTrack];

    var stationPathBBox = stationPath.getBBox();

    var stationPathCenterX = Math.floor(stationPathBBox.x + stationPathBBox.width/2.0);

    for(stationNo in track.stations) {
        var station = track.stations[stationNo];
        var point = stationPath.getPointAtLength(station.percentage * trackLength);
        stationPaper.path("M"+point.x+","+point.y+"m0,l0,8").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 3
        });
        var textRotation;
        var textAnchor;
        if(point.x <= stationPathCenterX) {
            textRotation = "-90";
            textAnchor = "end";
        } else {
            textRotation = "90";
            textAnchor = "start";
        }
        stationPaper.text(point.x, point.y+15, station.name).transform("r"+textRotation).attr({
            "font-family": "Quicksand",
            "text-anchor": textAnchor
        });
    }
}
