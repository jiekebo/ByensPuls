/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/

var markerDistance = -10;
var trackText;
var util;

var View = function () {
    util = new Util();
}

var markers = [];

View.prototype = {
    initializeView: function () {
        var w = 3000;
        var h = 700;

        this.view = Raphael("view");
        this.view.setViewBox(0,0,w,h,true);

        var svg = document.querySelectorAll("svg");
        for(var i = 0; i < svg.length; i++) {
            //svg[i].setAttribute("width", "100%");
            svg[i].setAttribute("height", "100%");
            svg[i].setAttribute("width", "200%");
            //svg[i].setAttribute("preserveAspectRatio", "YMinXMax");
        }

        this.changeTrack("A");
        this._drawButtons();
    },

    changeTrack: function (track) {
        this.view.clear();
        this.selectedTrack = track;
        this._drawView();
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

    _drawButtons: function () {
        this._drawButton("A", 50, 50, 50);
        this._drawButton("B", 50, 150, 50);
        this._drawButton("Bx", 50, 250, 50);
        this._drawButton("C", 50, 350, 50);
        this._drawButton("E", 50, 450, 50);
        this._drawButton("F", 50, 550, 50);
        this._drawButton("H", 50, 650, 50);
    },

    _drawButton: function (trackText, centerX, centerY, radius) {
        this.view.circle(centerX, centerY, radius);
        this.view.text(centerX, centerY+6, trackText).attr({
            "font-family": "Quicksand",
            "font-weight": "bold",
            "font-size": 50,
            "text-anchor": "middle"
        });
    },

    _drawView: function () {
        this.trackPath = this.view.path("M250,350L2990,350").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 1
        });

        this.trackLength = this.trackPath.getTotalLength();

        this.view.text(300, 30, "Byens Puls HTML5 - Prototype").attr({
            "font-family": "Quicksand",
            "font-weight": "bold",
            "font-size": 30,
            "text-anchor": "middle"
        });
    },

    _setSelectedTrackText: function (track) {
        if(trackText) {
            trackText.remove();
        }
        trackText = this.view.text(300, 50, "Track: " + track).attr({
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
                var point = this.trackPath.getPointAtLength(trainPosition * this.trackLength);
                var marker = markers[trainId];
                if(!marker) {
                        circle = this.view.circle(point.x, (point.y+markerDistance), 5).attr({
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
        var track = util.tracks[selectedTrack];

        var stationPathBBox = this.trackPath.getBBox();

        var stationPathCenterX = Math.floor(stationPathBBox.x + stationPathBBox.width/2.0);

        for(stationNo in track.stations) {
            var station = track.stations[stationNo];
            var point = this.trackPath.getPointAtLength(station.percentage * this.trackLength);
            this.view.path("M"+point.x+","+point.y+"m0,l0,8").attr({
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
            this.view.text(point.x, point.y+15, station.name).transform("r"+textRotation).attr({
                "font-family": "Quicksand",
                "text-anchor": textAnchor
            });
        }
    }
}