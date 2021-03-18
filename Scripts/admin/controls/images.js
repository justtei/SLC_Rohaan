mslc.define('admin/controls/images', ['lib/ko', 'admin/text', 'admin/util', 'admin/models'], function(ko, text, util, models) {
    'use strict';

    function Images(data, maxLength) {
        var self = this;

        this.images = ko.observableArray(util.map(data.images, models.ko.Image));
        this.displayName = data.displayName;
        this.maxReachedMessage = util.stringFormat(text.message('reachedMaximumLengthErrorMessage'), self.displayName);

        this.isAddDisabled = ko.computed(function() {
            var result = self.images().length >= maxLength;
            return result;
        });

        this.isMaxReached = ko.computed(function() {
            var result = self.images().length === maxLength;
            return result;
        });

        this.deleteImage = function(image) {
            self.images.remove(image);
        };

        this.applyValidationRules = function() {
            self.images.extend({
                arrayMax: {
                    params: maxLength,
                    message: util.stringFormat(text.message('maxCollectionLengthErrorMessage'), self.displayName, maxLength)
                }
            });
        };

        this.removeValidationRules = function() {
            self.images.rules.removeAll();
        };

        this.getData = function() {
            var result = {
                images: util.getArrayData(self.images())
            };

            return result;
        };

        self.applyValidationRules();
    }

    return Images;
});