mslc.define('admin/models/ko/email', ['lib/ko', 'admin/config', 'admin/text', 'admin/util'], function(ko, config, text, util) {
    'use strict';

    function Email(data) {
        var self = this;

        this.id = data.id;
        this.emailTypeId = ko.observable(data.emailTypeId);
        this.emailTypes = data.emailTypes;
        this.email = ko.observable(data.email);

        this.new = function() {
            var result = new Email({
                emailTypes: self.emailTypes
            });

            return result;
        };

        this.applyValidationRules = function() {
            self.email.extend({
                email: {
                    message: text.message('invalidEmailErrorMessage')
                },
                maxLength: {
                    params: config.setting('emailMaxLength'),
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('emailLabel'),
                        config.setting('emailMaxLength'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([self.email]);
        };

        this.getData = function() {
            var result = {
                id: self.id,
                emailTypeId: self.emailTypeId(),
                email: self.email(),
            };

            return result;
        };

        self.applyValidationRules();
    }

    return Email;
});