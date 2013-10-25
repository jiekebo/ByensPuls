/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/

var trainPaper;
var stationPaper;
var trackLength;
var markerDistance = -10;
var selectedTrack = "A";
var trackText;
var util;

var View = function () {
    util = new Util();
}

var markers = [];

View.prototype = {
    drawView: function () {
        var w = 600;
        var h = 180;

        trainPaper = Raphael("trains");
        trainPaper.setViewBox(0,0,w,h,true);

        trainPath = trainPaper.path("M70,180L530,180").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 5
        });

        trainPaper.text(300, 30, "Byens Puls HTML5").attr({
            "font-family": "Quicksand",
            "font-weight": "bold",
            "font-size": 30,
            "text-anchor": "middle"
        });

        stationPaper = Raphael("stations");
        stationPaper.setViewBox(0,0,w,h,true);

        trackLength = trainPath.getTotalLength();

        this.changeTrack("A");

        var svg = document.querySelectorAll("svg");
        for(var i = 0; i < svg.length; i++) {
            svg[i].setAttribute("width", "100%");
            svg[i].setAttribute("height", "100%");
            svg[i].setAttribute("preserveAspectRatio", "none");
        }
    },

    changeTrack: function (track) {
        stationPaper.clear();
        this.selectedTrack = track;
        this._setSelectedTrackText(track);
        this._drawStations(track);
        this.updateTrains();
    },

    updateTrains: function (trainData) {
        if(trainData) {
            this.trainData = trainData;
        }
        this._drawTrains(this.trainData);
    },

    _setSelectedTrackText: function (track) {
        if(trackText) {
            trackText.remove();
        }
        trackText = trainPaper.text(300, 50, "Track: " + track).attr({
            "font-family": "Quicksand",
            "font-weight": "bold",
            "font-size": 10,
            "text-anchor": "middle" 
        });
    },

    _drawTrains: function (trains) {
        for(trainId in trains) {
            var train = trains[trainId];
            if(train == null) {
                continue;
            }
            if(!train.action || !train.x) {
                continue;
            }
            if(util.getTrainLine(trains[trainId].linie) == this.selectedTrack) {
                var trainPosition = train.percentage;
                var point = trainPath.getPointAtLength(trainPosition * trackLength);
                var marker = markers[trainId];
                if(!marker) {
                        circle = trainPaper.circle(point.x, (point.y+markerDistance), 5).attr({
                        stroke: "none",
                        fill: "#f0f"
                    });
                    markers[trainId] = circle;
                } else {
                    var currentx = marker.attr("cx");
                    var currenty = marker.attr("cy");
                    var transformx = point.x - currentx;
                    var transformy = point.y - currenty;
                    marker.transform("T" + transformx + "," + (transformy+markerDistance));
                }
            }
            // Clean up when selecting another train.
            if(util.getTrainLine(trains[trainId].linie) != this.selectedTrack) {
                var marker = markers[trainId];
                if(marker) {
                    marker.remove();
                    marker = null;
                    markers[trainId] = null;
                    byenspuls.bp.setMarker(trainId, null);
                }
            }
        }
    },

    _drawStations: function (selectedTrack) {
        var stationPath = stationPaper.path("M70,0L530,0").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 10
        });

        var track = util.tracks[selectedTrack];

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
}