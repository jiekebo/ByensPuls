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

    ByensPuls.prototype.addTogData = function (number, data) {
        var tog = this.getTog(number);
        tog.data = data;
    };

    ByensPuls.prototype.addTogPosition = function (number, position) {
        var tog = this.getTog(number);
        tog.position = position;
    };

    ByensPuls.prototype.getTog = function (number) {
        var togEntry = this.togListe[number];
        if(togEntry == null || togEntry == 'undefined') {
            togEntry = {};
            this.togListe[number] = togEntry;
        }
        return togEntry;
    };

    ByensPuls.prototype.removeTog = function (number) {
        var tog = this.togListe[number];
        console.log("will remove tog " + number);
    };

    ByensPuls.prototype.addDelay = function (number, delay) {
        var tog = this.getTog(number);
        tog.delay = delay;
    };
    
    /*> ../build/grammar.js */

    ByensPuls.parse = function (input) {
        grammar.yy = new ByensPuls();
        return grammar.parse(input);
    };

    this.ByensPuls = ByensPuls;

}).call(this);
