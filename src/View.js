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
        var h = 750;

        this.view = Raphael("view");
        this.view.setViewBox(0,0,w,h,true);

        var svg = document.querySelectorAll("svg");
        for(var i = 0; i < svg.length; i++) {
            //svg[i].setAttribute("width", "100%");
            //svg[i].setAttribute("height", "100%");
            svg[i].setAttribute("preserveAspectRatio", "xMinYMax slice");
        }

        this._drawView();

        this.changeTrack("A");
    },

    changeTrack: function (track) {
        // Clear old track away here
        // Select button
        this._updateButtons(track);
        this.selectedTrack = track;
        this._drawStations(track);
        this.updateTrains();
    },

    updateTrains: function (trainData) {
        if(trainData) {
            this.trainData = trainData;
        }
        this._drawTrains(this.trainData);
    },

    _updateButtons: function (track) {
        if(this.buttonHighlight && this.buttonHighLight1) {
            this.buttonHighlight.remove();
            this.buttonHighLight1.remove()
        }
        var currButton = this.buttons[track];
        var x = currButton.circle.attrs.cx;
        var y = currButton.circle.attrs.cy;
        this.buttonHighlight = this.view.circle(x, y, 52).attr({
            stroke: "#ff0",
            "stroke-width": 5
        });
        this.buttonHighLight1 = this.view.circle(x, y, 48).attr({
            stroke: "#F40",
            //"stroke-dasharray": "-",
            "stroke-width": 5
        })
    },

    _drawView: function () {
        this._drawButtons();
        //this._setSelectedTrackText(track);
        this.trackPath = this.view.path("M250,350L2990,350").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 1
        });

        this.trackLength = this.trackPath.getTotalLength();
    },


    

    _drawButtons: function () {
        this.view.rect(0,0,120,750).attr({
            "fill": "#000"
        });

        this.buttons = [];

        // Blue
        this.buttons["A"] = this._drawButton("A", 60, 60, 50, "#00AADD");
        // Green
        this.buttons["B"] = this._drawButton("B", 60, 585, 50, "#48A844");
        // Lighter green
        this.buttons["BX"] = this._drawButton("BX", 60, 690, 50, "#ABCA79");
        // Orange
        this.buttons["C"] = this._drawButton("C", 60, 375, 50, "#F79135");
        // Purple
        this.buttons["E"] = this._drawButton("E", 60, 165, 50, "#7B72A7");
        // Yellow
        this.buttons["F"] = this._drawButton("F", 60, 480, 50, "#FBBA00");
        // Red
        this.buttons["H"] = this._drawButton("H", 60, 270, 50, "#EC4125");
    },

    _drawButton: function (trackText, centerX, centerY, radius, color) {
        var circle = this.view.circle(centerX, centerY, radius)
        .attr({
            "fill": color,
            "stroke-width": 0
        });
        
        var text = this.view.text(centerX, centerY+3, trackText).attr({
            "font-weight": "Bold",
            "font-size": 50,
            "text-anchor": "middle",
            "stroke": "#000",
            "fill": "#fff",
            "stroke-width": 3
        });

        var buttonSet = this.view.set()
        buttonSet.push(circle, text);

        var context = [this, circle];
        
        buttonSet.hover(function () {
            this.attr({
                // Some fancy hover graphics which is not needed on tablet etc.
                //"stroke-width": 10
            })
        },
        function () {
            this.attr({
                "stroke-width": 0
            })
        }, circle, circle)
        .click($.proxy(function () {
            context[1].attr({
                // Some fancy click graphics here
            });
            context[0].changeTrack(trackText);
        }, context));

        return {name: trackText, graphic: buttonSet, circle: circle};
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
        this.view.text(300, 30, "Byens Puls HTML5 - Prototype").attr({
            "font-family": "Quicksand",
            "font-weight": "bold",
            "font-size": 30,
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
                        fill: "#F0F"
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