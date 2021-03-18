mslc.define('client/text', [], function() {
    'use strict';

    function Text() {

        var txt = [];
        this.message = message;

        function message(name, value) {
            if (value !== undefined) {
                txt[name] = value;
                return true;
            }
            return txt[name];
        }

        return this;
    }

    return new Text();
});