mslc.define('admin/controls/googleMap', ['lib/ko'], function(ko) {
    'use strict';

    function GoogleMap(latitude, longitude) {
        var self = this;

        this.map = null;
        this.setMarker = null;
        this.latitude = latitude;
        this.longitude = longitude;

        self.latitude.subscribe(function() {
            self.setCoordinates(self.latitude(), self.longitude());
        });

        self.longitude.subscribe(function() {
            self.setCoordinates(self.latitude(), self.longitude());
        });

        this.init = function() {
            if (self.map === null) {
                var center = new window.google.maps.LatLng(self.latitude(), self.longitude());
                var options =
                {
                    zoom: 15,
                    center: center,
                    mapTypeId: window.google.maps.MapTypeId.ROADMAP
                };
                self.map = new window.google.maps.Map(document.getElementById('googleMap'), options);
            }
            self.addMarker();
        };

        this.addMarker = function() {
            if (self.setMarker !== null) {
                self.setMarker.setMap(self.map);
                self.setMarker.setPosition(self.map.getCenter());
            } else {
                self.setMarker = new window.google.maps.Marker({
                    map: self.map,
                    draggable: true,
                    animation: window.google.maps.Animation.DROP,
                    position: self.map.getCenter()
                });

                window.google.maps.event.addListener(self.setMarker, 'click', self.toggleBounceMarker);
                window.google.maps.event.addListener(self.setMarker, 'dragend', self.markerPositionChanged);
            }
            self.setLatLonInputs(self.setMarker.getPosition());
        };

        this.toggleBounceMarker = function() {
            if (self.setMarker.getAnimation() !== null) {
                self.setMarker.setAnimation(null);
            } else {
                self.setMarker.setAnimation(window.google.maps.Animation.BOUNCE);
            }
        };

        this.markerPositionChanged = function() {
            var latlng = self.setMarker.getPosition();
            self.map.setCenter(latlng);
            self.setLatLonInputs(latlng);
        };

        this.setLatLonInputs = function(latlng) {
            self.latitude(latlng.lat());
            self.longitude(latlng.lng());
        };

        this.setCoordinates = function(lat, lon) {
            self.centerX = lat;
            self.centerY = lon;
            var latlng = new window.google.maps.LatLng(self.centerX, self.centerY);
            self.map.setCenter(latlng);
            self.map.panTo(latlng);
            self.addMarker();
        };
    }

    return GoogleMap;
});