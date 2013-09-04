(function() {
    "use strict";

    function ByensPuls () {
        this.togListe = [];
    }

    ByensPuls.TogData = function (action, linie, station) {
        this.action = action;
        this.linie = linie;
        this.station = station;
    }

    ByensPuls.TogPosition = function (positionx, positiony, angle) {
        this.position = {};
        this.position.x = positionx;
        this.position.y = positiony;
        this.angle = angle;
    }

    ByensPuls.prototype.addTogData = function (number, data) {
        var tog = this.getTog(number);
        tog.data = data;
    }

    ByensPuls.prototype.addTogPosition = function (number, position) {
        var tog = this.getTog(number);
        tog.position = position;
    }

    ByensPuls.prototype.getTog = function (number) {
        var togEntry = this.togListe[number];
        if(togEntry == null || togEntry == 'undefined') {
            var togEntry = {};
            this.togListe[number] = togEntry;
        }
        return togEntry;
    }

    ByensPuls.prototype.removeTog = function (number) {
        var tog = this.togListe[number];
        console.log("will remove tog " + number);
    }    

    ByensPuls.parse = function (input) {
        bp.yy = new ByensPuls();
        return bp.parse(input);
    };

    this.ByensPuls = ByensPuls;

}).call(this);