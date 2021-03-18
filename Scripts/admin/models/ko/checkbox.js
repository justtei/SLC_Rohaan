mslc.define('admin/models/ko/checkbox', ['lib/ko'], function(ko) {
    'use strict';

    function Checkbox(data) {
        this.isChecked = ko.observable(data.isChecked);
        this.text = data.text;
        this.value = data.value;
    }

    return Checkbox;
});