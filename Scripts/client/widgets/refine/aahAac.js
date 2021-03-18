mslc.define('client/widgets/refine/aahAac',
    [
          'lib/ko'
        , 'client/controls/select'
        , 'client/controls/multi'
        , 'client/controls/numeric'
        , 'client/util'
        , 'client/services/remote'
    ],
    function(ko, Select, Multi, Numeric, util, remote) {
        'use strict';

        function AacAAhRefine(search) {

            //#region Private

            var self = this
                , bedName = 'Beds'
                , bathName = 'Baths'
                , maxPriceCaptionLength = 19;

            function formatPrice() {
                var caption = null
                    , min = self.min.value()
                    , max = self.max.value();
                if (min && max) {
                    caption = util.format('{0} - {1}', util.price(min), util.price(max));
                } else if (max) {
                    caption = 'to ' + util.price(max);
                } else if (min) {
                    caption = 'from ' + util.price(min);
                }

                return util.substringWithEllipsis(caption, maxPriceCaptionLength);
            }

            //#endregion

            //#region Public

            function formRequest() {
                return {
                    amenities: self.amenities.selected.values(),
                    minPrice: self.min.value(),
                    maxPrice: self.max.value(),
                    beds: self.beds.selected.value(),
                    bathes: self.bathes.selected.value()
                };
            }

            function reset() {
                self.bathes.reset();
                self.beds.reset();
                self.min.value(null);
                self.max.value(null);
                self.amenities.reset();
            }

            function isInitial() {
                return self.beds.isInitial()
                    && self.bathes.isInitial()
                    && self.min.isInitial()
                    && self.max.isInitial()
                    && self.amenities.isInitial();
            }

            function isEmpty() {
                return self.beds.selected.value() === null
                    && self.bathes.selected.value() === null
                    && self.min.value() === null
                    && self.max.value() === null
                    && !self.amenities.selected.values().length;
            }

            //#endregion

            this.beds = null;
            this.bathes = null;
            this.min = null;
            this.max = null;
            this.priceCaption = null;
            this.amenities = null;

            this.formRequest = formRequest;
            this.reset = reset;
            this.isInitial = isInitial;
            this.isEmpty = isEmpty;
            this.urlSource = remote.get.communitySearchUrl;

            function init() {
                self.bathes = new Select(search.refine.bathes, search.bathes, util.selectFactory(bathName));
                self.beds = new Select(search.refine.beds, search.beds, util.selectFactory(bedName));
                self.min = new Numeric(search.minPrice);
                self.max = new Numeric(search.maxPrice);
                self.amenities = new Multi(search.refine.amenities, search.amenities, { captionFormatter: util.listCaption });

                self.priceCaption = ko.computed(formatPrice);
            }

            init();

            return this;
        }

        return AacAAhRefine;
    });