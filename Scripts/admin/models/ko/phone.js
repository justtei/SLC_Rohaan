mslc.define('admin/models/ko/phone', ['lib/ko', 'admin/config', 'admin/text', 'admin/util'], function(ko, config, text, util) {
    'use strict';

    function Phone(data) {
        var self = this;

        this.id = data.id;
        this.phoneTypeId = ko.observable(data.phoneTypeId);
        this.phoneTypes = data.phoneTypes;
        this.number = ko.observable(data.number);

        this.new = function() {
            var result = new Phone({
                phoneTypes: self.phoneTypes
            });

            return result;
        };

        this.applyValidationRules = function() {
            self.number.extend({
                maxLength: {
                    params: config.setting('phoneNumberMaxLength'),
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('phoneLabel'),
                        config.setting('phoneNumberMaxLength'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([self.number]);
        };

        this.getData = function() {
            var result = {
                id: self.id,
                phoneTypeId: self.phoneTypeId(),
                number: self.number()
            };

            return result;
        };

        self.applyValidationRules();
    }

    return Phone;
});