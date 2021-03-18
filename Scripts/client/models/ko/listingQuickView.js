mslc.define('client/models/ko/listingQuickView',
    [
        'lib/ko'
        , 'client/controls/leadForm'
    ],
    function(ko, LeadForm) {
    'use strict';
    
    function ListingQuickView(data) {

        data.leadForm = new LeadForm(data.leadForm);

        return data;
    }

    return ListingQuickView;
})