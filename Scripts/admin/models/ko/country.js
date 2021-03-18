mslc.define('admin/models/ko/country', ['lib/ko', 'admin/text', 'admin/util'], function(ko, text, util) {
    'use strict';

    function Country(data) {
        var self = this;

        this.id = ko.observable(util.valueOrUndef(util.safeToString(data.id)));
        this.code = data.code;
        this.name = data.name;
        this.availableCountries = ko.observableArray(data.availableCountries);

        this.applyValidationRules = function() {
            self.id.extend({
                required: {
                    params: true,
                    message: util.stringFormat(text.message('requiredErrorMessage'), text.message('countryLabel'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([self.id]);
        };

        this.getData = function() {
            var result = {
                id: self.id(),
                code: self.code,
                name: self.name
            };

            return result;
        };

        self.applyValidationRules();
    }

    return Country;
});