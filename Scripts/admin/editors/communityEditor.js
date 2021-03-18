mslc.define('admin/editors/communityEditor', [
    'lib/ko',
    'admin/config',
    'admin/text',
    'admin/util',
    'admin/util/ajax',
    'admin/models',
    'admin/controls/notification',
    'admin/controls/loadingOverlay',
    'admin/controls/address',
    'admin/controls/addressValidation',
    'admin/controls/phones',
    'admin/controls/emails',
    'admin/controls/communityDetails',
    'admin/controls/listingDetails'
],
    function (ko, config, text, util, ajax, models, notification, loadingOverlay, Address, AddressValidation, Phones, Emails,
        CommunityDetails, ListingDetails) {
        'use strict';

        function CommunityEditor(data, submitUrl) {
            var self = this;

            this.id = data.id;
            this.marchexAccountId = data.marchexAccountId;
            this.bookId = ko.observable(util.valueOrUndef(data.bookId));
            this.books = data.books;
            this.package = ko.observable(util.valueOrUndef(data.package));
            this.packages = data.packages;
            this.listingTypes = ko.observableArray(util.map(data.listingTypes, models.ko.Checkbox));
            this.seniorHousingAndCareCategories = ko.observableArray(util.map(data.seniorHousingAndCareCategories, models.ko.Checkbox));
            this.ageRestrictions = util.map(data.ageRestrictions, models.ko.Checkbox);
            this.name = ko.observable(data.name);
            this.address = new Address(data.address);
            this.doNotDisplayAddress = ko.observable(data.doNotDisplayAddress);
            this.addressValidation = new AddressValidation();
            this.phoneList = new Phones(data.phoneList);
            this.emailList = new Emails(data.emailList);
            this.contacts = ko.observableArray(util.map(data.contacts, models.ko.Contact));
            this.officeHours = ko.observableArray(util.map(data.officeHours, models.ko.OfficeHours));
            this.description = ko.observable(data.description);
            this.websiteUrl = ko.observable(data.websiteUrl);
            this.displayWebsiteUrl = ko.observable(data.displayWebsiteUrl);
            this.communityDetails = new CommunityDetails(data.communityDetails);
            this.listingDetails = new ListingDetails(data.listingDetails);
            this.publishStart = ko.observable(data.publishStart || null);
            this.publishEnd = ko.observable(data.publishEnd || null);
            this.showcaseStart = ko.observable(data.showcaseStart || null);
            this.showcaseEnd = ko.observable(data.showcaseEnd || null);

            this.addressChanged = ko.computed(function () {
                self.address.streetAddress();
                self.address.country.id();
                self.address.state.id();
                self.address.city.id();
                self.address.postalCode();

                self.addressValidation.validationItems.removeAll();
            });

            this.isPublished = ko.computed(function () {
                var start = util.moment(self.publishStart());
                var end = util.moment(self.publishEnd());
                var today = moment();

                var result = !util.isNullOrUndef(self.publishStart()) && !util.isNullOrUndef(self.publishEnd())
                    && !start.isAfter(today, 'days') && !today.isAfter(end);

                return result;
            });

            this.callTrackingWarning = ko.computed(function () {
                var result = null;

                if (!self.isPublished()) {
                    result = text.message('unpublishedCallTracking');
                }

                return result;
            });

            self.isPublished.subscribe(function (newValue) {
                self.listingDetails.isDisabledCallTrackingEditing(!newValue);
            });

            this.addContact = function () {
                self.contacts.push(new models.ko.Contact({
                    contactTypes: self.contacts()[0].contactTypes
                }));
            };

            this.deleteContact = function (contact) {
                self.contacts.remove(contact);
            };

            this.addOfficeHours = function () {
                var officeHours = self.officeHours()[0];

                self.officeHours.push(new models.ko.OfficeHours({
                    startDays: officeHours.startDays,
                    endDays: officeHours.endDays
                }));
            };

            this.deleteOfficeHours = function (officeHours) {
                self.officeHours.remove(officeHours);
            };

            this.applyValidationRules = function () {
                self.listingDetails.isDisabledCallTrackingEditing(!self.isPublished());

                self.bookId.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('bookLabel'))
                    }
                });

                self.package.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('packageTypeLabel'))
                    }
                });

                self.listingTypes.extend({
                    requiredCheckboxList: {
                        message: util.stringFormat(text.message('requiredCheckboxListErrorMessage'), text.message('listingTypesLabel'))
                    }
                });

                self.seniorHousingAndCareCategories.extend({
                    requiredCheckboxList: {
                        onlyIf: function () {
                            return self.listingTypes()[2].isChecked();
                        },
                        message: util.stringFormat(text.message('requiredCheckboxListErrorMessage'), text.message('shcCategoriesLabel'))
                    }
                });

                self.name.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('nameLabel'))
                    },
                    maxLength: {
                        params: config.setting('communityNameMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('nameLabel'),
                            config.setting('communityNameMaxLength'))
                    }
                });

                self.websiteUrl.extend({
                    url: {
                        message: util.stringFormat(text.message('invalidUrlErrorMessage'), text.message('websiteAddressLabel'))
                    },
                    maxLength: {
                        params: config.setting('communityWebsiteUrlMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('websiteAddressLabel'),
                            config.setting('communityWebsiteUrlMaxLength'))
                    }
                });

                self.publishStart.extend({
                    dateRange: {
                        params: self.publishEnd,
                        message: util.stringFormat(text.message('dateRangeErrorMessage'),
                            text.message('publishStartDateLabel'),
                            text.message('publishEndDateLabel'))
                    }
                });

                self.showcaseStart.extend({
                    dateRange: {
                        params: self.showcaseEnd,
                        message: util.stringFormat(text.message('dateRangeErrorMessage'),
                            text.message('showcaseStartLabel'),
                            text.message('showcaseEndLabel'))
                    }
                });
            };

            this.getData = function () {
                var result ={
                    id: self.id,
                    marchexAccountId: self.marchexAccountId,
                    bookId: self.bookId(),
                    'package': self.package(),
                    listingTypes: self.listingTypes(),
                    seniorHousingAndCareCategories: self.seniorHousingAndCareCategories(),
                    ageRestrictions: self.ageRestrictions,
                    name: self.name(),
                    address: self.address.getData(),
                    doNotDisplayAddress: self.doNotDisplayAddress(),
                    addressValidation: self.addressValidation.getData(),
                    phoneList: self.phoneList.getData(),
                    emailList: self.emailList.getData(),
                    contacts: util.getArrayData(self.contacts()),
                    officeHours: util.getArrayData(self.officeHours()),
                    description: self.description(),
                    websiteUrl: self.websiteUrl(),
                    displayWebsiteUrl: self.displayWebsiteUrl(),
                    communityDetails: self.communityDetails.getData(),
                    listingDetails: self.listingDetails.getData(),
                    publishStart: self.publishStart(),
                    publishEnd: self.publishEnd(),
                    showcaseStart: self.showcaseStart(),
                    showcaseEnd: self.showcaseEnd(),
                    AssignedTo: document.getElementById('AssignedTo').value
                };

                return result;
            };

            this.submit = function () {
                if (document.getElementById('IsAdmin').value == "true") {
                    if (self.name() != "" && self.bookId() != "" && self.package() != "" && document.getElementById('AssignedTo').value != "") {
                        ajax.post(submitUrl, self.getData(), function (response) {
                            if (response.success) {
                                window.location = response.url;
                            }
                            else {
                                if (response.addressValidation) {
                                    self.addressValidation.init(response.addressValidation);
                                }
                                else if (response.callTrackingErrorMessage) {
                                    notification.showMessage(response.callTrackingErrorMessage);
                                }
                                else {
                                    self.addressValidation.clear();
                                    notification.showNotValidServerModelErrorMessage(response.errors);
                                }
                                loadingOverlay.hide();
                            }
                        }, function () {
                            notification.showAjaxServerErrorMessage();
                            loadingOverlay.hide();
                        });
                        return;
                    }
                    else {
                        alert('Please Fill All Mandatory Fields');
                        return;
                    }
                }
                if (self.isValid()) {
                    loadingOverlay.show();

                    ajax.post(submitUrl, self.getData(), function (response) {
                        if (response.success) {
                            window.location = response.url;
                        } else {
                            if (response.addressValidation) {
                                self.addressValidation.init(response.addressValidation);
                            } else if (response.callTrackingErrorMessage) {
                                notification.showMessage(response.callTrackingErrorMessage);
                            } else {
                                self.addressValidation.clear();
                                notification.showNotValidServerModelErrorMessage(response.errors);
                            }

                            loadingOverlay.hide();
                        }
                    }, function () {
                        notification.showAjaxServerErrorMessage();
                        loadingOverlay.hide();
                    });
                } else {
                    self.errors.showAllMessages();
                }
            };

            self.applyValidationRules();
        }

        return {
            init: function (data, submitUrl) {
                var model = ko.validatedObservable(new CommunityEditor(data, submitUrl));

                ko.applyBindings(model);
            }
        };
    });