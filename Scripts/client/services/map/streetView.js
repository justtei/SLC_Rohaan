mslc.define('client/services/map/streetView', ['lib/gm', 'lib/jQuery', 'client/util'], function(gm, $, util) {
    'use strict';

    function StreetViewService() {

        //#region Private

        var streetView;

        //#endregion

        //$region Public

        function getPanoramaByLocation(position) {
            var deferred = new $.Deferred();

            streetView.getPanoramaByLocation(position, 51, function(response, status) {
                if (status != gm.StreetViewStatus.OK) {
                    deferred.reject(status);
                    return;
                }

                var heading = gm.geometry.spherical.computeHeading(response.location.latLng, position),
                    pano = response.location.pano;

                deferred.resolve(pano, heading);
            });

            return deferred.promise();
        }

        //#endregion

        //#region Interface

        this.getPanoramaByLocation = getPanoramaByLocation;

        //#endregion

        //#region Initialize

        function init() {
            streetView = new gm.StreetViewService();
        }

        init();

        //#endregion

        return this;
    }

    return new StreetViewService();
});