ko.bindingHandlers.fade =
{
    init: function (element, valueAccessor)
    {
        var value = valueAccessor();
        var visible = $(element).is(':visible');
        if (value && !visible)
        {
            $(element).fadeIn();
        }
        else if (!value && visible)
        {
            $(element).hide();
        }
    },
    update: function (element, valueAccessor)
    {
        ko.bindingHandlers.fade.init(element, valueAccessor);
    }
};

function GoogleMap(latitude, longitude, endingAddress, endingName, print)
{
    var self = this;

    this.lat = latitude;
    this.communityName = endingName;
    this.lon = longitude;
    this.googleMaps = window.google.maps;
    this.marker = null;
    this.directionsDisplay = null;
    this.startingAddress = ko.observable();
    this.endingAddress = ko.observable();
    this.drivingDirections = ko.observableArray();
    this.pending = ko.observable(false);
    this.isReverceDirections = ko.observable();
    this.getDirectionsButtonText = ko.observable();
    this.getDirectionsTableHederText = ko.observable();
    this.mapHeader = ko.observable();
    this.basePrint = print;
    this.destination = ko.observable();
    this.printUrl = ko.computed(function ()
    {
        if (!self.destination())
        {
            return null;
        }
        var pos = self.destination().split(", ");
        return self.basePrint + '?lat=' + pos[0] + '&lon='+ pos[1] + '&isReverce=' + (self.isReverceDirections() === false);
    });

    this.setDirections = function (isReverce)
    {
        if (!isReverce)
        {
            self.isReverceDirections(false);
            self.getDirectionsButtonText('Get Directions');
            self.getDirectionsTableHederText('Reverse Driving Directions for ' + self.communityName);
        } else
        {
            self.isReverceDirections(true);
            self.getDirectionsButtonText('Get Reverse Directions');
            self.getDirectionsTableHederText('Driving Directions for ' + self.communityName);
        }
    };

    this.updateMap = function (lating, longing, endAddr, name, basePrint)
    {
        self.communityName = name;
        self.endingAddress(endAddr);
        self.mapHeader('Map & Directions for ' + self.communityName);
        self.startingAddress('');
        self.drivingDirections.removeAll();
        self.setDirections(false);
        self.basePrint = basePrint;
        self.destination(null);
        if ((!lating && !longing) || (lating == 0 && longing == 0))
        {
            var geocoder = new self.googleMaps.Geocoder();
            geocoder.geocode({ 'address': endAddr }, function (results, geocoderStatus)
            {
                if (geocoderStatus === self.googleMaps.GeocoderStatus.OK)
                {
                    var location = results[0].geometry.location;
                    self.lat = location.lat();
                    self.lon = location.lng();
                }
                initializeMap();
            });
        } else
        {
            self.lat = lating;
            self.lon = longing;
            initializeMap();
        }

        function initializeMap()
        {
            var center = new self.googleMaps.LatLng(self.lat, self.lon);
            var options =
                {
                    zoom: 15,
                    center: center,
                    mapTypeId: self.googleMaps.MapTypeId.ROADMAP
                };
            var map = new self.googleMaps.Map(document.getElementById('googleMap'), options);
            self.directionsDisplay = new window.google.maps.DirectionsRenderer();
            self.directionsDisplay.setMap(map);

            self.marker = new self.googleMaps.Marker({
                animation: self.googleMaps.Animation.DROP,
                position: map.getCenter(),
                icon: 'http://maps.google.com/mapfiles/marker_greenB.png'
            });
            self.marker.setMap(map);
        }
    };

    this.updateMap(latitude, longitude, endingAddress, endingName, print);

    this.getDirections = function ()
    {
        var startingAddress = self.startingAddress();
        if (!$.trim(startingAddress))
        {
            showMessage(false, null, 'Starting Address input can not be empty');
            return;
        }

        this.pending(true);
        var geocoder = new self.googleMaps.Geocoder();
        geocoder.geocode({ 'address': startingAddress }, function (results, geocoderStatus)
        {
            if (geocoderStatus !== self.googleMaps.GeocoderStatus.OK)
            {
                showMessage(false, null, 'Google was unable to parse Starting Address input value');
                self.pending(false);
                return;
            }

            var location = results[0].geometry.location;
            var start;
            var end;
            if (!self.isReverceDirections())
            {
                start = [location.lat(), location.lng()].join(', ');
                end = [self.lat, self.lon].join(', ');
            } else
            {
                end = [location.lat(), location.lng()].join(', ');
                start = [self.lat, self.lon].join(', ');
            }

            var directionsService = new self.googleMaps.DirectionsService();
            var request =
                {
                    origin: start,
                    destination: end,
                    travelMode: self.googleMaps.DirectionsTravelMode.DRIVING
                };

            directionsService.route(request, function (response, status)
            {
                if (status !== self.googleMaps.DirectionsStatus.OK)
                {
                    showMessage(false, null, 'Google was unable to find directions');
                }
                else 
                {
                    self.destination(self.isReverceDirections() ? end : start);
                    self.marker.setMap(null);
                    self.directionsDisplay.setDirections(response);
                    var route = response.routes[0];
                    self.drivingDirections.removeAll();
                    ko.utils.arrayForEach(route.legs[0].steps, function (step)
                    {
                        self.drivingDirections.push(step.instructions);
                    });
                    self.setDirections(!self.isReverceDirections());
                }
                self.pending(false);
            });
        });
    };

    this.startingAddressOnKeyDown = function (googleMap, event)
    {
        if (event.keyCode === 13 && !self.pending())
        {
            var srcElement = event.target || event.srcElement;
            // we must lose focus because otherwise value won't be updated ('onchange' won't be invoked)
            srcElement.blur();
            self.getDirections();
            return false;
        }
        return true;
    };

    this.closeGoogleMapModal = function()
    {
        $('#mapViewModal').dialog('close');
    };
}