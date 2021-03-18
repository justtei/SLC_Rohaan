mslc.define('client/controls/photoTour',
    [
          'lib/ko'
          , 'client/util'
    ],
    function(ko, util) {
        'use strict';

        function Image(image, ind) {

            image.largeSrc = image.src;
            image.src = ko.observable(null);
            image.sqc = ind;

            return image;
        }

        function PhotoTour(images) {

            //#region Private

            var self = this,
                preLoadedCount = 3,
                optWidth = null,
                nextImageSqc = null;

            function getWidth(element) {
                var rect;
                if (element) {
                    rect = element.getBoundingClientRect();
                } else {
                    return 0;
                }
                return rect.width ? rect.width : rect.right - rect.left;
            }

            function calculate(isForced) {
                if (!optWidth) {
                    optWidth = getWidth(self.linkedNode);
                    if (optWidth === 0) {
                        return;
                    }
                }
                var array = self.images();
                for (var i = 0; i < array.length; i++) {
                    var img = array[i];

                    if (!img.isCalculated || isForced) {
                        if (img.isLoaded) {
                            img.width = getWidth(img.linkedNode);
                        } else {
                            break;
                        }
                        img.baseOffset = i === 0 ? 0 : array[i - 1].baseOffset + array[i - 1].width;
                        img.offset = (optWidth - img.width) / 2;
                        img.listOffset = -(img.baseOffset - img.offset) + 'px';
                        img.isCalculated = true;
                    }
                }
            }

            function loadFirstItems() {
                var firstItems = util.where(self.images(), function(img) {
                    return img.sqc < preLoadedCount;
                });

                util.select(firstItems, load);
            }

            function load(image) {
                image.src(image.largeSrc);
            }

            function mapTo(collection) {
                var item = util.first(collection),
                    isFirstInit = item && typeof item.src !== 'function';
                if (isFirstInit) {
                    collection = util.map(collection, Image);
                }

                return {
                    isLoaded: !isFirstInit
                    , items: collection
                }
            }

            //#endregion

            //#region Public

            function moveTo(image) {
                if (!image) {
                    return;
                }
                nextImageSqc = image.sqc;
                if (image.isCalculated) {
                    self.active(image);
                }
            }

            function handleLoad(image) {
                image.isLoaded = true;
                calculate(false);

                var nextImage = util.first(self.images(), function(elem) {
                    return elem.sqc === nextImageSqc;
                });
                if (nextImage && nextImage.isCalculated) {
                    nextImageSqc = null;
                    self.isLoading(false);
                    moveTo(nextImage);
                }
            }

            function handleError(image) {
                image.src(image.onErrorSrc);
            }

            function startLoading() {
                self.startLoading = null;
                var itemsToLoad = util.where(self.images(), function(img) {
                    return img.sqc >= preLoadedCount;
                });

                util.select(itemsToLoad, load);
            }

            function next() {
                var nextImage = util.first(self.images(), function(img) {
                    return img.sqc === self.active().sqc + 1;
                });
                if (nextImage) {
                    moveTo(nextImage);
                }
            }

            function prev() {
                var prevImage = util.first(self.images(), function(img) {
                    return img.sqc === self.active().sqc - 1;
                });
                if (prevImage) {
                    moveTo(prevImage);
                }
            }

            function isNext() {
                var array = self.images();
                return array.length && (self.active() !== util.last(self.images()));
            }

            function isPrev() {
                var array = self.images();
                return array.length && (self.active() !== util.first(self.images()));
            }

            function update(newImages) {
                self.active({});
                self.startLoading = startLoading;
                if (newImages && newImages.length) {
                    var mapped = mapTo(newImages);
                    self.images(mapped.items);
                    if (!mapped.isLoaded) {
                        loadFirstItems();
                    }
                    moveTo(util.first(self.images()));
                } else {
                    //collection with empty image object;
                    self.images([]);
                }
            }

            function recalculate() {
                calculate(true);
                moveTo(util.first(self.images()));
            }

            //#endregion

            //#region Interface

            this.images = ko.observableArray();
            this.moveTo = moveTo;
            this.handleLoad = handleLoad;
            this.handleError = handleError;
            this.active = ko.observable();
            this.startLoading = startLoading;
            this.isLoading = ko.observable();
            this.update = update;
            this.recalculate = recalculate;
            this.isNext = ko.computed(isNext);
            this.isPrev = ko.computed(isPrev);
            this.next = next;
            this.prev = prev;

            //#endregion

            //#region Initialize

            function init() {
                update(images);
            }

            init();

            //#endregion

            return this;
        }

        return PhotoTour;
    });