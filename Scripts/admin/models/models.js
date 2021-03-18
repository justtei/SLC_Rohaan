mslc.define('admin/models', [
        'admin/models/js/location',
        'admin/models/ko/addressValidationItem',
        'admin/models/ko/amenity',
        'admin/models/ko/checkbox',
        'admin/models/ko/city',
        'admin/models/ko/communityService',
        'admin/models/ko/contact',
        'admin/models/ko/country',
        'admin/models/ko/coupon',
        'admin/models/ko/email',
        'admin/models/ko/image',
        'admin/models/ko/keyValuePair',
        'admin/models/ko/measureBoundary',
        'admin/models/ko/officeHours',
        'admin/models/ko/phone',
        'admin/models/ko/phoneNumber',
        'admin/models/ko/seoMetadata',
        'admin/models/ko/state'
    ],
    function(location, addressValidationItem, amenity, checkbox, city, communityService, contact, country, coupon,
        email, image, keyValuePair, measureBoundary, officeHours, phone, phoneNumber, seoMetadata, state) {
        'use strict';

        return {
            js: {
                Location: location
            },
            ko: {
                AddressValidationItem: addressValidationItem,
                Amenity: amenity,
                Checkbox: checkbox,
                City: city,
                CommunityService: communityService,
                Contact: contact,
                Country: country,
                Coupon: coupon,
                Email: email,
                Image: image,
                KeyValuePair: keyValuePair,
                MeasureBoundary: measureBoundary,
                OfficeHours: officeHours,
                Phone: phone,
                PhoneNumber: phoneNumber,
                SeoMetadata: seoMetadata,
                State: state
            }
        };
    });