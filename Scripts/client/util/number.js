mslc.define('client/util/number', [], function() {
    'use strict';

    function random(min, max) {
        var rmin = min || 0,
            rmax = max || 100;
        return Math.floor(Math.random() * (rmax - rmin)) + rmin;
    }

    return {
        random: random
    };
});