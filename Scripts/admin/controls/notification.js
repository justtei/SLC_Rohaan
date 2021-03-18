mslc.define('admin/controls/notification', ['admin/text'], function(text) {
    'use strict';

    function Notification() {
        var self = this;

        this.ajaxServerErrorMessage = text.message('ajaxServerErrorMessage');
        this.notValidServerModelErrorMessage = text.message('notValidServerModelErrorMessage');

        this.showMessage = function(message) {
            alert(message);
        };

        this.showAjaxServerErrorMessage = function() {
            self.showMessage(self.ajaxServerErrorMessage);
        };

        this.showNotValidServerModelErrorMessage = function(errors) {
            self.showMessage(self.notValidServerModelErrorMessage + errors);
        };
    }

    return new Notification();
});