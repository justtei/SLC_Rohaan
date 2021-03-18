mslc.define('admin/controls/communityDetails', [
        'lib/ko',
        'admin/config',
        'admin/text',
        'admin/util',
        'admin/models',
        'admin/constants',
        'admin/regexp',
        'admin/models/enums/keyCode',
        'admin/controls/images',
        'admin/controls/floorPlan',
        'admin/controls/specHome',
        'admin/controls/house'
],
    function(ko, config, text, util, models, Constants, Regexp, KeyCode, Images, FloorPlan, SpecHome, House) {
        'use strict';

        function CommunityDetails(data) {
            var self = this;

            this.id = data.id;
            this.paymentTypes = util.map(data.paymentTypes, models.ko.Checkbox);
            this.priceRange = new models.ko.MeasureBoundary(data.priceRange);
            this.deposit = new models.ko.MeasureBoundary(data.deposit);
            this.applicationFee = new models.ko.MeasureBoundary(data.applicationFee);
            this.petDeposit = new models.ko.MeasureBoundary(data.petDeposit);
            this.livingSpace = new models.ko.MeasureBoundary(data.livingSpace, 'int');
            this.bedroomFromId = ko.observable(data.bedroomFromId);
            this.availableBedroomsFromQuantity = data.availableBedroomsFromQuantity;
            this.bedroomToId = ko.observable(data.bedroomToId);
            this.availableBedroomsToQuantity = data.availableBedroomsToQuantity;
            this.bathroomFromId = ko.observable(data.bathroomFromId);
            this.availableBathroomsFromQuantity = data.availableBathroomsFromQuantity;
            this.bathroomToId = ko.observable(data.bathroomToId);
            this.availableBathroomsToQuantity = data.availableBathroomsToQuantity;
            this.unitCount = ko.observable(data.unitCount);
            this.defaultAmenities = util.map(data.defaultAmenities, models.ko.Checkbox);
            this.customAmenities = ko.observableArray(util.map(data.customAmenities, models.ko.Amenity));
            this.defaultCommunityServices = util.map(data.defaultCommunityServices, models.ko.Checkbox);
            this.customCommunityServices = ko.observableArray(util.map(data.customCommunityServices, models.ko.CommunityService));
            this.virtualTour = ko.observable(data.virtualTour);
            this.coupon = new models.ko.Coupon(data.coupon);
            this.hasFloorPlans = ko.observable();
            this.floorPlans = ko.observableArray(util.map(data.floorPlans, FloorPlan));
            this.hasSpecHomes = ko.observable();
            this.specHomes = ko.observableArray(util.map(data.specHomes, SpecHome));
            this.hasHouses = ko.observable();
            this.houses = ko.observableArray(util.map(data.houses, House));
            this.logoImages = new Images(data.logoImages, config.setting('logoImagesMaxLength'));
            this.images = new Images(data.images, config.setting('communityImagesMaxLength'));

            self.hasFloorPlans.subscribe(function(newValue) {
                util.foreach(self.floorPlans(), function(floorPlan) {
                    if (newValue) {
                        floorPlan.applyValidationRules();
                    } else {
                        floorPlan.removeValidationRules();
                    }
                });
            });

            self.hasSpecHomes.subscribe(function(newValue) {
                util.foreach(self.specHomes(), function(specHome) {
                    if (newValue) {
                        specHome.applyValidationRules();
                    } else {
                        specHome.removeValidationRules();
                    }
                });
            });

            self.hasHouses.subscribe(function(newValue) {
                util.foreach(self.houses(), function(house) {
                    if (newValue) {
                        house.applyValidationRules();
                    } else {
                        house.removeValidationRules();
                    }
                });
            });

            this.addAmenity = function() {
                self.customAmenities.push(new models.ko.Amenity({}));
            };

            this.deleteAmenity = function(amenity) {
                self.customAmenities.remove(amenity);
            };

            this.addCommunityService = function() {
                self.customCommunityServices.push(new models.ko.CommunityService({}));
            };

            this.deleteCommunityService = function(communityService) {
                self.customCommunityServices.remove(communityService);
            };

            this.addFloorPlan = function() {
                self.floorPlans.push(self.floorPlans()[0].new());
            };

            this.deleteFloorPlan = function(flootPlan) {
                self.floorPlans.remove(flootPlan);
            };

            this.addSpecHome = function() {
                self.specHomes.push(self.specHomes()[0].new());
            };

            this.deleteSpecHome = function(specHome) {
                self.specHomes.remove(specHome);
            };

            this.addHouse = function() {
                self.houses.push(self.houses()[0].new());
            };

            this.deleteHouse = function(house) {
                self.houses.remove(house);
            };

            this.onUnitCountKeypress = function(currentValue, e) {
                var result;

                if (e.keyCode === KeyCode.BACKSPACE || e.keyCode === KeyCode.DELETE
                    || e.keyCode === KeyCode.LEFT_ARROW || e.keyCode === KeyCode.RIGHT_ARROW
                    || e.keyCode === KeyCode.HOME || e.keyCode === KeyCode.END
                    || !Regexp.POSITIVE_INT.test(currentValue)) {
                    result = true;
                } else {
                    result = currentValue <= Constants.MAX_INT;
                }

                return result;
            };

            this.applyValidationRules = function() {
                self.hasFloorPlans(data.hasFloorPlans);
                self.hasSpecHomes(data.hasSpecHomes);
                self.hasHouses(data.hasHouses);

                self.unitCount.extend({
                    positiveInt: {
                        message: util.stringFormat(text.message('notPositiveIntErrorMessage'), text.message('unitCountLabel'))
                    }
                });

                self.virtualTour.extend({
                    url: {
                        message: util.stringFormat(text.message('invalidUrlErrorMessage'), text.message('virtualTourLabel'))
                    },
                    maxLength: {
                        params: config.setting('communityVirtualTourMaxLength'),
                        message: util.stringFormat(text.message('maxStringLengthErrorMessage'),
                            text.message('virtualTourLabel'),
                            config.setting('communityVirtualTourMaxLength'))
                    }
                });

                self.floorPlans.extend({
                    arrayMax: {
                        onlyIf: function() {
                            return self.hasFloorPlans();
                        },
                        params: config.setting('communityUnitsMaxLength'),
                        message: util.stringFormat(text.message('maxCollectionLengthErrorMessage'),
                            text.message('floorPlanLabel'),
                            config.setting('communityUnitsMaxLength'))
                    }
                });

                self.specHomes.extend({
                    arrayMax: {
                        onlyIf: function() {
                            return self.hasSpecHomes();
                        },
                        params: config.setting('communityUnitsMaxLength'),
                        message: util.stringFormat(text.message('maxCollectionLengthErrorMessage'),
                            text.message('specHomeLabel'),
                            config.setting('communityUnitsMaxLength'))
                    }
                });

                self.houses.extend({
                    arrayMax: {
                        onlyIf: function() {
                            return self.hasHouses();
                        },
                        params: config.setting('communityUnitsMaxLength'),
                        message: util.stringFormat(text.message('maxCollectionLengthErrorMessage'),
                            text.message('houseLabel'),
                            config.setting('communityUnitsMaxLength'))
                    }
                });
            };

            this.getData = function() {
                var result = {
                    id: self.id,
                    paymentTypes: self.paymentTypes,
                    priceRange: self.priceRange.getData(),
                    deposit: self.deposit.getData(),
                    applicationFee: self.applicationFee.getData(),
                    petDeposit: self.petDeposit.getData(),
                    livingSpace: self.livingSpace.getData(),
                    bedroomFromId: self.bedroomFromId(),
                    bedroomToId: self.bedroomToId(),
                    bathroomFromId: self.bathroomFromId(),
                    bathroomToId: self.bathroomToId(),
                    unitCount: self.unitCount(),
                    defaultAmenities: self.defaultAmenities,
                    customAmenities: util.filter(self.customAmenities(), function(amenity) {
                        return !util.isNullOrEmpty(amenity.name());
                    }),
                    defaultCommunityServices: self.defaultCommunityServices,
                    customCommunityServices: util.filter(self.customCommunityServices(), function(service) {
                        return !util.isNullOrEmpty(service.name());
                    }),
                    virtualTour: self.virtualTour(),
                    coupon: self.coupon.getData(),
                    hasFloorPlans: self.hasFloorPlans(),
                    floorPlans: util.getArrayData(self.floorPlans()),
                    hasSpecHomes: self.hasSpecHomes(),
                    specHomes: util.getArrayData(self.specHomes()),
                    hasHouses: self.hasHouses(),
                    houses: util.getArrayData(self.houses()),
                    logoImages: self.logoImages.getData(),
                    images: self.images.getData()
                };

                return result;
            };

            self.applyValidationRules();
        }

        return CommunityDetails;
    });