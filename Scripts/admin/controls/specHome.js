mslc.define('admin/controls/specHome', ['lib/ko', 'admin/config', 'admin/text', 'admin/util', 'admin/controls/floorPlan'],
    function(ko, config, text, util, FloorPlan) {
        'use strict';

        function SpecHome(data) {
            var self = new FloorPlan(data);

            self.imagesLabel = text.message('specHomesImagesLabel');
            self.saleType = ko.observable(data.saleType);
            self.saleTypes = data.saleTypes;
            self.status = ko.observable(data.status);
            self.statuses = data.statuses;
            self.description = ko.observable(data.description);

            self.new = function() {
                var result = new SpecHome({
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
                    statuses: self.statuses
                });

                return result;
            };

            self.applyValidationRules = function() {
                self.name.extend({
                    maxLength: {
                        params: config.setting('specHomeNameMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('specHomeLabel'),
                            config.setting('specHomeNameMaxLength'))
                    }
                });
                
                util.applyValidationRules([
                    self.priceRange,
                    self.livingSpace,
                    self.deposit,
                    self.applicationFee,
                    self.petDeposit,
                    self.customAmenities,
                    self.images
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
                    self.images
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
                    status: self.status(),
                    description: self.description(),
                };

                return result;
            };

            self.applyValidationRules();

            return self;
        }

        return SpecHome;
    });