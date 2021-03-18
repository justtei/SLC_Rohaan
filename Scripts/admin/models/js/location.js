mslc.define('admin/models/js/location', [], function() {
    'use strict';

    function Location(data) {
        var self = this;

        this.longitude = data.longitude;
        this.latitude = data.latitude;

        this.reset = function() {
            self.longitude = null;
            self.latitude = null;
        };
    }

    return Location;
});