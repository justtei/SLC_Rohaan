mslc.define('admin/models/ko/keyValuePair', ['lib/ko'], function(ko) {
    'use strict';

    function KeyValuePair(data) {
        this.key = data.key;
        this.value = ko.observable(data.value);
    }

    return KeyValuePair;
});