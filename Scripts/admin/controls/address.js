mslc.define('admin/controls/address', ['lib/ko', 'admin/config', 'admin/text', 'admin/util', 'admin/util/ajax', 'admin/models'],
    function(ko, config, text, util, ajax, models) {
        'use strict';

        function Address(data) {
            var self = this;

            this.id = data.id;
            this.location = new models.js.Location(data.location);
            this.streetAddress = ko.observable(data.streetAddress);
            this.country = new models.ko.Country(data.country);
            this.state = new models.ko.State(data.state);
            this.city = new models.ko.City(data.city);
            this.postalCode = ko.observable(data.postalCode);
            
            this.onAddressChange = ko.computed(function() {
                self.streetAddress();
                self.country.id();
                self.state.id();
                self.city.id();
                self.postalCode();

                self.isChanged = true;
            });

            self.country.id.subscribe(function(newId) {
                if (newId) {
                    ajax.get(config.setting('getStatesUrl'), { countryId: newId }, function(states) {
                        var stateList = util.map(states, function(state) {
                            return { text: state.name, value: state.id };
                        });
                        self.state.availableStates(stateList);
                    });
                } else {
                    self.state.availableStates.removeAll();
                }
            });

            self.state.id.subscribe(function(newId) {
                if (newId) {
                    ajax.get(config.setting('getCitiesUrl'), { stateId: newId }, function(cities) {
                        var cityList = util.map(cities, function(city) {
                            return { text: city.name, value: city.id };
                        });
                        self.city.availableCities(cityList);
                    });
                } else {
                    self.city.availableCities.removeAll();
                }
            });

            this.applyValidationRules = function() {
                self.streetAddress.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('streetAddressLabel'))
                    },
                    maxLength: {
                        params: config.setting('streetAddressMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('streetAddressLabel'), config.setting('streetAddressMaxLength'))
                    }
                });

                self.postalCode.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('Label'))
                    },
                    maxLength: {
                        params: config.setting('postalCodeMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('zipLabel'), config.setting('postalCodeMaxLength'))
                    }
                });

                util.applyValidationRules([
                    self.country,
                    self.state,
                    self.city
                ]);
            };

            this.removeValidationRules = function() {
                util.removeValidationRules([
                    self.streetAddress,
                    self.country,
                    self.state,
                    self.city,
                    self.postalCode
                ]);
            };

            this.getData = function() {
                if (self.isChanged) {
                    self.location.reset();
                }

                var result = {
                    id: self.id,
                    location: self.location,
                    streetAddress: self.streetAddress(),
                    country: self.country.getData(),
                    state: self.state.getData(),
                    city: self.city.getData(),
                    postalCode: self.postalCode()
                };

                return result;
            };

            self.applyValidationRules();
            
            this.isChanged = false;
        }

        return Address;
    });