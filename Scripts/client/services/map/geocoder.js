mslc.define('client/services/map/geocoder', ['lib/gm', 'lib/jQuery', 'client/util'], function(gm, $, util) {
    'use strict';

    function Geocoder() {

        //#region Private

        var geocoder;
        
        //#endregion

        //$region Public

        function geocode(address) {
            var deferred = new $.Deferred();
            
            geocoder.geocode({'address': address}, function(results, status) {
                if (status !== gm.GeocoderStatus.OK) {
                    deferred.reject(status);
                    return;
                }

                var location = results[0].geometry.location;

                deferred.resolve(location);
            });

            return deferred.promise();
        }

        //#endregion

        //#region Interface

        this.geocode = geocode;

        //#endregion

        //#region Initialize

        function init() {
            geocoder = new gm.Geocoder();
        }

        init();

        //#endregion

        return this;
    }

    return new Geocoder();
});