mslc.define('client/controls/maps/directions', [
        'lib/gm'
        , 'lib/jQuery'
        , 'client/util'
        , 'client/config'
        , 'client/text'
        , 'client/services/map/directions'
        , 'client/services/map/geocoder'
        , 'client/models/js/direction'
        , 'client/widgets/notification'
        , 'client/controls/maps/basic'
    ], function(gm, $, util, config, text, directionsService, geocoder, Direction, notification, GoogleMap) {
    'use strict';

    function DirectionsMap(data, $target, options) {
        var self = this,
            defaults = {
                zoom: 15,
                scrollwheel: false
            };

        options = util.extend(defaults, options);
        DirectionsMap.base.constructor.call(this, data, $target, options);

        //#region Private

        var directionsRenderer = null,
            marker = null,
            basePrintUrl = null;
            
        // TODO: review.
        function getPrintUrl() {
            if (!self.destination()) {
                return null;
            }

            var result = null;
            var pos = self.source();
            
            if (!util.isNullOrUndef(pos)) {
                result = basePrintUrl + '?lat=' + pos.lat() + '&lon=' + pos.lng();
            }

            return result;
        }

        function addMarker(position) {
            if (!position) {
                return;
            }
            
            marker = self.addMarker(position);
            self.map.setCenter(position);
        }
        
        //#endregion
        
        //#region Public

        function update(newData) {
            self.endingAddress = newData.endingAddress;
            self.startingAddress('');
            self.destination(null);
            self.direction(null);
            self.pending(false);
            self.removeMarkers();

            if (!newData.latitude && !newData.longitude) {
                self.pending(true);

                geocoder.geocode(newData.endingAddress).done(function(location) {
                    if (location) {
                        self.destination(location);
                        addMarker(location);
                    }
                }).always(function() {
                    self.pending(false);
                });
            } else {
                self.destination(new gm.LatLng(newData.latitude, newData.longitude));
                addMarker(self.destination());
            }
        }

        function showDirections() {
            var startingAddress = self.startingAddress();

            if (!$.trim(startingAddress)) {
                notification.show({success: false, message: 'Starting Address input can not be empty'});
                return;
            }

            self.pending(true);

            geocoder.geocode(startingAddress).done(function(location) {
                self.source(location);

                var start = location,
                    end = self.destination();

                directionsService.route(start, end).done(function(route, response) {
                    marker.setMap(null);
                    directionsRenderer.setDirections(response);
                    self.direction(new Direction(route.legs[0]));
                    self.invalidate();
                }).fail(function() {
                    //TODO: resolve message.
                    notification.show({success: false, message: 'Google was unable to find directions'});
                }).always(function() {
                    self.pending(false);
                });
            }).fail(function() {
                //TODO: resolve message.
                notification.show({success: false, message: 'Google was unable to parse Starting Address input value'});
            }).always(function() {
                self.pending(false);
            });;
        }

        function hideDirections() {
            directionsRenderer.set('directions', null);
            self.direction(null);
            self.map.setCenter(self.destination());
            self.map.setZoom(options.zoom);

            if (marker) {
                marker.setMap(self.map);
            }

            self.invalidate();
        }

        function afterRender() {
            update(data);
            directionsRenderer.setMap(self.map);
            hideDirections();
        }

        //#endregion
        
        //#region Interface 
        
        this.endingAddress = null;
        this.startingAddress = ko.observable();
        this.source = ko.observable();
        this.destination = ko.observable();
        this.direction = ko.observable();
        this.pending = ko.observable();

        this.printUrl = ko.computed(getPrintUrl);

        this.showDirections = showDirections;
        this.hideDirections = hideDirections;
        this.afterRender = afterRender;
        //#endregion

        //#region Initialize

        function init() {
            basePrintUrl = data.printDirectionBaseUrl;
            directionsRenderer = new gm.DirectionsRenderer({
                draggable: false,
                hideRouteList: true,
                markerOptions: {
                    icon: '/content/images/map/marker.png'
                }
            });
            
            if ($target
                && $target.length) {
                afterRender();
            }
        }

        init();

        //#endregion

    }
        
    util.extendClass(DirectionsMap, GoogleMap);

    return DirectionsMap;
});