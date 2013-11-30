/*var canvas = $('#bpcanvas')[0].getContext('2d');
canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;*/

var markerDistance = 0;
var trackText;
var util;

var View = function() {
    util = new Util();
};

var markers = [];

View.prototype = {
    initializeView: function() {
        var w = 3000;
        var h = 750;

        this.view = Raphael("view");
        this.view.setViewBox(0, 0, w, h, true);

        var svg = document.querySelectorAll("svg");
        for (var i = 0; i < svg.length; i++) {
            //svg[i].setAttribute("width", "100%");
            //svg[i].setAttribute("height", "650px");
            svg[i].setAttribute("preserveAspectRatio", "xMinYMin meet");
        }

        this._drawView();

        this.changeTrack("A");
    },

    changeTrack: function(track) {
        this.selectedTrack = track;
        this._updateButtons(track);
        this._cleanupStations();
        this._drawStations(track);
        this.updateTrains();
    },

    _cleanupStations: function() {
        for (var stationId in this.stations) {
            var station = this.stations[stationId];
            station.path.remove();
            station.text.remove();
        }
    },

    updateTrains: function(trainData) {
        if (trainData) {
            this.trainData = trainData;
        }
        this._drawTrains(this.trainData);
    },

    _updateButtons: function(track) {
        if (this.buttonHighlight && this.buttonHighLight1) {
            this.buttonHighlight.remove();
            this.buttonHighLight1.remove();
        }
        var currButton = this.buttons[track];
        var x = currButton.circle.attrs.cx;
        var y = currButton.circle.attrs.cy;
        this.buttonHighlight = this.view.circle(x, y, 52).attr({
            stroke: "#ff0",
            "stroke-width": 3
        });
        this.buttonHighLight1 = this.view.circle(x, y, 45).attr({
            stroke: "#F40",
            //"stroke-dasharray": "-",
            "stroke-width": 3
        });
    },

    _drawView: function() {
        this._drawButtons();
        //this._setSelectedTrackText(track);
        this.shadowPath = this.view.path("M250, 470L2900,470").attr({
            stroke: "#000",
            "stroke-width": 10,
            "stroke-linecap": "round"
        });
        this.trackPath = this.view.path("M300,470L2850,470").attr({
            stroke: "#000",
            opacity: 1,
            "stroke-width": 10,
            "stroke-linecap": "round"
        });

        this.trackLength = this.trackPath.getTotalLength();
    },




    _drawButtons: function() {
        this.view.rect(0, 0, 120, 750).attr({
            "fill": "#000"
        }).glow({
            width: 20,
            color: '#444',
            offsetx: 3
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

    _drawButton: function(trackText, centerX, centerY, radius, color) {
        var circle = this.view.circle(centerX, centerY, radius)
            .attr({
                "fill": color,
                "stroke-width": 0
            });

        var text = this.view.text(centerX, centerY + 3, trackText).attr({
            "font-weight": "Bold",
            "font-size": 50,
            "text-anchor": "middle",
            "stroke": "#000",
            "fill": "#fff",
            "stroke-width": 1.5
        });

        var buttonSet = this.view.set();
        buttonSet.push(circle, text);

        var context = [this, circle];

        buttonSet.hover(function() {
                this.attr({
                    // Some fancy hover graphics which is not needed on tablet etc.
                    //"stroke-width": 10
                });
            },
            function() {
                this.attr({
                    "stroke-width": 0
                });
            }, circle, circle)
            .click($.proxy(function() {
                context[1].attr({
                    // Some fancy click graphics here
                });
                context[0].changeTrack(trackText);
            }, context));

        return {
            name: trackText,
            graphic: buttonSet,
            circle: circle
        };
    },

    _setSelectedTrackText: function(track) {
        if (trackText) {
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

    _drawTrains: function(trains) {
        for (var trainId in trains) {
            var train = trains[trainId];
            if (typeof train === 'undefined' || train === null) {
                continue;
            }
            if (!train.action || !train.x) {
                continue;
            }
            if (util.getTrainLine(trains[trainId].linie) == this.selectedTrack) {
                var trainPosition = train.percentage;
                var point = this.trackPath.getPointAtLength(trainPosition * this.trackLength);
                var marker = markers[trainId];
                if (!marker) {
                    var marker = this.view.set();
                    var circle = this.view.circle(point.x, (point.y + markerDistance), 5).attr({
                        stroke: "none",
                        fill: "#F0F"
                    });
                    var direction;
                    if(train.direction === "left") {
                        direction = this.view.path("M" + point.x + "," + point.y + "m0,l-10,0").attr({
                            stroke: "#F0F",
                            "stroke-width": 2
                        });
                    } else {
                        direction = this.view.path("M" + point.x + "," + point.y + "m0,l10,0").attr({
                            stroke: "#F0F",
                            "stroke-width": 2
                        });
                    }
                    marker.push(circle, direction);
                    markers[trainId] = marker;
                } else if (train.remove) {
                    marker.remove();
                    delete trains[trainId];
                } else {
                    var currentx = marker[0].attr("cx");
                    var currenty = marker[0].attr("cy");
                    var transformx = point.x - currentx;
                    var transformy = point.y - currenty;
                    marker.transform("T" + transformx + "," + (transformy + markerDistance));
                }
            }
            // Clean up when selecting another train.
            if (util.getTrainLine(trains[trainId].linie) != this.selectedTrack) {
                var marker = markers[trainId];
                if (marker) {
                    marker.remove();
                    marker = null;
                    markers[trainId] = null;
                    byenspuls.bp.setMarker(trainId, null);
                }
            }
        }
    },

    _drawStations: function(selectedTrack) {
        var track = util.tracks[selectedTrack];
        this.stations = [];
        for (var stationNo in track.stations) {
            var station = track.stations[stationNo];
            var point = this.trackPath.getPointAtLength(station.percentage * this.trackLength);
            var path = this.view.path("M" + point.x + "," + (point.y - 30) + "m0,l0,60").attr({
                stroke: "#444",
                opacity: 1,
                "stroke-width": 5,
                "stroke-linecap": "round"
            });
            var textRotation;
            var textAnchor;
            textRotation = "55";
            textAnchor = "end";
            var text = this.view.text(point.x, point.y - 60, station.name).transform("r" + textRotation).attr({
                "text-anchor": textAnchor,
                "font-weight": "bold",
                "font-size": 40
            });
            this.stations.push({
                path: path,
                text: text
            });
        }
    }
};