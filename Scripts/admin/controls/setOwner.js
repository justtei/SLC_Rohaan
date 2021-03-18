mslc.define('admin/controls/setOwner', ['lib/ko', 'admin/util', 'admin/controls/owner'], function(ko, util, Owner) {
    'use strict';

    function SetOwner(data) {
        var self = this;

        this.id = data.id;
        this.owners = data.owners;
        this.hasNewOwner = ko.observable();
        this.newOwner = new Owner(data.newOwner, self.hasNewOwner);

        self.hasNewOwner.subscribe(function(newValue) {
            if (newValue) {
                self.newOwner.applyValidationRules();
            } else {
                self.newOwner.removeValidationRules();
            }
        });

        this.applyValidationRules = function() {
            self.hasNewOwner(data.hasNewOwner);
        };

        this.getData = function() {
            var result = {
                id: self.id,
                hasNewOwner: self.hasNewOwner(),
                newOwner: self.newOwner.getData(),
            };

            return result;
        };

        self.applyValidationRules();
    }

    return SetOwner;
});