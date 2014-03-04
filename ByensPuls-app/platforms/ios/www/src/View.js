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
        var h = 300;

        this.view = Raphael("view");
        this.view.setViewBox(0, 0, w, h, true);

        var svg = document.querySelectorAll("svg");
        for (var i = 0; i < svg.length; i++) {
            svg[i].setAttribute("preserveAspectRatio", "xMinYMin meet");
        }

        this._drawButtons();
        this._drawTracks();

        this.changeTrack("A");
    },

    changeTrack: function(track) {
        if(this.selectedTrack === track) {
            return;
        }
        this.selectedTrack = track;
        this._updateButtons(track);
        this._cleanupStations();
        this._drawStations(track);
        this.tracks.insertAfter(this.stations);
        this.updateTrains();
    },

    updateTrains: function(trainData) {
        if (trainData) {
            this.trainData = trainData;
        }
        this._drawTrains(this.trainData);
    },

    _drawButtons: function() {
        this.view.rect(0, 0, 120, 750).attr({
            "fill": "#000"
        });

        this.buttons = [];

        // Blue
        this.buttons["A"] = this._drawButton("A", 60, 60, 50, "#00AADD", "#00C4FF");
        // Green
        this.buttons["B"] = this._drawButton("B", 60, 585, 50, "#48A844", "#55C451");
        // Lighter green
        this.buttons["BX"] = this._drawButton("BX", 60, 690, 50, "#ABCA79", "#C1E38A");
        // Orange
        this.buttons["C"] = this._drawButton("C", 60, 375, 50, "#F79135", "#FFAB5E");
        // Purple
        this.buttons["E"] = this._drawButton("E", 60, 165, 50, "#7B72A7", "#9D92D4");
        // Yellow
        this.buttons["F"] = this._drawButton("F", 60, 480, 50, "#FBBA00", "#FAC93E");
        // Red
        this.buttons["H"] = this._drawButton("H", 60, 270, 50, "#EC4125", "#FA6850");
    },

    _drawButton: function(trackText, centerX, centerY, radius, color, darkerColor) {
        var circle = this.view.circle(centerX, centerY, radius)
            .attr({
                "fill": color,
                "stroke-width": 0
            });

        var highlightSet = this.view.set();

        var buttonHighlight1 = this.view.circle(centerX, centerY, radius - 4).attr({
            stroke: "#ff0",
            "stroke-width": 3
        });

        var buttonHighlight2 = this.view.circle(centerX, centerY, radius + 1).attr({
            stroke: "#F40",
            "stroke-dasharray": ".",
            "stroke-width": 2
        });

        highlightSet.push(buttonHighlight1, buttonHighlight2);

        var smallerCircle = this.view.circle(centerX, centerY, radius - 10)
            .attr({
                "fill": darkerColor,
                "stroke-width": 0
            }).hide();

        var text = this.view.text(centerX, centerY + 3, trackText)
            .attr({
                "font-weight": "Bold",
                "font-size": 50,
                "text-anchor": "middle",
                "stroke": "#000",
                "fill": "#fff",
                "stroke-width": 1.5
            });

        var buttonSet = this.view.set();
        buttonSet.push(circle, smallerCircle, text);
        buttonSet
            .click($.proxy(function() {
                this.changeTrack(trackText);
            }, this));

        return {
            graphic: buttonSet,
            circle: circle,
            hightlight: highlightSet
        };
    },

    _updateButtons: function(track) {
        for (buttonIndex in this.buttons) {
            var button = this.buttons[buttonIndex];
            if(this.selectedTrack === buttonIndex) {
                //button['circle'].hide();
                button['hightlight'].show();
            } else {
                //button['circle'].show();
                button['hightlight'].hide();
            }
            console.log(button);
        }
        /*if (this.buttonHighlight && this.buttonHighLight1) {
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
        });*/
    },

    _drawTracks: function() {
        this.topTrackPath = this.view.path("M310,400L2850,400").attr({
            stroke: "#555",
            opacity: 1,
            "stroke-width": 5,
            "stroke-linecap": "round"
        });

        var topTrackShadow = this.view.path("M280,400L2880,400").attr({
            stroke: "#555",
            opacity: 1,
            "stroke-width": 5,
            "stroke-linecap": "round"
        });

        var topTrackHighlight = this.view.path("M283,398L2877,398").attr({
            stroke: "#888",
            opacity: 1,
            "stroke-width": 1.5,
            "stroke-linecap": "round"
        });

        this.bottomTrackPath = this.view.path("M310,480L2850,480").attr({
            stroke: "#555",
            opacity: 1,
            "stroke-width": 5,
            "stroke-linecap": "round"
        });

        var bottomTrackShadow = this.view.path("M280,480L2880,480").attr({
            stroke: "#555",
            opacity: 1,
            "stroke-width": 5,
            "stroke-linecap": "round"
        });

        var bottomTrackHighlight = this.view.path("M283,478L2877,478").attr({
            stroke: "#888",
            opacity: 1,
            "stroke-width": 1.5,
            "stroke-linecap": "round"
        });

        this.tracks = this.view.set()
        this.tracks.push(this.topTrackPath, topTrackShadow, topTrackHighlight, this.bottomTrackPath, bottomTrackShadow, bottomTrackHighlight);
        this.trackLength = this.topTrackPath.getTotalLength();
    },

    _drawStations: function(selectedTrack) {
        var track = util.tracks[selectedTrack];
        this.stations = this.view.set();
        for (var stationNo in track.stations) {
            var station = track.stations[stationNo];
            var point = this.topTrackPath.getPointAtLength(station.percentage * this.trackLength);
            var path = this.view.path("M" + point.x + "," + (point.y - 30) + "m0,l0,140").attr({
                stroke: "#000",
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
            this.stations.push(path, text);
        }
    },

    _cleanupStations: function() {
        if(this.stations) {
            this.stations.remove();
        }
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
                if (train.remove) {
                    var marker = markers[trainId];
                    if(marker) {
                        marker.remove();
                        markers[trainId] = null;
                    }
                    continue;
                }
                var marker = markers[trainId];
                if (!marker) {
                    this._createTrainMarker(train, trainId, train.percentage);
                } else {
                    var point;
                    if(train.direction === "left") {
                        point = this.topTrackPath.getPointAtLength(train.percentage * this.trackLength);
                    } else {
                        point = this.bottomTrackPath.getPointAtLength(train.percentage * this.trackLength);
                    }
                    var currentx = marker[0].attr("cx");
                    var currenty = marker[0].attr("cy");
                    var transformx = point.x - currentx;
                    var transformy = point.y - currenty;
                    marker.animate({transform: ["t", transformx, transformy]}, 1000);
                }
            }
            // Clean up when selecting another train.
            if (typeof trains[trainId] !== 'undefined' && trains[trainId] !== null && util.getTrainLine(trains[trainId].linie) != this.selectedTrack) {
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

    _createTrainMarker: function(train, trainId, trainPosition) {
        var marker = this.view.set()
        var triangle;
        if(train.direction === "left") {
            point = this.topTrackPath.getPointAtLength(trainPosition * this.trackLength);
            triangle = this.view.path("M" + (point.x - 10) + "," + point.y + "L" + (point.x + 10) + "," + (point.y - 10) + "L" + (point.x + 10) + "," + (point.y + 10) + "z");
            triangle.attr({
                fill: "#F00",
                stroke: "#FA0",
                "stroke-width": 1.7,
                "stroke-linejoin": "round"
            });
        } else {
            point = this.bottomTrackPath.getPointAtLength(trainPosition * this.trackLength);
            triangle = this.view.path("M" + (point.x + 10) + "," + point.y + "L" + (point.x - 10) + "," + (point.y - 10) + "L" + (point.x - 10) + "," + (point.y + 10) + "z");
            triangle.attr({
                fill: "#F00",
                stroke: "#FA0",
                "stroke-width": 1.7,
                "stroke-linejoin": "round"
            });
        }
        var circle = this.view.circle(point.x, point.y, 0);
        marker.push(circle, triangle);
        markers[trainId] = marker;
    }

};