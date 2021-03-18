mslc.define('admin/controls/house', [
        'lib/ko',
        'admin/config',
        'admin/text',
        'admin/util',
        'admin/controls/address',
        'admin/controls/floorPlan'
],
    function(ko, config, text, util, Address, FloorPlan) {
        'use strict';

        function House(data) {
            var self = new FloorPlan(data);

            self.imagesLabel = text.message('houseImagesLabel');
            self.saleType = ko.observable(data.saleType);
            self.saleTypes = data.saleTypes;
            self.description = ko.observable(data.description);
            self.yearBuilt = ko.observable(data.yearBuilt);
            self.address = new Address(data.address);

            self.new = function() {
                var result = new House({
                    availableBedroomsFromQuantity: self.availableBedroomsFromQuantity,
                    availableBedroomsToQuantity: self.availableBedroomsToQuantity,
                    availableBathroomsFromQuantity: self.availableBathroomsFromQuantity,
                    availableBathroomsToQuantity: self.availableBathroomsToQuantity,
                    priceRange: { availableMeasures: self.priceRange.availableMeasures },
                    livingSpace: { availableMeasures: self.livingSpace.availableMeasures },
                    deposit: { availableMeasures: self.deposit.availableMeasures },
                    applicationFee: { availableMeasures: self.applicationFee.availableMeasures },
                    petDeposit: { availableMeasures: self.petDeposit.availableMeasures },
                    defaultAmenities: self.getCleanAmenities(),
                    customAmenities: [{}],
                    coupon: {},
                    images: { displayName: self.images.displayName },
                    saleTypes: self.saleTypes,
                    address: {
                        location: {},
                        country: { availableCountries: self.address.country.availableCountries() },
                        state: {},
                        city: {}
                    }
                });

                return result;
            };

            self.applyValidationRules = function() {
                self.name.extend({
                    maxLength: {
                        params: config.setting('floorPlanNameMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('houseLabel'),
                            config.setting('floorPlanNameMaxLength'))
                    }
                });

                self.yearBuilt.extend({
                    year: {
                        message: text.message('invalidYearErrorMessage')
                    }
                });

                util.applyValidationRules([
                    self.priceRange,
                    self.livingSpace,
                    self.deposit,
                    self.applicationFee,
                    self.petDeposit,
                    self.customAmenities,
                    self.images,
                    self.address
                ]);
            };

            self.removeValidationRules = function() {
                util.removeValidationRules([
                    self.name,
                    self.priceRange,
                    self.livingSpace,
                    self.deposit,
                    self.applicationFee,
                    self.petDeposit,
                    self.customAmenities,
                    self.images,
                    self.address,
                    self.yearBuilt
                ]);
            };
            
            self.getData = function() {
                var result = {
                    id: self.id,
                    name: self.name(),
                    bedroomFromId: self.bedroomFromId(),
                    bedroomToId: self.bedroomToId(),
                    bathroomFromId: self.bathroomFromId(),
                    bathroomToId: self.bathroomToId(),
                    priceRange: self.priceRange.getData(),
                    livingSpace: self.livingSpace.getData(),
                    deposit: self.deposit.getData(),
                    applicationFee: self.applicationFee.getData(),
                    petDeposit: self.petDeposit.getData(),
                    defaultAmenities: self.defaultAmenities,
                    customAmenities: util.filter(self.customAmenities(), function(amenity) {
                        return !util.isNullOrEmpty(amenity.name());
                    }),
                    images: self.images.getData(),
                    saleType: self.saleType(),
                    description: self.description(),
                    yearBuilt: self.yearBuilt(),
                    address: self.address.getData()
                };

                return result;
            };

            self.applyValidationRules();

            return self;
        }

        return House;
    });