mslc.define('admin/editors/ownerEditor',
    [
        'lib/ko',
        'admin/config',
        'admin/util',
        'admin/util/ajax',
        'admin/controls/notification',
        'admin/controls/loadingOverlay',
        'admin/controls/owner'
    ],
    function(ko, config, util, ajax, notification, loadingOverlay, Owner) {
        'use strict';

        function OwnerEditor(data, submitUrl) {
            var self = this;

            this.owner = new Owner(data);

            this.submit = function() {
                if (self.isValid()) {
                    loadingOverlay.show();

                    ajax.post(submitUrl, self.owner.getData(), function(response) {
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
                } else {
                    self.errors.showAllMessages();
                }
            };
        }

        return {
            init: function(data, submitUrl) {
                var model = ko.validatedObservable(new OwnerEditor(data, submitUrl));
                ko.applyBindings(model);
            }
        };
    });