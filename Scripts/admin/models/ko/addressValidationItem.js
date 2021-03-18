mslc.define('admin/models/ko/addressValidationItem', ['lib/ko'], function(ko) {
    'use strict';

    function AddressValidationItem(data) {
        this.id = data.id;
        this.addressLine1 = ko.observable(data.addressLine1);
        this.addressLine2 = data.addressLine2;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.cityId = data.cityId;
        this.stateId = data.stateId;
        this.countryId = data.countryId;
        this.postalCode = data.postalCode;
    }

    return AddressValidationItem;
});