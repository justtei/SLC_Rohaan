mslc.define('client/models/ko/option', ['lib/ko'], function(ko) {
    'use strict';
    
    function Option(data) {

        data.selected = ko.observable(!!data.selected);

        return data;
    }

    return Option;
})