mslc.define('admin/editors/callTrackingPhonesEditor', [
        'lib/ko',
        'lib/moment',
        'admin/config',
        'admin/text',
        'admin/util',
        'admin/util/ajax',
        'admin/models',
        'admin/controls/callTrackingPhone',
        'admin/controls/notification',
        'admin/controls/loadingOverlay'
],
    function(ko, moment, config, text, util, ajax, models, CallTrackingPhone, notification, loadingOverlay) {
        'use strict';

        function CallTrackingPhonesEditor(data) {
            var self = this;

            this.communityId = data.communityId;
            this.communityName = data.communityName;
            this.provisionCallTrackingNumbers = ko.observable();
            this.callTrackingPhones = ko.observableArray(util.map(data.callTrackingPhones, CallTrackingPhone));
            this.actualCallTrackingPhones = data.callTrackingPhones;
            this.isPublished = !util.isNullOrUndef(data.publishStart) && !util.isNullOrUndef(data.publishEnd)
                    && !util.moment(data.publishStart).isAfter(moment(), 'days') && !moment().isAfter(util.moment(data.publishEnd));
            this.callTrackingWarning = !self.isPublished ? text.message('unpublishedCallTracking') : null;
            
            self.provisionCallTrackingNumbers.subscribe(function(newValue) {
                util.foreach(self.callTrackingPhones(), function(phone) {
                    if (newValue) {
                        phone.applyValidationRules();
                    } else {
                        phone.removeValidationRules();
                    }
                });
            });
            
            this.addPhone = function() {
                self.callTrackingPhones.push(new CallTrackingPhone({
                    phoneTypes: self.callTrackingPhones()[0].phoneTypes
                }));
            };

            this.deletePhone = function(phone) {
                self.callTrackingPhones.remove(phone);
            };

            this.disconnectPhone = function(phone) {
                phone.isDisconnected(true);
            };

            this.resumePhone = function(phone) {
                phone.isDisconnected(false);
            };

            this.applyValidationRules = function() {
                self.provisionCallTrackingNumbers(data.provisionCallTrackingNumbers);

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
                var callTrackingPhones = self.provisionCallTrackingNumbers()
                    ? util.getArrayData(self.callTrackingPhones())
                    : self.actualCallTrackingPhones;

                callTrackingPhones = util.filter(callTrackingPhones, function(phone) {
                    return !util.isNullOrUndef(phone.phone);
                });

                var result = {
                    communityId: self.communityId,
                    communityName: self.communityName,
                    provisionCallTrackingNumbers: self.provisionCallTrackingNumbers(),
                    callTrackingPhones: callTrackingPhones
                };

                return result;
            };

            this.submit = function() {
                if (self.isValid()) {
                    loadingOverlay.show();

                    ajax.post(config.setting('saveCallTrackingUrl'), self.getData(), function(response) {
                        if (response.success) {
                            window.location = response.url;
                        } else {
                            notification.showNotValidServerModelErrorMessage(response.errors);
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

            self.applyValidationRules();
        }

        return {
            init: function(data) {
                var model = ko.validatedObservable(new CallTrackingPhonesEditor(data));
                ko.applyBindings(model);
            }
        };
    });