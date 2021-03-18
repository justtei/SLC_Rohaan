mslc.define('client/controls/communityUnit',
    [
        'client/util'
        , 'client/util/subscriber'
        , 'client/controls/leadForm'
    ],
    function(util, Subscriber, LeadForm) {
        'use strict';

        function CommunityUnit(data) {

            //#region Private

            var self = this,
                submitSubcriber;

            //#endregion

            //#region Public

            this.update = function(newData) {
                if (util.isNullOrUndef(newData)) {
                    return;
                }

                self.leadForm.update(newData.leadForm);
                self.images(newData.images);
                self.address(newData.address);
                self.beds(newData.beds);
                self.bathes(newData.bathes);
                self.area(newData.area);
                self.price(newData.price);
            };

            //#endregion

            //#region Interface

            this.leadForm = null;
            this.images = ko.observable();
            this.address = ko.observable();
            this.beds = ko.observable();
            this.bathes = ko.observable();
            this.area = ko.observable();
            this.price = ko.observable();

            //#endregion

            //#region Constructor

            function init() {
                self.leadForm = new LeadForm();
                self.update(data);

                submitSubcriber = new Subscriber();
            };

            init();

            //#endregion

            return this;
        }

        return CommunityUnit;
    });