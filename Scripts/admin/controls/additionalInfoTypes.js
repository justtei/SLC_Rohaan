mslc.define('admin/controls/additionalInfoTypes', [
        'lib/ko',
        'admin/util',
        'admin/util/ajax',
        'admin/models',
        'admin/controls/notification',
        'admin/controls/loadingOverlay'
    ],
    function(ko, util, ajax, models, notification, loadingOverlay) {
        'use strict';

        function AdditionalInfoTypes(data, getCategoryTypesUrl) {
            var self = this;

            this.categoryClass = ko.observable(data.categoryClass);
            this.types = ko.observableArray(util.map(data.types, models.ko.KeyValuePair));
            this.isInUpdateProgress = ko.observable(false);

            self.categoryClass.subscribe(function(newClass) {
                if (newClass) {
                    self.isInUpdateProgress(true);
                    loadingOverlay.show();

                    ajax.get(getCategoryTypesUrl, {categoryClass: newClass}, function(types) {
                        self.types(util.map(types.types, models.ko.KeyValuePair));
                        self.isInUpdateProgress(false);
                    }, notification.showAjaxServerErrorMessage, loadingOverlay.hide);
                } else {
                    self.types.removeAll();
                }
            });

            this.addType = function() {
                self.types.push(new models.ko.KeyValuePair({}));
            };

            this.deleteType = function(type) {
                self.types.remove(type);
            };

            this.getData = function() {
                var result = {
                    categoryClass: self.categoryClass(),
                    types: util.filter(self.types(), function(amenity) {
                        return !util.isNullOrEmpty(amenity.value());
                    }),
                };

                return result;
            };
        }

        return AdditionalInfoTypes;
    });