mslc.define('admin/controls/emails', ['lib/ko', 'admin/text', 'admin/config', 'admin/util', 'admin/models'],
    function(ko, text, config, util, models) {
        'use strict';

        function Emails(data) {
            var self = this;

            this.defaultEmailId = data.defaultEmailId;
            this.defaultEmailTypeId = data.defaultEmailTypeId;
            this.defaultEmailTypeName = data.defaultEmailTypeName;
            this.defaultEmail = ko.observable(data.defaultEmail);
            this.additionalEmails = ko.observableArray(util.map(data.additionalEmails, models.ko.Email));

            this.addEmail = function() {
                self.additionalEmails.push(self.additionalEmails()[0].new());
            };

            this.deleteEmail = function(email) {
                self.additionalEmails.remove(email);
            };

            this.applyValidationRules = function() {
                self.defaultEmail.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('emailLabel'))
                    },
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

                util.applyValidationRules([self.additionalEmails]);
            };

            this.removeValidationRules = function() {
                util.removeValidationRules([
                    self.defaultEmail,
                    self.additionalEmails
                ]);
            };

            this.getData = function() {
                var result = {
                    defaultEmailId: self.defaultEmailId,
                    defaultEmailTypeId: self.defaultEmailTypeId,
                    defaultEmailTypeName: self.defaultEmailTypeName,
                    defaultEmail: self.defaultEmail(),
                    additionalEmails: util.getArrayData(self.additionalEmails())
                };

                return result;
            };

            self.applyValidationRules();
        }

        return Emails;
    });