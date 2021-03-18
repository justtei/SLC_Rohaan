mslc.define('client/models/js/direction', ['lib/ko', 'client/util', 'client/models/js/step'], function(ko, util, Step) {
    'use strict';

    function Direction(leg) {
        this.start = leg.start_address;
        this.end = leg.end_address;
        this.distance = leg.distance.text;
        this.duration = leg.duration.text;
        this.steps = util.map(leg.steps, Step);
    }

    return Direction;
});