mslc.define('admin/editors/categoryEditor', [
        'lib/ko',
        'admin/util/ajax',
        'admin/controls/notification',
        'admin/controls/loadingOverlay',
        'admin/controls/additionalInfoTypes'
],
    function(ko, ajax, notification, loadingOverlay, AdditionalInfoTypes) {
        'use strict';

        function CategoryEditor(data, categoriesCaption, getCategoryTypesUrl, submitUrl) {
            var self = this;

            this.categories = data;
            this.categoriesCaption = categoriesCaption;
            this.additionalInfoTypes = new AdditionalInfoTypes({}, getCategoryTypesUrl);

            this.getData = function() {
                var result = self.additionalInfoTypes.getData();
                return result;
            };

            this.submit = function() {
                loadingOverlay.show();

                ajax.post(submitUrl, self.getData(), function(response) {
                    if (response.success) {
                        window.location = response.url;
                    } else {
                        notification.showNotValidServerModelErrorMessage(response.errors);
                        loadingOverlay.hide();
                    }
                }, function() {
                    notification.showAjaxServerErrorMessage();
                    loadingOverlay.hide();
                });
            };
        }

        return {
            init: function(data, categoriesCaption, getCategoryTypesUrl, submitUrl) {
                var model = new CategoryEditor(data, categoriesCaption, getCategoryTypesUrl, submitUrl);
                ko.applyBindings(model);
            }
        };
    });