mslc.define('admin/controls/loadingOverlay', ['lib/jQuery'], function($) {
    'use strict';

    function LoadingOverlay() {
        var self = this;

        this.overlay = $('#overlay');

        this.show = function() {
            self.overlay.show();
        };

        this.hide = function() {
            self.overlay.hide();
        };
    }

    return new LoadingOverlay;
});