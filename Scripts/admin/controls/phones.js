mslc.define('admin/controls/phones', ['lib/ko', 'admin/text', 'admin/config', 'admin/util', 'admin/models'],
    function(ko, text, config, util, models) {
        'use strict';

        function Phones(data) {
            var self = this;

            this.defaultPhoneId = data.defaultPhoneId;
            this.defaultPhoneTypeId = data.defaultPhoneTypeId;
            this.defaultPhoneTypeName = data.defaultPhoneTypeName;
            this.defaultPhoneNumber = ko.observable(data.defaultPhoneNumber);
            this.additionalPhones = ko.observableArray(util.map(data.additionalPhones, models.ko.Phone));

            this.addPhone = function() {
                self.additionalPhones.push(self.additionalPhones()[0].new());
            };

            this.deletePhone = function(phone) {
                self.additionalPhones.remove(phone);
            };

            this.applyValidationRules = function() {
                self.defaultPhoneNumber.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('phoneLabel'))
                    },
                    maxLength: {
                        params: config.setting('phoneNumberMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('phoneLabel'),
                            config.setting('phoneNumberMaxLength'))
                    }
                });

                util.applyValidationRules([self.additionalPhones]);
            };

            this.removeValidationRules = function() {
                util.removeValidationRules([
                    self.defaultPhoneNumber,
                    self.additionalPhones
                ]);
            };

            this.getData = function() {
                var result = {
                    defaultPhoneId: self.defaultPhoneId,
                    defaultPhoneTypeId: self.defaultPhoneTypeId,
                    defaultPhoneTypeName: self.defaultPhoneTypeName,
                    defaultPhoneNumber: self.defaultPhoneNumber(),
                    additionalPhones: util.getArrayData(self.additionalPhones())
                };

                return result;
            };

            self.applyValidationRules();
        }

        return Phones;
    });