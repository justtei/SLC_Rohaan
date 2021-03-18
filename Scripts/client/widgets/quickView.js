mslc.define('client/widgets/quickView',
    [
        'lib/ko'
        , 'lib/jQuery'
        , 'client/services/remote'
        , 'client/util'
        , 'client/ui/selectManager'
        , 'client/models/ko/listingQuickView'
        , 'client/widgets/communityUnit'
        , 'client/controls/maps/directions'
    ],
    function(ko, $, remote, util, selectManager, ListingQuickViewVm, units, DirectionsMap) {
        'use strict';

        function QuickView(communityData) {

            //#region Private

            var self = this,
                tabs = {
                    quick: {
                        template: 'quick',
                        model: null,
                        dataProvider: remote.get.quickView,
                        Constructor: ListingQuickViewVm,
                        afterRender: null
                    },
                    map: {
                        template: 'map-view',
                        model: null,
                        dataProvider: loadMap,
                        Constructor: MapView,
                        afterRender: renderMap
                    },
                    floor: {
                        template: 'floor',
                        model: null,
                        dataProvider: remote.get.floorPlans,
                        Constructor: storeUnitData,
                        afterRender: null
                    },
                    specHome: {
                        template: 'spec-home',
                        model: null,
                        dataProvider: remote.get.specHomes,
                        Constructor: storeUnitData,
                        afterRender: null
                    },
                    home: {
                        template: 'home',
                        model: null,
                        dataProvider: remote.get.homes,
                        Constructor: storeUnitData,
                        afterRender: null
                    },
                    provider: {
                        template: 'provider',
                        model: null,
                        dataProvider: remote.get.providerQuickView,
                        Constructor: ListingQuickViewVm,
                        afterRender: null
                    }
                };

            function switchTab(tab) {
                self.isInAnimation(true);
                self.isShow({
                    flag: false,
                    callback: function() {
                        self.tab(tab);
                        if (tab.template === 'quick' || tab.template === 'provider') {
                            selectManager.apply();
                        }
                        self.isShow({
                            flag: true,
                            callback: function() {
                                self.isInAnimation(false);
                            }
                        });
                    }
                });
            }

            function loadTab(tab) {
                self.isLoading(true);

                function handleRemote(data) {
                    tab.model = !util.isNullOrUndef(tab.Constructor) ? new tab.Constructor(data) : data;
                    switchTab(tab);
                    self.isLoading(false);
                }

                util.invoke(tab.dataProvider, communityData, handleRemote);
            }

            function showTab(tab) {
                if (tab.model === null) {
                    loadTab(tab);
                } else if (tab.template === self.tab().template) {
                    self.isInAnimation(true);
                    self.isShow({
                        flag: !self.isShow().flag,
                        callback: function() {
                            self.isInAnimation(false);
                        }
                    });
                } else {
                    switchTab(tab);
                }
            }

            function handleLoad(isLoading) {
                var $bar = $(self.linkedNode);
                if (isLoading) {
                    $bar.nanobar('reinit');
                    $bar.nanobar('start');
                } else {
                    $bar.nanobar('done');
                }
            }

            function storeUnitData(array) {
                util.foreach(array, function(item) {
                    units.addToStorage(item.id, item);
                });

                return array;
            }

            //#region Maps

            function MapView(community) {
                var data = {
                    latitude: community.address.latitude,
                    longitude: community.address.longitude,
                    endingAddress: community.address.full,
                    printDirectionBaseUrl: community.printDirectionBaseUrl
                },
                    options = {
                        customControls: false
                    },
                    model = new DirectionsMap(data, null, options);

                return model;
            }

            function loadMap(communityData, handleRemote) {
                // TODO: refactor this.
                if (util.isDefined(communityData.serviceProviderId)) {
                    if (tabs.provider.model) {
                        util.invoke(handleRemote, tabs.provider.model);
                    } else {
                        util.invoke(remote.get.providerQuickView, communityData, function(data) {
                            tabs.provider.model = new tabs.provider.Constructor(data);
                            util.invoke(handleRemote, data);
                        });
                    }
                } else {
                    if (tabs.quick.model) {
                        util.invoke(handleRemote, tabs.quick.model);
                    } else {
                        util.invoke(remote.get.quickView, communityData, function(data) {
                            tabs.quick.model = new tabs.quick.Constructor(data);
                            util.invoke(handleRemote, data);
                        });
                    }
                }
            }

            function renderMap(elements, map) {
                var $target = $(elements).filter('.map-view');

                map.render($target);
                map.invalidate();
            }

            function invalidateMap(isInAnimation) {
                var tab = self.tab();

                if (isInAnimation
                    || tab.template !== 'map-view') {
                    return;
                }

                tab.model.invalidate();
            }

            //#endregion

            //#endregion

            //#region Public

            function tabFactory(name) {
                return function() {
                    showTab(tabs[name]);
                };
            }

            function hide() {
                self.isShow({flag: false});
            }

            function show() {
                self.isShow({flag: true});
            }

            //#endregion

            //#region Interface

            this.tab = ko.observable();
            this.isShow = ko.observable();
            this.isLoading = ko.observable();
            this.isInAnimation = ko.observable();

            this.tabs = tabFactory;
            this.hide = hide;
            this.show = show;

            //#endregion

            //#region Initialize

            function init() {
                self.isShow({});
                self.tab({});
                self.isLoading.subscribe(handleLoad);
                self.isInAnimation.subscribe(invalidateMap);
            }

            init();

            //#endregion
        }

        return QuickView;
    });