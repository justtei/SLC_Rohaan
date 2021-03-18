mslc.define('admin/models/ko/contact', ['lib/ko', 'admin/config', 'admin/text', 'admin/util'], function(ko, config, text, util) {
    'use strict';

    function Contact(data) {
        var self = this;

        this.id = data.id;
        this.contactTypeId = ko.observable(data.contactTypeId);
        this.contactTypes = data.contactTypes;
        this.firstName = ko.observable(data.firstName);
        this.lastName = ko.observable(data.lastName);
        
        this.new = function() {
            var result = new Contact({
                contactTypes: self.contactTypes
            });

            return result;
        };

        this.applyValidationRules = function() {
            self.firstName.extend({
                maxLength: {
                    params: config.setting('contactFirstNameMaxLength'),
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('contactFirstNameLabel'),
                        config.setting('contactFirstNameMaxLength'))
                }
            });

            self.lastName.extend({
                maxLength: {
                    params: config.setting('contactLastNameMaxLength'),
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('contactLastNameLabel'),
                        config.setting('contactLastNameMaxLength'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([
                self.firstName,
                self.lastName
            ]);
        };
        
        this.getData = function() {
            var result = {
                id: self.id,
                contactTypeId: self.contactTypeId(),
                firstName: self.firstName(),
                lastName: self.lastName()
            };

            return result;
        };

        self.applyValidationRules();
    }

    return Contact;
});