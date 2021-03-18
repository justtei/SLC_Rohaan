mslc.define('admin/models/ko/communityService', ['lib/ko', 'admin/config', 'admin/text', 'admin/util'], function(ko, config, text, util) {
    'use strict';

    function CommunityService(data) {
        var self = this;

        this.additionInfoTypeId = data.additionInfoTypeId;
        this.name = ko.observable(data.name);

        this.applyValidationRules = function() {
            self.name.extend({
                maxLength: {
                    params: config.setting('communityServiceNameMaxLength'),
                    message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                        text.message('communityServiceLabel'),
                        config.setting('communityServiceNameMaxLength'))
                }
            });
        };

        self.applyValidationRules();
    }

    return CommunityService;
});