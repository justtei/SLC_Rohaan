mslc.define('client/controls/maps/basic', [
        'lib/gm'
        , 'lib/ko'
        , 'client/util'
        , 'client/config'
        , 'client/services/map/streetView'
    ], function(gm, ko, util, config, streetViewService) {
    'use strict';

    function GoogleMap(data, $target, options) {

        //#region Private

        var self = this,
            defaults = {
                zoom: 4,
                center: new gm.LatLng(37.09024, -95.712891),
                mapTypeId: gm.MapTypeId.ROADMAP,
                panControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                zoomControlOptions: {
                    style: gm.ZoomControlStyle.SMALL,
                    position: gm.ControlPosition.RIGHT_TOP
                },
                customControls: {
                    satellite: true,
                    streetView: true
                }
            },
            activeControl = null,
            markers = [];

        function turnStreeView() {
            var position,
                view = self.map.getStreetView();

            if (view.getVisible()) {
                return;
            }

            if (view.getPano()) {
                view.setVisible(true);

                return;
            }

            position = markers.length ? markers[0].getPosition() : self.map.getCenter();

            streetViewService.getPanoramaByLocation(position).done(function(pano, heading) {
                var pov = view.getPov();

                view.setPano(pano);
                pov.heading = heading;
                view.setOptions({
                    enableCloseButton: false,
                    zoomControlOptions: {
                        style: gm.ZoomControlStyle.SMALL,
                        position: gm.ControlPosition.TOP_RIGHT
                    }
                });

                view.setVisible(true);
            }).fail(function(status) {
                self.showStreetViewStub(true);
            });
        }
        
        function turnOffSteetView() {
            var view = self.map.getStreetView();

            view.setVisible(false);
            self.showStreetViewStub(false);
        }

        //#endregion
        
        //#region Public

        function addMarker(position) {
            var marker;

            marker = new gm.Marker({
                position: position,
                animation: gm.Animation.DROP,
                icon: '/content/images/map/marker.png',
                map: self.map
            });

            markers.push(marker);

            return marker;
        };

        function removeMarker(marker) {
            var index = markers.indexOf(marker);

            marker.setMap(null);
            markers.splice(index, 1);
        }
        
        function removeMarkers() {
            ko.utils.arrayForEach(markers, function(marker) {
                marker.setMap(null);
            });
            markers = [];
        }
        
        function turnMode(control) {
            if (activeControl) {
                util.invoke(activeControl.leave);
            }
            
            self.map.setMapTypeId(control.mapType);
            self.mode(control.mode);

            util.invoke(control.enter);
            activeControl = control;
        }

        // TODO: wait for transition end.
        function invalidate() {
            if (!self.map) {
                return;
            }
            
            var view = self.map.getStreetView();

            gm.event.trigger(self.map, 'resize');

            if (view) {
                gm.event.trigger(view, 'resize');
            }

            if (markers.length === 1) {
                self.map.setCenter(markers[0].getPosition());
            }
        }

        function render($target) {
            var canvas = $target.find('.map-canvas')[0];
            
            self.map = new gm.Map(canvas, options);

            util.invoke(self.afterRender);
        }
        
        //#endregion
        
        //#region Interface 

        this.map = null;
        this.controls = [];

        this.mode = ko.observable();
        this.showStreetViewStub = ko.observable();

        this.addMarker = addMarker;
        this.removeMarker = removeMarker;
        this.removeMarkers = removeMarkers;
        this.turnMode = turnMode;
        this.invalidate = invalidate;
        this.render = render;

        //#endregion

        //#region Initialize

        function initControls(opts) {
            if (!opts.customControls) {
                return;
            }
            
            self.controls.push({
                icon: 'icon-map-list',
                label: 'Map',
                mapType: gm.MapTypeId.ROADMAP,
                mode: 'map'
            });

            if (opts.customControls.satellite) {
                self.controls.push({
                    icon: 'icon-satellite',
                    label: 'Satellite',
                    mapType: gm.MapTypeId.HYBRID,
                    mode: 'satellite'
                });
            }

            if (opts.customControls.streetView) {
                self.controls.push({
                    icon: 'icon-street-view',
                    label: 'Street View',
                    mode: 'street-view',
                    enter: turnStreeView,
                    leave: turnOffSteetView
                });
            }
        }

        function init() {
            self.mode('map');
            self.showStreetViewStub(false);

            options = util.extend(defaults, options);
            initControls(options);
            
            if ($target && $target.length) {
                self.render($target);
            }
        }

        init();

        //#endregion

    }

    return GoogleMap;
});