(function() {
    "use strict";
    /*global grammar _ */

    function ByensPuls () {
        this.togListe = [];
    };

    ByensPuls.TogData = function (action, linie, station) {
        this.action = action;
        this.linie = linie;
        this.station = station;
    };

    ByensPuls.TogPosition = function (positionx, positiony, angle) {
        this.x = positionx;
        this.y = positiony;
        this.angle = angle;
    };

    ByensPuls.prototype = {
        addTogData: function (number, data) {
            var tog = this.getTog(number);
            tog.data = data;
        },

        addTogPosition: function (number, position) {
            var tog = this.getTog(number);
            tog.position = position;
        },

        getTog: function (number) {
            var togEntry = this.togListe[number];
            if(togEntry == null || togEntry == 'undefined') {
                togEntry = {};
                this.togListe[number] = togEntry;
            }
            return togEntry;
        },

        removeTog: function (number) {
            var tog = this.getTog[number];
            tog.marker.remove();
            delete this.togListe[number];
        },

        addDelay: function (number, delay) {
            var tog = this.getTog(number);
            tog.delay = delay;
        },

        getTogListe: function () {
            return this.togListe;
        },

        setMarker: function (number, marker) {
            var tog = this.getTog(number);
            tog.marker = marker;
        },

        getMarker: function (number) {
            return this.getTog(number).marker;
        },

        getTrainLine: function (trainLineString) {
            return trainLineString.split("[a-zA-Z]*")[0];
        }
    };
    
    /*> ../build/grammar.js */

    ByensPuls.parse = function (input) {
        if(!this.bp) {
            this.bp = new ByensPuls();
            grammar.yy = this.bp;
        }
        return grammar.parse(input);
    };

    this.ByensPuls = ByensPuls;

}).call(this);
