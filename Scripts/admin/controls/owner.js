mslc.define('admin/controls/owner', [
        'lib/ko',
        'admin/config',
        'admin/text',
        'admin/util',
        'admin/models',
        'admin/controls/address',
        'admin/controls/phones',
        'admin/controls/emails',
        'admin/controls/images'
],
    function(ko, config, text, util, models, Address, Phones, Emails, Images) {
        'use strict';

        function Owner(data) {
            var self = this;

            this.id = data.id;
            this.name = ko.observable(data.name);
            this.ownerType = data.ownerType;
            this.address = new Address(data.address);
            this.phoneList = new Phones(data.phoneList);
            this.emailList = new Emails(data.emailList);
            this.contacts = ko.observableArray(util.map(data.contacts, models.ko.Contact));
            this.websiteUrl = ko.observable(data.websiteUrl);
            this.displayWebsiteUrl = ko.observable(data.displayWebsiteUrl);
            this.displayName = ko.observable(data.displayName);
            this.displayAddress = ko.observable(data.displayAddress);
            this.displayPhone = ko.observable(data.displayPhone);
            this.displayLogo = ko.observable(data.displayLogo);
            this.logoImages = new Images(data.logoImages, config.setting('logoImagesMaxLength'));

            this.addContact = function() {
                self.contacts.push(self.contacts()[0].new());
            };

            this.deleteContact = function(contact) {
                self.contacts.remove(contact);
            };

            this.applyValidationRules = function() {
                self.name.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('nameLabel'))
                    },
                    maxLength: {
                        params: config.setting('ownerNameMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('nameLabel'),
                            config.setting('ownerNameMaxLength'))
                    }
                });

                self.websiteUrl.extend({
                    url: {
                        message: util.stringFormat(text.message('invalidUrlErrorMessage'), text.message('websiteAddressLabel'))
                    },
                    maxLength: {
                        params: config.setting('ownerWebsiteUrlMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('websiteAddressLabel'),
                            config.setting('ownerWebsiteUrlMaxLength'))
                    }
                });

                util.applyValidationRules([
                    self.address,
                    self.phoneList,
                    self.emailList,
                    self.contacts,
                    self.logoImages
                ]);
            };

            this.removeValidationRules = function() {
                util.removeValidationRules([
                    self.name,
                    self.address,
                    self.phoneList,
                    self.emailList,
                    self.contacts,
                    self.websiteUrl,
                    self.logoImages
                ]);
            };

            this.getData = function() {
                var result = {
                    id: self.id,
                    name: self.name(),
                    ownerType: self.ownerType,
                    address: self.address.getData(),
                    phoneList: self.phoneList.getData(),
                    emailList: self.emailList.getData(),
                    contacts: util.getArrayData(self.contacts()),
                    websiteUrl: self.websiteUrl(),
                    displayWebsiteUrl: self.displayWebsiteUrl(),
                    displayName: self.displayName(),
                    displayAddress: self.displayAddress(),
                    displayPhone: self.displayPhone(),
                    displayLogo: self.displayLogo(),
                    logoImages: self.logoImages.getData()
                };

                return result;
            };

            self.applyValidationRules();
        }

        return Owner;
    });