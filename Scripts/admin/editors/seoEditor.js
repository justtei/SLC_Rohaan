mslc.define('admin/editors/seoEditor', [
        'lib/ko',
        'admin/config',
        'admin/util',
        'admin/util/ajax',
        'admin/models/enums/seoPageType',
        'admin/models',
        'admin/controls/notification',
        'admin/controls/loadingOverlay'
],
    function(ko, config, util, ajax, SeoPageType, models, notification, loadingOverlay) {
        'use strict';

        function SeoEditor(data) {
            var self = this;

            this.seoId = ko.observable();
            this.seoPages = data.seoPages;
            this.seoPage = ko.observable();
            this.searchTypes = data.searchTypes;
            this.searchType = ko.observable();
            this.countries = ko.observableArray();
            this.countryId = ko.observable();
            this.states = ko.observableArray();
            this.stateId = ko.observable();
            this.cities = ko.observableArray();
            this.cityId = ko.observable();
            this.seoMetadata = new models.ko.SeoMetadata(data.seoMetadata);

            this.isPageTypeSelectVisible = ko.computed(function() {
                var seoPage = self.seoPage();
                var result = seoPage && seoPage !== SeoPageType.INDEX;

                return result;
            });

            this.isDescriptionAndKeywordsVisible = ko.computed(function() {
                var seoPage = self.seoPage();
                var result = seoPage === SeoPageType.INDEX ||
                    seoPage === SeoPageType.SEARCH_RESULT && self.countryId() ||
                    seoPage === SeoPageType.SEARCH_DETAILS && self.cityId();

                return result;
            });

            this.isSeoCopyTextVisible = ko.computed(function() {
                var result = self.seoPage() === SeoPageType.SEARCH_RESULT && self.countryId();
                return result;
            });

            self.seoPage.subscribe(function(newPage) {
                self.searchType(undefined);

                if (newPage === SeoPageType.INDEX) {
                    loadingOverlay.show();

                    ajax.post(config.setting('getIndexMetadataUrl'), { seoPage: newPage }, function(data) {
                        self.updateMetada(data);
                    }, notification.showAjaxServerErrorMessage, loadingOverlay.hide);
                }
            });

            self.searchType.subscribe(function(newType) {
                self.countryId(undefined);

                if (newType) {
                    if (!self.countries().length) {
                        loadingOverlay.show();

                        ajax.post(config.setting('getSeoCountriesUrl'), {}, function(countries) {
                            self.countries(countries);
                        }, notification.showAjaxServerErrorMessage, loadingOverlay.hide);
                    }
                } else {
                    self.countries.removeAll();
                }

            });

            self.countryId.subscribe(function(newId) {
                self.stateId(undefined);

                if (newId) {
                    self.getCountryMetaData();
                }
            });

            self.stateId.subscribe(function(newId) {
                self.cityId(undefined);

                if (newId) {
                    self.getStateMetadata();
                } else if (self.countryId() && self.seoPage() !== SeoPageType.SEARCH_DETAILS) {
                    self.getCountryMetaData();
                }
            });

            self.cityId.subscribe(function(newId) {
                if (newId) {
                    self.getCityMetadata();
                } else if (self.countryId() && self.stateId() && self.seoPage() !== SeoPageType.SEARCH_DETAILS) {
                    self.getStateMetadata();
                }
            });

            this.getCountryMetaData = function() {
                loadingOverlay.show();

                ajax.post(config.setting('getCountryMetadataUrl'), self, function(data) {
                    self.states(data.states);
                    self.updateMetada(data.metaData);
                }, notification.showAjaxServerErrorMessage, loadingOverlay.hide);
            };

            this.getStateMetadata = function() {
                loadingOverlay.show();

                ajax.post(config.setting('getStateMetadataUrl'), self, function(data) {
                    self.cities(data.cities);
                    self.updateMetada(data.metaData);
                }, notification.showAjaxServerErrorMessage, loadingOverlay.hide);
            };

            this.getCityMetadata = function() {
                loadingOverlay.show();

                ajax.post(config.setting('getCityMetadataUrl'), self, function(data) {
                    self.updateMetada(data);
                }, notification.showAjaxServerErrorMessage, loadingOverlay.hide);
            };

            this.updateMetada = function(data) {
                self.seoId(data.seoId);
                self.seoMetadata.metaDescription(data.seoMetadata.metaDescription);
                self.seoMetadata.metaKeywords(data.seoMetadata.metaKeywords);
                self.seoMetadata.seoCopyText(data.seoMetadata.seoCopyText);
            };

            this.getData = function() {
                var result = {                    
                    seoId: self.seoId(),
                    seoPage: self.seoPage(),
                    searchType: self.searchType(),
                    countryId: self.countryId(),
                    stateId: self.stateId(),
                    cityId: self.cityId(),
                    seoMetadata: self.seoMetadata
                };

                return result;
            };

            this.submit = function() {
                loadingOverlay.show();

                ajax.post(config.setting('saveSeoMetadataUrl'), self.getData(), function(seoId) {
                    if (!util.isNullOrUndef(seoId)) {
                        self.seoId(seoId);
                    }
                }, notification.showAjaxServerErrorMessage, loadingOverlay.hide);
            };
        }

        return {
            init: function(data) {
                var model = new SeoEditor(data);
                ko.applyBindings(model);
            }
        };
    });