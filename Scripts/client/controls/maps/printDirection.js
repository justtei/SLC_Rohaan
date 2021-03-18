mslc.define('client/controls/maps/printDirection', [
        'lib/gm'
        , 'client/util'
        , 'client/services/map/directions'
        , 'client/services/map/geocoder'
        , 'client/models/js/direction'
        , 'client/widgets/notification'
        , 'client/controls/maps/basic'
], function(gm, util, directionsService, geocoder, Direction, notification, GoogleMap) {
    'use strict';

    function PrintDirectionMap(data, $target, options) {
        var self = this,
            defaults = {
                zoom: 15,
                scrollwheel: false
            };

        options = util.extend(defaults, options);
        PrintDirectionMap.base.constructor.call(this, data, $target, options);

        //#region Private

        var directionsRenderer = null;

        var showDirection = function(source, destination) {
            directionsService.route(source, destination).done(function(route, response) {
                directionsRenderer.setDirections(response);
                self.direction(new Direction(route.legs[0]));
                setTimeout(function() {
                    window.print();
                }, 3000);
            }).fail(function(status) {
                //TODO: resolve message.
                notification.show({ success: false, message: 'Google was unable to find directions' });
            });
        };

        //#endregion

        //#region Interface 

        this.direction = ko.observable();

        //#endregion

        //#region Initialize

        function init() {
            directionsRenderer = new gm.DirectionsRenderer({
                map: self.map,
                draggable: false,
                hideRouteList: true,
                markerOptions: {
                    icon: '/content/images/map/marker.png'
                }
            });

            if ($target) {
                var source = new gm.LatLng(data.startLatitude, data.startLongitude);
                var destination;

                if (!data.endLatitude && !data.endLongitude) {
                    geocoder.geocode(data.endAddress).done(function(location) {
                        if (location) {
                            destination = location;
                            showDirection(source, destination);
                        }
                    });
                } else {
                    destination = new gm.LatLng(data.endLatitude, data.endLongitude);
                    showDirection(source, destination);
                }
            }
        }

        init();

        //#endregion
    }

    util.extendClass(PrintDirectionMap, GoogleMap);

    return PrintDirectionMap;
});