mslc.define('client/models/ko/lead',
    [
        'lib/ko'
        , 'client/text'
        , 'client/models/ko/customer'
    ], function(ko, text, Customer) {
    'use strict';

    function Lead(data) {
        var self = this;

        function update(newData) {
            self.moveInDate(newData.moveInDate);
            self.customer(new Customer(newData.customer));
            self.lookingFor(newData.lookingFor);
            self.message(newData.message);

            self.listingId = newData.listingId;
            self.communityUnitId = newData.communityUnitId;
            self.inquiry = newData.inquiry;
            self.bookNumber = newData.bookNumber;
            self.brand = newData.brand;
        }
        
        //#region Interface

        this.moveInDate = ko.observable();
        this.customer = ko.observable();
        this.lookingFor = ko.observable();
        this.message = ko.observable();

        this.listingId = null;
        this.communityUnitId = null;
        this.inquiry = null;
        this.bookNumber = null;
        this.brand = null;

        this.update = update;

        //#endregion

        //#region Constructor

        function initValidation() {
            self.message.extend({
                maxLength: {
                    params: 800,
                    message: text.message('Validation_Message_InvalidLength')
                }
            });

            self.moveInDate.extend({
                date: {
                    params: true,
                    message: text.message('Validation_MoveInDate_InvalidDate')
                }
            });
        }

        function init() {
            update(data);

            initValidation();
        };

        init();

        return this;
    }

    return Lead;
});