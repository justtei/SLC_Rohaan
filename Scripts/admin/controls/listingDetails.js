mslc.define('admin/controls/listingDetails', [
        'lib/ko',
        'admin/text',
        'admin/util',
        'admin/models',
        'admin/controls/callTrackingPhone',
        'admin/controls/setOwner'
    ],
    function(ko, text, util, models, CallTrackingPhone, SetOwner) {
        'use strict';

        function ListingDetails(data) {
            var self = this;

            this.id = data.id;
            this.propertyManager = new SetOwner(data.propertyManager);
            this.builder = new SetOwner(data.builder);
            this.provisionCallTrackingNumbers = ko.observable();
            this.callTrackingPhones = ko.observableArray(util.map(data.callTrackingPhones, CallTrackingPhone));
            this.actualCallTrackingPhones = data.callTrackingPhones;
            this.isDisabledCallTrackingEditing = ko.observable();

            self.provisionCallTrackingNumbers.subscribe(function(newValue) {
                util.foreach(self.callTrackingPhones(), function(phone) {
                    if (newValue) {
                        phone.applyValidationRules();
                    } else {
                        phone.removeValidationRules();
                    }
                });
            });

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
                var callTrackingPhones = !self.isDisabledCallTrackingEditing() && self.provisionCallTrackingNumbers()
                    ? util.getArrayData(self.callTrackingPhones())
                    : self.actualCallTrackingPhones;

                callTrackingPhones = util.filter(callTrackingPhones, function(phone) {
                    return !util.isNullOrUndef(phone.phone);
                });

                var result = {
                    id: self.id,
                    propertyManager: self.propertyManager.getData(),
                    builder: self.builder.getData(),
                    provisionCallTrackingNumbers: self.provisionCallTrackingNumbers(),
                    callTrackingPhones: callTrackingPhones
                };

                return result;
            };

            self.applyValidationRules();
        }

        return ListingDetails;
    });