mslc.define('admin/models/ko/state', ['lib/ko', 'admin/text', 'admin/util'], function(ko, text, util) {
    'use strict';

    function State(data) {
        var self = this;

        this.id = ko.observable(util.valueOrUndef(util.safeToString(data.id)));
        this.code = data.code;
        this.name = data.name;
        this.availableStates = ko.observableArray(data.availableStates);

        this.applyValidationRules = function() {
            self.id.extend({
                required: {
                    params: true,
                    message: util.stringFormat(text.message('requiredErrorMessage'), text.message('stateLabel'))
                }
            });
        };

        this.removeValidationRules = function() {
            util.removeValidationRules([self.id]);
        };

        this.getData = function() {
            var result = {
                id: self.id(),
                code: self.code,
                name: self.name
            };

            return result;
        };

        self.applyValidationRules();
    }

    return State;
});