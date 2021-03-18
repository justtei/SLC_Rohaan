mslc.define('admin/config', ['lib/jQuery'], function($) {
    'use strict';

    function Config() {

        var settings = [],
            event = 'configUpdate';
        this.setting = setting;
        this.notify = notify;
        this.subscribe = subscribe;

        function setting(key, value) {
            if (value !== undefined) {
                settings[key] = value;
                return true;
            }
            return settings[key];
        }

        function notify() {
            $(document).trigger(event);
        }

        function subscribe(callback) {
            $(document).on(event, callback);
        }

        return this;
    }

    return new Config();
});