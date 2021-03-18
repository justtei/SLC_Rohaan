mslc.define('client/widgets/carousel', ['lib/jQuery', 'lib/ko', 'client/config', 'client/util'],
    function($, ko, config, util) {
        'use strict';

        function Carousel(carouselId, settings) {

            var self = this;

            // Selectors
            this.selectors = {
                carousel: '#' + carouselId + ' .carousel-container',
                carouselUl: '#' + carouselId + ' ul.carousel',
                nextButton: '#' + carouselId + ' .carousel-next-button',
                prevButton: '#' + carouselId + ' .carousel-prev-button',
                inactiveButtonClass: 'carousel-inactive-button',
                carouselLi: '#' + carouselId + ' li.carousel-item',
                carouselLiNumericClass: 'carousel-item-',
                carouselFakeLi: '#' + carouselId + ' li.fake',
                fakeLiItem: '.fake'
            };

            // Settings
            this.baseItemWidth = 300;
            this.maxImageWidth = 300;
            this.verticalVisibleCount = 1;
            this.carouselShiftDelay = config.setting('carouselShiftDelay');

            // Properties
            this.itemsCount = ko.observable();
            this.realItemsCount = null;
            this.firstVisibleItem = ko.observable();
            this.lastVisibleItem = ko.observable();
            this.isPrevButtonDisabled = ko.observable();
            this.isNextButtonDisabled = ko.observable();
            this.currentOffset = ko.observable();
            this.horizontalVisibleCount = null;
            this.itemsPerRow = null;
            this.fakeItemsCount = null;
            this.scrollCount = null;
            this.maxOffset = null;
            this.maxVisibleItems = null;
            this.itemWidth = null;
            this.calculatedItemWidth = null;
            this.isInSlideProgress = false;
            this.isVisibleShowAllRightLinkSetting = false;
            this.isVisibleShowAllRightLink = ko.observable();
            this.shiftInterval = null;

            // Event callbacks
            this.afterCarouselResizeCallBack = null;

            // Elements
            this.carouselElement = null;
            this.ulElement = null;
            this.liElements = null;
            this.fakeLiElements = null;
            this.fakeLiItem = '<li class="fake"></li>';
            this.nextButton = null;
            this.prevButton = null;

            // Methods
            this.init = function() {
                self.ulElement = $(self.selectors.carouselUl);

                // custom settings
                if (!util.isNullOrUndef(settings)) {
                    if (!util.isNullOrUndef(settings.baseItemWidth)) {
                        self.baseItemWidth = settings.baseItemWidth;
                    }
                    if (!util.isNullOrUndef(settings.maxImageWidth)) {
                        self.maxImageWidth = settings.maxImageWidth;
                    }
                    if (!util.isNullOrUndef(settings.verticalVisible)) {
                        self.verticalVisibleCount = settings.verticalVisible;
                    }
                    if (!util.isNullOrUndef(settings.isVisibleShowAllRightLink)) {
                        self.isVisibleShowAllRightLinkSetting = true;
                    }
                    if (!util.isNullOrUndef(settings.realItemsCount)) {
                        self.realItemsCount = settings.realItemsCount;
                    }
                }

                self.reinitCarousel();

                self.shiftInterval = setInterval(self.autoShift, self.carouselShiftDelay);
            };

            this.reinitCarousel = function() {
                self.removeFakeLiItems();

                self.carouselElement = $(self.selectors.carousel);
                self.ulElement = $(self.selectors.carouselUl);
                self.liElements = $(self.selectors.carouselLi);
                self.nextButton = $(self.selectors.nextButton);
                self.prevButton = $(self.selectors.prevButton);

                self.itemsCount(self.liElements.length);
                self.itemsPerRow = Math.ceil(self.itemsCount() / self.verticalVisibleCount);
                self.currentOffset(0);
                self.fakeItemsCount = 0;

                if (self.liElements.length > 1) {
                    for (var i = 0; i < self.itemsCount() ; i++) {
                        self.liElements.eq(i).addClass(self.selectors.carouselLiNumericClass + i);
                    }
                }

                self.addFakeLiItems();
                self.fakeLiElements = $(self.selectors.carouselFakeLi);

                self.setCarouselCss();
                self.resizeCarousel();
            };

            this.resizeCarousel = function() {
                if (self.carouselElement.width() == 0) {
                    return;
                }

                var outerWidth = self.liElements.eq(0).outerWidth(true) - self.liElements.eq(0).width();
                var carouselWidth = self.carouselElement.width();

                if (carouselWidth < self.baseItemWidth + outerWidth) {
                    self.calculatedItemWidth = carouselWidth - outerWidth;
                } else {
                    self.calculatedItemWidth = self.baseItemWidth;
                }

                self.horizontalVisibleCount = Math.floor(self.carouselElement.width() / (self.calculatedItemWidth + outerWidth));
                self.scrollCount = self.horizontalVisibleCount;
                self.maxOffset = Math.ceil(self.itemsCount() / self.verticalVisibleCount) - self.horizontalVisibleCount;
                self.maxVisibleItems = self.horizontalVisibleCount * self.verticalVisibleCount;

                if (self.maxOffset < 0) {
                    self.maxOffset = 0;
                }
                if (self.currentOffset() > self.maxOffset) {
                    self.currentOffset(self.maxOffset);
                }

                self.itemWidth = self.carouselElement.width() / self.horizontalVisibleCount;

                self.ulElement.width(Math.ceil(Math.ceil(self.itemsCount() / self.verticalVisibleCount) * self.itemWidth));

                var innerItemWidth = self.itemWidth - outerWidth;
                var i;
                for (i = 0; i < self.itemsCount() ; i++) {
                    self.liElements.eq(i).width(innerItemWidth);
                    var image = self.liElements.eq(i).find('.max-image-width');
                    image.css('max-width', self.maxImageWidth);
                    image.css('margin-left', 'auto');
                    image.css('margin-right', 'auto');
                }
                for (i = 0; i < self.fakeItemsCount; i++) {
                    self.fakeLiElements.eq(i).width(innerItemWidth);
                }

                self.ulElement.css('left', -(self.currentOffset() * self.itemWidth));

                self.updateCarouselUi();

                if (self.afterCarouselResizeCallBack != null) {
                    self.afterCarouselResizeCallBack();
                }
            };

            this.updateCarouselUi = function() {
                self.firstVisibleItem(self.currentOffset() * self.verticalVisibleCount + 1);
                var lastVisibleItem = self.currentOffset() * self.verticalVisibleCount + self.maxVisibleItems;

                if (lastVisibleItem > self.itemsCount()) {
                    self.lastVisibleItem(self.itemsCount());
                } else {
                    self.lastVisibleItem(lastVisibleItem);
                }

                if (self.currentOffset() == 0) {
                    $(self.selectors.prevButton).addClass('disabled');
                } else {
                    $(self.selectors.prevButton).removeClass('disabled');
                }

                if (self.currentOffset() == self.maxOffset || self.itemsCount() <= self.horizontalVisibleCount) {
                    $(self.selectors.nextButton).addClass('disabled');
                } else {
                    $(self.selectors.nextButton).removeClass('disabled');
                }

                if (self.isVisibleShowAllRightLinkSetting &&
                    self.currentOffset() == self.maxOffset &&
                    self.realItemsCount > self.itemsCount()) {
                    self.isVisibleShowAllRightLink(true);
                } else {
                    self.isVisibleShowAllRightLink(false);
                }
            };

            this.setCarouselCss = function() {
                self.ulElement.css('font-size', '');
                var fontSize = self.ulElement.css('font-size');
                self.ulElement.css('font-size', 0);

                var liElementsWithFake = $(self.selectors.carouselLi);
                var i;
                for (i = self.itemsPerRow; i < self.itemsCount() ; i++) {
                    liElementsWithFake.eq(i).addClass('vertical-divider');
                    liElementsWithFake.eq(i).css('font-size', fontSize);
                }

                for (i = 0; i < self.itemsPerRow; i++) {
                    liElementsWithFake.eq(i).removeClass('vertical-divider');
                    liElementsWithFake.eq(i).css('font-size', fontSize);
                }

                if (self.verticalVisibleCount > 1) {
                    self.ulElement.css('display', 'inline-table');
                }
            };

            this.addFakeLiItems = function() {
                if (self.liElements != null) {
                    var extraItemxCount = self.itemsCount() % self.verticalVisibleCount;

                    if (extraItemxCount != 0) {
                        self.fakeItemsCount = self.verticalVisibleCount - extraItemxCount;

                        for (var i = self.fakeItemsCount; i >= 1; i--) {
                            var fakeItemIndex = self.itemsPerRow * (self.verticalVisibleCount - i + 1) - 2;
                            var realIndex = fakeItemIndex - (self.fakeItemsCount - i);
                            self.ulElement.find('.' + self.selectors.carouselLiNumericClass + realIndex).after(self.fakeLiItem);
                        }
                    }
                }
            };

            this.removeFakeLiItems = function() {
                var liElements = $(self.selectors.carouselLi);

                if (liElements != null) {
                    liElements.remove(self.selectors.fakeLiItem);
                }
            };

            this.autoShift = function() {
                if (self.currentOffset() < self.maxOffset) {
                    self.slideRight();
                } else {
                    self.slideLeft(self.maxOffset);
                }
            };

            this.stopAutoShift = function() {
                if (self.shiftInterval != null) {
                    clearInterval(self.shiftInterval);
                }

                return true;
            };

            this.slideLeft = function(customScrollValue) {
                if (self.currentOffset() > 0 && !self.isInSlideProgress) {
                    self.isInSlideProgress = true;

                    var scrollCount = self.scrollCount;
                    if (customScrollValue !== undefined) {
                        scrollCount = customScrollValue;
                    }

                    var offset = self.currentOffset() > scrollCount
                        ? scrollCount
                        : self.currentOffset();

                    self.currentOffset(self.currentOffset() - offset);
                    self.ulElement.animate({ left: '+=' + self.itemWidth * offset + 'px' }, null, function() {
                        self.resizeCarousel();
                        self.isInSlideProgress = false;
                    });
                }
            };

            this.slideRight = function(customScrollValue) {
                if (self.currentOffset() < self.maxOffset && !self.isInSlideProgress) {
                    self.isInSlideProgress = true;

                    var scrollCount = self.scrollCount;
                    if (customScrollValue !== undefined) {
                        scrollCount = customScrollValue;
                    }

                    var offset = self.maxOffset - self.currentOffset();

                    if (offset > scrollCount) {
                        offset = scrollCount;
                    }

                    self.currentOffset(self.currentOffset() + offset);
                    self.ulElement.animate({ left: '-=' + self.itemWidth * offset + 'px' }, null, function() {
                        self.resizeCarousel();
                        self.isInSlideProgress = false;
                    });
                }
            };

            // jQuery bindings
            $(window).on('responseResize', self.resizeCarousel);

            $(document).on('click', self.selectors.prevButton, function() {
                self.slideLeft();
            });

            $(document).on('click', self.selectors.nextButton, function() {
                self.slideRight();
            });

            $(document).on('swipeleft', self.selectors.carousel, function() {
                self.slideRight();
            });

            $(document).on('swiperight', self.selectors.carousel, function() {
                self.slideLeft();
            });

            // Initialization
            self.init();
        }

        return {
            init: function(carouselId, settings) {
                var model = new Carousel(carouselId, settings);
                var carousel = document.getElementById(carouselId);
                ko.applyBindings(model, carousel);
            }
        };
    });