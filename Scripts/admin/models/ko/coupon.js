mslc.define('admin/models/ko/coupon', ['lib/ko', 'admin/config', 'admin/text', 'admin/util'], function(ko, config, text, util) {
    'use strict';

    function Coupon(data) {
        var self = this;

        this.id = data.id;
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.descriptionLength = config.setting('couponDescriptionMaxLength');
        this.publishDate = ko.observable(data.publishDate || null);
        this.expirationDate = ko.observable(data.expirationDate || null);

        this.descriptionCharacterCounter = ko.computed(function() {
            var length = self.description() != null
                ? self.description().length
                : 0;

            return length + ' / ' + self.descriptionLength;
        });

        this.applyValidationRules = function() {
            self.name.extend({
                required: {
                    onlyIf: function() {
                        return self.description() || self.publishDate() || self.expirationDate();
                    },
                    message: util.stringFormat(text.message('requiredErrorMessage'), text.message('couponLabel'))
                },
                maxLength: {
                    params: config.setting('couponNameMaxLength'),
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('couponLabel'),
                        config.setting('couponNameMaxLength'))
                }
            });

            self.description.extend({
                maxLength: {
                    params: self.descriptionLength,
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('couponDescriptionLabel'),
                        self.descriptionLength)
                }
            });

            self.publishDate.extend({
                dateRange: {
                    params: self.expirationDate,
                    message: util.stringFormat(text.message('dateRangeErrorMessage'),
                        text.message('couponPublishDateLabel'),
                        text.message('couponExpirationDateLabel'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([
                self.name,
                self.description,
                self.publishDate
            ]);
        };

        this.getData = function() {
            var result = {
                id: self.id,
                name: self.name(),
                description: self.description(),
                publishDate: self.publishDate(),
                expirationDate: self.expirationDate()
            };

            return result;
        };

        self.applyValidationRules();
    }

    return Coupon;
});