mslc.define('client/extends/events', ['lib/jQuery', 'client/util'], function($, u) {
    'use strict';

    return {
        extend: function() {

            var timer;
            $(window).resize(function(e) {
                if (timer != null) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function() {
                    u.trigger(window, "responseResize", e);
                });
            });
        }
    };
});