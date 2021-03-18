mslc.define('client/controls/maps/states', [
        'lib/gm'
        , 'client/util'
        , 'client/config'
        , 'client/services/location'
        , 'client/controls/maps/basic'
    ], function(gm, util, config, location, GoogleMap) {
    'use strict';
    function StatesMap(data, $target, options) {
        var defaults = {
            customControls: {
                satellite: true,
                streetView: false
            }
        };

        options = util.extend(defaults, options);
        StatesMap.base.constructor.call(this, data, $target, options);

        //#region Private

        var self = this,
            kmlLayer;

        function goToStatePage(placemark) {
            var name = placemark.featureData.name,
                pattern = /[^-\s]*\s-\s([A-Z]{2})/,
                groups = name.match(pattern),
                state,
                searchUrl;

            if (groups) {
                state = groups[1];
                searchUrl = location.concat(location.origin + location.pathname, state.toLowerCase());

                location.go(searchUrl);
            }
        }

        function load(kmzUrl) {
            kmlLayer = new gm.KmlLayer(kmzUrl,
                {
                    clickable: true,
                    preserveViewport: false,
                    suppressInfoWindows: true,
                    map: self.map
                });

            gm.event.addListenerOnce(kmlLayer, 'status_changed', function() {
                var status = kmlLayer.getStatus();

                if (status === 'OK') {
                    gm.event.addListener(kmlLayer, 'click', goToStatePage);
                } else {
                    console.error('Could not load states kml. Status = %s.', status);
                }
            });
        };

        //#endregion

        //#region Initialize

        function init() {
            var kmzUrl = config.setting('statesKmzUrl');

            if (!util.isNullOrEmpty(kmzUrl)) {
                load(kmzUrl);
            }
        }

        init();

        //#endregion

    }

    util.extendClass(StatesMap, GoogleMap);

    return StatesMap;
});