mslc.define('client/analytics/google', ['client/config', 'client/util'], function(config, util) {
    'use strict';

    function GoogleAnalytics() {
        //#region Private
        
        var dimensionsMap = {
            communityId: 'dimension1',
            serviceProviderId: 'dimension2',
            communityUnitId: 'dimension3',
            bookNumber: 'dimension4',
            country: 'dimension5',
            stateCountry: 'dimension6',
            cityStateCountry: 'dimension7',
            zipStateCountry: 'dimension8',
            listingType: 'dimension9',
            beds: 'dimension10',
            bathes: 'dimension11',
            minPrice: 'dimension12',
            maxPrice: 'dimension13'
        };
        
        function mapToDimensions(data) {
            var dimensions = {};

            if (util.isNullOrUndef(data)) {
                return dimensions;
            }

            if (data) {
                for (var param in data) {
                    if (data.hasOwnProperty(param)) {
                        var dimension = dimensionsMap[param];

                        if (dimension && data[param]) {
                            dimensions[dimension] = data[param];
                        }
                    }
                }
            }

            return dimensions;
        }
        
        function trackListingEvent(listingType, action, label, data) {
            var dimensions = mapToDimensions(data);

            ga('send', 'event', listingType, action, label, dimensions);
        }

        //#endregion

        //#region Public
        
        function trackPageView(data) {
            if (data) {
                var dimensions = mapToDimensions(data);
                ga('send', 'pageview', dimensions);
            } else {
                ga('send', 'pageview');
            }
        }

        function trackUnresolvedSearch(queryString, data) {
            var dimensions = mapToDimensions(data);

            ga('send', 'event', 'Search', 'Unresolved', queryString, dimensions);
        }

        function trackLead(action, leadType, value, data) {
            var dimensions = mapToDimensions(data);
            value = value || 1;

            ga('send', 'event', 'Lead Form', action, leadType, value, dimensions);
        }

        function trackMapView(data) {
            var dimensions = mapToDimensions(data);

            ga('send', 'event', 'Map', 'View', dimensions);
        }

        function trackCommunityEvent(action, label, data) {
            trackListingEvent('Community', action, label, data);
        }

        function trackServiceProviderEvent(action, label, data) {
            trackListingEvent('Service Provider', action, label, data);
        }

        function trackLinkVisit(area, type, data) {
            var dimensions = mapToDimensions(data);

            ga('send', 'event', 'Link', area, type, dimensions);
        }

        //#endregion

        //#region Interface
        
        this.trackPageView = trackPageView;
        this.trackUnresolvedSearch = trackUnresolvedSearch;
        this.trackLead = trackLead;
        this.trackMapView = trackMapView;
        this.trackCommunityEvent = trackCommunityEvent;
        this.trackServiceProviderEvent = trackServiceProviderEvent;
        this.trackLinkVisit = trackLinkVisit;
        
        //#endregion

        //#region Constructor
        
        function init() {
            (function(i, s, o, g, r) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments);
                }, i[r].l = 1 * new Date();
                var a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            var analyticsKey = config.setting('googleAnalyticsKey');

            // TODO: remove cookieDomain setting for production environment.
            window.ga('create', analyticsKey, 'auto', { 'cookieDomain': 'none' });
            window.ga('require', 'displayfeatures');
            window.ga('set', 'forceSSL', true);
        }

        init();
        
        //#endregion

        return this;
    }

    return new GoogleAnalytics();
});