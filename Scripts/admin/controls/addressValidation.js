mslc.define('admin/controls/addressValidation', ['lib/ko', 'admin/util', 'admin/models', 'admin/controls/googleMap'],
    function(ko, util, models, GoogleMap) {
        'use strict';

        function AddressValidation() {
            var self = this;

            this.addressId = null;
            this.validationItems = ko.observableArray();
            this.selectedValidationItem = ko.observable();
            this.selectedLatitude = ko.observable(0);
            this.selectedLongitude = ko.observable(0);
            this.isAddressValid = false;
            this.googleMap = new GoogleMap(self.selectedLatitude, self.selectedLongitude);

            self.selectedValidationItem.subscribe(function(newIndex) {
                if (self.validationItems().length) {
                    var index = parseInt(newIndex);
                    var latitude = self.validationItems()[index].latitude;
                    var longitude = self.validationItems()[index].longitude;
                    
                    self.googleMap.setCoordinates(latitude, longitude);
                }
            });

            this.init = function(data) {
                self.addressId = data.addressId;
                self.validationItems(util.map(data.validationItems, models.ko.AddressValidationItem));
                self.isAddressValid = data.isAddressValid;
                self.googleMap.init();

                self.selectedValidationItem('0');
            };

            this.clear = function() {
                self.addressId = null;
                self.validationItems.removeAll();
                self.isAddressValid = false;
                self.selectedValidationItem(-1);
            };

            this.checkValidationItem = function(index) {
                self.selectedValidationItem(index.toString());
            };
            
            this.getData = function() {
                var result = {                    
                    addressId: self.addressId,
                    validationItems: self.validationItems(),
                    selectedValidationItem: self.selectedValidationItem(),
                    selectedLatitude: self.selectedLatitude(),
                    selectedLongitude: self.selectedLongitude(),
                    isAddressValid: self.isAddressValid
                };

                return result;
            };
        }

        return AddressValidation;
    });