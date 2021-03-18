mslc.define('admin/controls/callTrackingPhone', ['lib/ko', 'lib/moment', 'admin/config', 'admin/text', 'admin/util', 'admin/models'],
    function(ko, moment, config, text, util, models) {
        'use strict';

        function CallTrackingPhone(data) {
            var self = this;

            this.id = data.id;
            this.campaignId = data.campaignId;
            this.isDisconnected = ko.observable(data.isDisconnected);
            this.disconnectDate = data.disconnectDate;
            this.reconnectDate = data.reconnectDate;
            this.expiresAt = data.expiresAt;
            this.phoneTypes = data.phoneTypes;
            this.phoneType = ko.observable(util.safeToString(data.phoneType));
            this.provisionPhone = ko.observable(data.provisionPhone);
            this.phone = new models.ko.PhoneNumber(data.phone, text.message('targetNumberLabel'));
            this.listingPhone = new models.ko.PhoneNumber(data.listingPhone, text.message('listingNumberLabel'));
            this.oldPhone = data.oldPhone;
            this.isWhisper = ko.observable(data.isWhisper);
            this.isCallReview = ko.observable(data.isCallReview);
            this.startDate = ko.observable(data.startDate || null);
            this.endDate = ko.observable(data.endDate || null);

            this.resumeInfo = ko.computed(function() {
                var result = null;

                if (!util.isNullOrEmpty(self.expiresAt) && self.isDisconnected()) {
                    result = util.stringFormat(text.message('phoneResume'),
                        util.moment(self.expiresAt).from(moment(), true),
                        self.expiresAt);
                }

                return result;
            });

            this.onPhoneChange = ko.computed(function() {
                self.isDisconnected();
                self.phoneType();
                self.provisionPhone();
                self.phone.number();
                self.listingPhone.number();
                self.isWhisper();
                self.isCallReview();
                self.startDate();
                self.endDate();

                self.isChanged = true;
            });

            this.new = function() {
                var result = new CallTrackingPhone({
                    phoneTypes: self.phoneTypes
                });

                return result;
            };

            this.applyValidationRules = function() {
                self.phoneType.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('typeLabel'))
                    }
                });
                
                self.startDate.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('startDateLabel'))
                    },
                    dateRange: {
                        params: self.endDate,
                        message: util.stringFormat(text.message('dateRangeErrorMessage'),
                            text.message('startDateLabel'),
                            text.message('endDateLabel'))
                    }
                });

                self.endDate.extend({
                    required: {
                        params: true,
                        message: util.stringFormat(text.message('requiredErrorMessage'), text.message('endDateLabel'))
                    }
                });
                
                util.applyValidationRules([
                    self.phone,
                    self.listingPhone
                ]);
            };

            this.removeValidationRules = function() {
                util.removeValidationRules([
                    self.phoneType,
                    self.phone,
                    self.listingPhone,
                    self.startDate,
                    self.endDate
                ]);
            };

            this.getData = function() {
                var result = {
                    id: self.id,
                    campaignId: self.campaignId,
                    isDisconnected: self.isDisconnected(),
                    reconnectDate: self.reconnectDate,
                    expiresAt: self.expiresAt,
                    phoneType: self.phoneType(),
                    provisionPhone: self.provisionPhone(),
                    phone: self.phone.getData(),
                    listingPhone: self.listingPhone.getData(),
                    oldPhone: self.oldPhone,
                    isWhisper: self.isWhisper(),
                    isCallReview: self.isCallReview(),
                    isChanged: self.isChanged,
                    startDate: self.startDate(),
                    endDate: self.endDate()
                };

                return result;
            };

            self.applyValidationRules();

            this.isChanged = false;
        }

        return CallTrackingPhone;
    });