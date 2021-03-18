mslc.define('client/services/map/directions', ['lib/gm', 'lib/jQuery', 'client/util'], function(gm, $, util) {
    'use strict';

    function DirectionsService() {

        //#region Private

        var directionsService;
        
        //#endregion

        //#region Public

        function route(origin, destination) {
            var request = {
                origin: origin,
                destination: destination,
                travelMode: gm.DirectionsTravelMode.DRIVING,
                region: 'US'
            },
                deferred = new $.Deferred();

            directionsService.route(request, function(response, status) {
                if (status !== gm.DirectionsStatus.OK) {
                    deferred.reject(status);
                    return;
                }
                
                var result = response.routes[0];

                deferred.resolve(result, response);
            });

            return deferred.promise();
        }

        //#endregion

        //#region Interface

        this.route = route;

        //#endregion

        //#region Initialize

        function init() {
            directionsService = new gm.DirectionsService();
        }

        init();

        //#endregion

        return this;
    }

    return new DirectionsService();
});