(function() {
    "use strict";
    /*global grammar _ */

    function BPParser () {
        this.trainList = [];
    };

    BPParser.prototype = {
        addTrainData: function (number, action, linie, station) {
            var train = this.getTrain(number);
            train.action = action;
            train.linie = linie;
            train.station = station;
        },

        addTrainPosition: function (number, x, y, degrees) {
            var train = this.getTrain(number);
            train.x = x;
            train.y = y;
            train.degrees = degrees;
        },

        getTrain: function (number) {
            var trainEntry = this.trainList[number];
            if(trainEntry == null || trainEntry == 'undefined') {
                trainEntry = {};
                this.trainList[number] = trainEntry;
            }
            return trainEntry;
        },

        removeTrain: function (number) {
            var train = this.getTrain[number];
            train.marker.remove();
            delete this.trainList[number];
        },

        addDelay: function (number, delay) {
            var train = this.getTrain(number);
            train.delay = delay;
        },

        getTrainListe: function () {
            return this.trainList;
        },

        setMarker: function (number, marker) {
            var train = this.getTrain(number);
            train.marker = marker;
        },

        getMarker: function (number) {
            return this.getTrain(number).marker;
        }
        
    };
    
    /*> Grammar.js */

    BPParser.parse = function (input) {
        if(!this.bp) {
            this.bp = new BPParser();
            Grammar.yy = this.bp;
        }
        return Grammar.parse(input);
    };

    BPParser.getTrainJSON = function() {
        return JSON.stringify(this.bp.trainList);
    }

    this.BPParser = BPParser;

}).call(this);
