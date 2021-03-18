mslc.define('client/models/ko/customer', ['lib/ko', 'client/text'], function(ko, text) {
    'use strict';

    function Customer(data) {
        this.name = ko.observable(data.name);
        this.email = ko.observable(data.email);
        this.phone = ko.observable(data.phone);

        //#region Validation

        this.name.extend({
            required: {
                params: true,
                message: text.message('Validation_Name_Required')
            },
            maxLength: {
                params: 100,
                message: text.message('Validation_Name_InvalidLength')
            }
        });
        
        this.email.extend({
            required: {
                params: true,
                message: text.message('Validation_Email_Required')
            },
            pattern: {
                params: '.*@.*',
                message: text.message('Validation_Email_Invalid')
            },
            maxLength: {
                params: 100,
                message: text.message('Validation_Email_InvalidLength')
            }
        });
        
        this.phone.extend({
            maxLength: {
                params: 20,
                message: text.message('Validation_Phone_InvalidLength')
            }
        });
        
        //#endregion

        return this;
    }

    return Customer;
});