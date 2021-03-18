mslc.define('admin/models/ko/city', ['lib/ko', 'admin/text', 'admin/util'], function(ko, text, util) {
    'use strict';

    function City(data) {
        var self = this;

        this.id = ko.observable(util.valueOrUndef(util.safeToString(data.id)));
        this.name = data.name;
        this.availableCities = ko.observableArray(data.availableCities);

        this.applyValidationRules = function() {
            self.id.extend({
                required: {
                    params: true,
                    message: util.stringFormat(text.message('requiredErrorMessage'), text.message('cityLabel'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([self.id]);
        };

        this.getData = function() {
            var result = {
                id: self.id(),
                name: self.name
            };

            return result;
        };

        self.applyValidationRules();
    }

    return City;
});