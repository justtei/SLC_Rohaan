mslc.define('admin/models/ko/phoneNumber', ['lib/ko', 'admin/config', 'admin/text', 'admin/util'], function(ko, config, text, util) {
    'use strict';

    function PhoneNumber(data, label) {
        var self = this;

        this.part1 = ko.observable(util.safeSlice(data, 0, 3));
        this.part2 = ko.observable(util.safeSlice(data, 3, 6));
        this.part3 = ko.observable(util.safeSlice(data, 6, 10));

        this.number = ko.computed(function() {
            var result = self.part1() + self.part2() + self.part3();
            return result;
        });

        this.applyValidationRules = function() {
            self.number.extend({
                pattern: {
                    params: '^[0-9]{10}$',
                    message: util.stringFormat(text.message('phoneNumberFormatErrorMessage'), label)
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([self.number]);
        };

        this.getData = function() {
            var result = self.number();
            return result;
        };

        self.applyValidationRules();
    }

    return PhoneNumber;
});