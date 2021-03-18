mslc.define('admin/models/ko/amenity', ['lib/ko', 'admin/config', 'admin/text', 'admin/util'], function(ko, config, text, util) {
    'use strict';

    function Amenity(data) {
        var self = this;

        this.id = data.id;
        this.classId = data.classId;
        this.name = ko.observable(data.name);

        this.applyValidationRules = function() {
            self.name.extend({
                maxLength: {
                    params: config.setting('amenityNameMaxLength'),
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('amenityLabel'),
                        config.setting('amenityNameMaxLength'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([self.name]);
        };

        self.applyValidationRules();
    }

    return Amenity;
});