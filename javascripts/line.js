Line = function (origin, direction) {
    this.setOrigin(origin);
    this.setDirection(direction);
};

Line.prototype = {
    setOrigin: function(origin) {
        this.origin = origin;
    },

    getOrigin: function() {
        return this.origin;
    },

    setDirection: function (direction) {
        this.direction = direction;
    },

    getDirection: function (direction) {
        return this.direction;
    },

    projection: function (point) {
        p0p = new Vector(this.getOrigin().getx(), this.getOrigin().gety(), point.getx(),point.gety());
        directionLength = this.getDirection().length();
        scalefactor = p0p.dot(this.getDirection()) / (directionLength * directionLength);
        result = this.getDirection().clone();
        result.scale(scalefactor);
        result.add(this.getOrigin());
        return result;
    }
};