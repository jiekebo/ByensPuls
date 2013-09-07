Vector = function (p0, p1, q0, q1) {
    if(!q0 || !q1) {
        this.setx(p0);
        this.sety(p1);
    } else {
        this.setx(q0-p0);
        this.sety(q1-p1);
    }
};

Vector.prototype = {
    clone: function () {
        return new Vector(this.getx(), this.gety());
    },
    setx: function (x) {
        this.x = x;
    },

    getx: function () {
        return this.x;
    },

    sety: function (y) {
        this.y = y;
    },

    gety: function () {
        return this.y;
    },

    add: function (otherVector) {
        this.x += otherVector.getx();
        this.y += otherVector.gety();
    },

    sub: function (otherVector) {
        this.x -= otherVector.getx();
        this.y -= otherVector.gety();
    },

    dot: function (otherVector) {
        return this.x * otherVector.getx() + this.y * otherVector.gety();
    },

    scale: function (scale) {
        this.x *= scale;
        this.y *= scale;
    },

    length: function () {
        return Math.sqrt(this.dot(this));
    },

    unit: function () {
        length = this.length();
        unitx = this.x / length;
        unity = this.y / length;
        return new Vector(unitx, unity);
    }
};