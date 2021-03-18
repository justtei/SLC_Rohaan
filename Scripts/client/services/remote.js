mslc.define('client/services/remote', ['client/util/ajax', 'client/services/location'], function(aj, loc) {
    'use strict';

    function Remote() {

        var self = this,
            routes = {
                get: {
                    communitySearchUrl: 'client/CommunitySearchUrl'
                    , providerSearchUrl: 'client/ProviderSearchUrl'
                    , quickView: 'Client/communityQuickView'
                    , floorPlans: 'Client/FloorPlansQuickView'
                    , homes: 'Client/HomesQuickView'
                    , specHomes: 'Client/SpecHomesQuickView'
                    , autocomplete: 'Client/Autocomplete'
                    , searchFromBar: 'Client/SearchFromBar'
                    , providerQuickView: 'Client/ServiceProviderQuickView'
                },
                post: {
                    leadForm: 'client/ProcessLead'
                }
            },
            apiUrl = loc.absolute('api');

        function actionFactory(type, route) {
            var url = loc.concat(apiUrl, route);
            return function(data, done, fail, always) {
                return aj.request(type, url, data, done, fail, always);
            };
        }

        function init() {
            for (var type in routes) {
                if (routes.hasOwnProperty(type)) {
                    self[type] = {};
                    for (var action in routes[type]) {
                        if (routes[type].hasOwnProperty(action)) {
                            self[type][action] = actionFactory(type, routes[type][action]);
                        }
                    }
                }
            }
        }

        init();

        return this;
    }

    return new Remote();
});