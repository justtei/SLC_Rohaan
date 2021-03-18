mslc.define('admin/editors/serviceProviderEditor', [
        'lib/ko',
        'lib/moment',
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
        'admin/controls/images',
        'admin/controls/callTrackingPhone'
],
    function(ko, moment, config, text, util, ajax, models, notification, loadingOverlay, Address, AddressValidation, Phones, Emails, Images, CallTrackingPhone) {
        'use strict';

        function ServiceProviderEditor(data, submitUrl) {
            var self = this;

            this.id = data.id;
            this.marchexAccountId = data.marchexAccountId;
            this.package = ko.observable(util.valueOrUndef(data.package));
            this.packages = data.packages;
            this.bookId = ko.observable(util.valueOrUndef(data.bookId));
            this.books = data.books;
            this.serviceCategories = ko.observableArray(util.map(data.serviceCategories, models.ko.Checkbox));
            this.allCounties = data.allCounties;
            this.countiesServed = data.countiesServed;
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
            this.featureStartDate = ko.observable(data.featureStartDate || null);
            this.featureEndDate = ko.observable(data.featureEndDate || null);
            this.publishStartDate = ko.observable(data.publishStartDate || null);
            this.publishEndDate = ko.observable(data.publishEndDate || null);
            this.coupon = new models.ko.Coupon(data.coupon);
            this.paymentTypes = util.map(data.paymentTypes, models.ko.Checkbox);
            this.images = new Images(data.images, config.setting('serviceProviderImagesMaxLength'));
            this.provisionCallTrackingNumbers = ko.observable();
            this.callTrackingPhones = ko.observableArray(util.map(data.callTrackingPhones, CallTrackingPhone));
            this.actualCallTrackingPhones = data.callTrackingPhones;

            this.addressChanged = ko.computed(function() {
                self.address.streetAddress();
                self.address.country.id();
                self.address.state.id();
                self.address.city.id();
                self.address.postalCode();

                self.addressValidation.validationItems.removeAll();
            });

            this.isPublished = ko.computed(function() {
                var start = util.moment(self.publishStartDate());
                var end = util.moment(self.publishEndDate());
                var today = moment();

                var result = !util.isNullOrUndef(self.publishStartDate()) && !util.isNullOrUndef(self.publishEndDate())
                    && !start.isAfter(today, 'days') && !today.isAfter(end);

                return result;
            });

            this.callTrackingWarning = ko.computed(function() {
                var result = null;

                if (!self.isPublished()) {
                    result = text.message('unpublishedCallTracking');
                }

                return result;
            });

            self.provisionCallTrackingNumbers.subscribe(function(newValue) {
                util.foreach(self.callTrackingPhones(), function(phone) {
                    if (newValue) {
                        phone.applyValidationRules();
                    } else {
                        phone.removeValidationRules();
                    }
                });
            });

            this.addContact = function() {
                self.contacts.push(new models.ko.Contact({
                    contactTypes: self.contacts()[0].contactTypes
                }));
            };

            this.deleteContact = function(contact) {
                self.contacts.remove(contact);
            };

            this.addOfficeHours = function() {
                var officeHours = self.officeHours()[0];

                self.officeHours.push(new models.ko.OfficeHours({
                    startDays: officeHours.startDays,
                    endDays: officeHours.endDays
                }));
            };

            this.deleteOfficeHours = function(officeHours) {
                self.officeHours.remove(officeHours);
            };

            this.addCallTrackingPhone = function() {
                self.callTrackingPhones.push(self.callTrackingPhones()[0].new());
            };

            this.deleteCallTrackingPhone = function(phone) {
                self.callTrackingPhones.remove(phone);
            };

            this.disconnectCallTrackingPhone = function(phone) {
                phone.isDisconnected(true);
            };

            this.resumeCallTrackingPhone = function(phone) {
                phone.isDisconnected(false);
            };

            this.applyValidationRules = function() {
                self.provisionCallTrackingNumbers(data.provisionCallTrackingNumbers);

                self.package.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('packageTypeLabel'))
                    }
                });

                self.bookId.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('bookLabel'))
                    }
                });

                self.serviceCategories.extend({
                    requiredCheckboxList: {
                        message: util.stringFormat(text.message('requiredCheckboxListErrorMessage'), text.message('serviceCategoriesLabel'))
                    }
                });

                self.name.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('nameLabel'))
                    },
                    maxLength: {
                        params: config.setting('serviceProviderNameMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('nameLabel'),
                            config.setting('serviceProviderNameMaxLength'))
                    }
                });

                self.websiteUrl.extend({
                    url: {
                        message: util.stringFormat(text.message('invalidUrlErrorMessage'), text.message('websiteAddressLabel'))
                    },
                    maxLength: {
                        params: config.setting('serviceProviderWebsiteUrlMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('websiteAddressLabel'),
                            config.setting('serviceProviderWebsiteUrlMaxLength'))
                    }
                });

                self.featureStartDate.extend({
                    dateRange: {
                        params: self.featureEndDate,
                        message: util.stringFormat(text.message('dateRangeErrorMessage'),
                            text.message('featureStartDateLabel'),
                            text.message('featureEndDateLabel'))
                    }
                });

                self.publishStartDate.extend({
                    dateRange: {
                        params: self.publishEndDate,
                        message: util.stringFormat(text.message('dateRangeErrorMessage'),
                            text.message('publishStartDateLabel'),
                            text.message('publishEndDateLabel'))
                    }
                });

                self.callTrackingPhones.extend({
                    callTrackingPhones: {
                        onlyIf: function() {
                            return self.provisionCallTrackingNumbers();
                        },
                        message: text.message('callTrackingListErrorMessage')
                    }
                });
            };

            this.getData = function() {
                var callTrackingPhones = self.isPublished() && self.provisionCallTrackingNumbers()
                    ? util.getArrayData(self.callTrackingPhones())
                    : self.actualCallTrackingPhones;

                callTrackingPhones = util.filter(callTrackingPhones, function(phone) {
                    return !util.isNullOrUndef(phone.phone);
                });

                var result = {
                    id: self.id,
                    marchexAccountId: self.marchexAccountId,
                    'package': self.package(),
                    bookId: self.bookId(),
                    serviceCategories: self.serviceCategories(),
                    allCounties: self.allCounties,
                    countiesServed: self.countiesServed,
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
                    featureStartDate: self.featureStartDate(),
                    featureEndDate: self.featureEndDate(),
                    publishStartDate: self.publishStartDate(),
                    publishEndDate: self.publishEndDate(),
                    coupon: self.coupon.getData(),
                    paymentTypes: self.paymentTypes,
                    images: self.images.getData(),
                    provisionCallTrackingNumbers: self.provisionCallTrackingNumbers(),
                    callTrackingPhones: callTrackingPhones
                };

                return result;
            };

            this.submit = function() {
                if (self.isValid()) {
                    loadingOverlay.show();

                    ajax.post(submitUrl, self.getData(), function(response) {
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
                    }, function() {
                        notification.showAjaxServerErrorMessage();
                        loadingOverlay.hide();
                    });
                } else {
                    self.errors.showAllMessages();
                }
            };

            this.updateCountiesServed = function (countiesServed) {
                this.countiesServed = countiesServed;
            }

            self.applyValidationRules();

            //inject rcl components
            $(document).ready(function () {

                $('#countiesServed').each(function () {
                    ReactDOM.render(
                        React.createElement(NPMGCommonLibrary.SelectSearch, {
                            canSelectMulti: true,
                            initValues: data.countiesServed.map(selectMapper),
                            onChange: function (selectedOptions) {
                                let selectedCounties = [];

                                if (Array.isArray(selectedOptions)) {
                                    selectedCounties = selectedOptions.map(function (option) {
                                        return {
                                            id: option.value,
                                            name: option.label
                                        }
                                    });
                                }

                                self.updateCountiesServed(selectedCounties);
                            },
                            options: data.allCounties.map(selectMapper),
                        }),
                        $(this)[0]
                    );
                });

            });
            function selectMapper(county) {
                return {
                    value: county.id,
                    label: county.name
                }
            }
        }

        return {
            init: function(data, submitUrl) {
                var model = ko.validatedObservable(new ServiceProviderEditor(data, submitUrl));
                ko.applyBindings(model);
            }
        };
    });