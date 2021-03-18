function PrintDirections(gmap, pointA, listingPoint, containerA, containerB, isReverce, listingAddress) {
    var init = function (callback) {
        var delimeter = ', ';
        var start = { lat: 0, lon: 0 };
        var end = { lat: 0, lon: 0 };

        var setup = function () {
            if (isReverce) {
                var point = pointA;
                pointA = listingPoint;
                listingPoint = point;
            }

            start = { lat: pointA.lat, lon: pointA.lon };
            end = { lat: listingPoint.lat, lon: listingPoint.lon };

            var centerA = new gmap.LatLng(start.lat, start.lon);
            var centerB = new gmap.LatLng(end.lat, end.lon);
            var optionsA = new options(centerA);
            var optionsB = new options(centerB);

            var mapA = new gmap.Map(containerA, optionsA);
            var mapB = new gmap.Map(containerB, optionsB);

            var markerA = new marker(mapA, 'http://maps.google.com/mapfiles/marker_greenA.png');
            markerA.setMap(mapA);

            var markerB = new marker(mapB, 'http://maps.google.com/mapfiles/marker_greenB.png');
            markerB.setMap(mapB);

            function options(center) {
                return {
                    zoom: 15,
                    center: center,
                    mapTypeId: gmap.MapTypeId.ROADMAP
                };
            }

            function marker(map, icon) {
                return new gmap.Marker({
                    animation: null,
                    position: map.getCenter(),
                    icon: icon
                });
            }
        };

        var getDirections = function (callback) {
            var origin = [start.lat, start.lon].join(delimeter);
            var destination = [end.lat, end.lon].join(delimeter);
            var request =
        {
            origin: origin,
            destination: destination,
            travelMode: gmap.TravelMode.DRIVING
        };
            var directionService = new gmap.DirectionsService();
            directionService.route(request, function (response, status) {
                if (status == gmap.DirectionsStatus.OK) {
                    callback(response.routes[0].legs[0]);
                }
            });
        };

        if ((!listingPoint.lat && !listingPoint.lon) || (listingPoint.lat === 0 && listingPoint.lon === 0)) {
            var geocoder = new gmap.Geocoder();
            geocoder.geocode({ 'address': listingAddress }, function (results, geocoderStatus) {
                if (geocoderStatus === gmap.GeocoderStatus.OK) {
                    var location = results[0].geometry.location;
                    listingPoint.lat = location.lat();
                    listingPoint.lon = location.lng();
                    setup();
                    getDirections(callback);
                }
            });
        } else {
            setup();
            getDirections(callback);
        }
    };

    return {
        init: init
    };
}