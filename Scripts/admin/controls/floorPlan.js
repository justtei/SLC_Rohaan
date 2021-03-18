mslc.define('admin/controls/floorPlan', ['lib/ko', 'admin/config', 'admin/text', 'admin/util', 'admin/models', 'admin/controls/images'],
    function(ko, config, text, util, models, Images) {
        'use strict';

        function FloorPlan(data) {
            var self = this;

            this.id = data.id;
            this.name = ko.observable(data.name);
            this.bedroomFromId = ko.observable(data.bedroomFromId);
            this.availableBedroomsFromQuantity = data.availableBedroomsFromQuantity;
            this.bedroomToId = ko.observable(data.bedroomToId);
            this.availableBedroomsToQuantity = data.availableBedroomsToQuantity;
            this.bathroomFromId = ko.observable(data.bathroomFromId);
            this.availableBathroomsFromQuantity = data.availableBathroomsFromQuantity;
            this.bathroomToId = ko.observable(data.bathroomToId);
            this.availableBathroomsToQuantity = data.availableBathroomsToQuantity;
            this.priceRange = new models.ko.MeasureBoundary(data.priceRange);
            this.livingSpace = new models.ko.MeasureBoundary(data.livingSpace, 'int');
            this.deposit = new models.ko.MeasureBoundary(data.deposit);
            this.applicationFee = new models.ko.MeasureBoundary(data.applicationFee);
            this.petDeposit = new models.ko.MeasureBoundary(data.petDeposit);
            this.defaultAmenities = util.map(data.defaultAmenities, models.ko.Checkbox);
            this.customAmenities = ko.observableArray(util.map(data.customAmenities, models.ko.Amenity));
            this.images = new Images(data.images, config.setting('communityUnitImagesMaxLength'));

            this.addAmenity = function() {
                self.customAmenities.push(new models.ko.Amenity({}));
            };

            this.deleteAmenity = function(amenity) {
                self.customAmenities.remove(amenity);
            };

            this.new = function() {
                var result = new FloorPlan({
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
                    images: { displayName: self.images.displayName }
                });

                return result;
            };

            this.getCleanAmenities = function() {
                var result = util.map(self.defaultAmenities, function(amenity) {
                    return {
                        isChecked: false,
                        text: amenity.text,
                        value: amenity.value
                    };
                });

                return result;
            };

            this.applyValidationRules = function() {
                self.name.extend({
                    maxLength: {
                        params: config.setting('floorPlanNameMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('floorPlanLabel'),
                            config.setting('floorPlanNameMaxLength'))
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

            this.removeValidationRules = function() {
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

            this.getData = function() {
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
                    images: self.images.getData()
                };

                return result;
            };

            self.applyValidationRules();
        }

        return FloorPlan;
    });