mslc.define('client/extends/ko',
    [
        'lib/jQuery'
        , 'lib/ko'
        , 'client/util'
        , 'client/config'
        , 'client/services/browser'
        , 'client/models/enums/keyCode'
        , 'client/controls/photoTour'
    ],
    function($, ko, util, config, browser, KeyCode, PhotoTour) {
        'use strict';

        return {
            extend: function() {

                function initSlideVisibleBinding() {
                    var slideDuration = 400;

                    function animate($elem, flag, callback) {
                        if ($elem.is(':visible') === flag) {
                            util.invokeAsync(callback, 0);
                        } else if (flag) {
                            $elem.slideDown(slideDuration, callback);
                        } else {
                            $elem.slideUp(slideDuration, callback);
                        }
                    }

                    var init = function(element, valueAccessor) {
                        var value = valueAccessor(),
                            valueUnwrapped = ko.unwrap(value),
                            flag = false,
                            $elem = $(element);

                        if (typeof valueUnwrapped === "boolean") {
                            flag = valueUnwrapped;
                        } else if (typeof valueUnwrapped === "object" && !!valueUnwrapped) {
                            flag = valueUnwrapped.flag;
                        }
                        
                        if (!flag) {
                            $elem.hide();
                        } else {
                            $elem.show();
                        }
                    };

                    var update = function(element, valueAccessor, allBindings) {
                        var value = valueAccessor(),
                            valueUnwrapped = ko.unwrap(value),
                            flag = false,
                            callback = null,
                            delay = false,
                            $elem = $(element);

                        if (typeof valueUnwrapped === "boolean") {
                            flag = valueUnwrapped;
                        } else if (typeof valueUnwrapped === "object" && !!valueUnwrapped) {
                            flag = valueUnwrapped.flag;
                            callback = valueUnwrapped.callback;
                            delay = valueUnwrapped.delay;
                        }

                        delay = delay || allBindings.get('slideDelay');

                        if (delay) {
                            setTimeout(function() {
                                animate($elem, flag, callback);
                            }, delay);
                        } else {
                            animate($elem, flag, callback);
                        }
                    };

                    return {
                        update: update
                        , init: init
                    };
                }

                function initAttrBinding(attrName) {

                    function update(element, valueAccessor) {
                        ko.bindingHandlers.attr.update(element, function() {
                            var bind = {};
                            bind[attrName] = valueAccessor();
                            return bind;
                        });
                    }

                    return {
                        update: update
                    };
                }

                function initPhotoTourBinding() {
                    function init(element, valueAccessor, allBindings, viewModel) {
                        var template = "photo-tour";
                        var photoTour = new PhotoTour();
                        ko.renderTemplate(template, photoTour, {}, element, 'replaceChildren');

                        //We store widget in view model to get access for dynamic update and width calculating
                        viewModel._tour = photoTour;

                        return { controlsDescendantBindings: true };
                    }

                    function update(element, valueAccessor, allBindings, viewModel) {
                        var value = ko.unwrap(valueAccessor());

                        viewModel._tour.update(value);
                    }

                    return {
                        init: init,
                        update: update
                    };
                }

                function initLinkNodeBinding() {
                    function init(element, valueAccessor) {
                        var value = ko.unwrap(valueAccessor());
                        if (!util.isNullOrUndef(value)) {
                            value.linkedNode = element;
                        }
                    }

                    return {
                        init: init
                    };
                }

                function initImageBinding() {
                    var update = function(element, valueAccessor) {
                        if (element.tagName != "IMG") {
                            return;
                        }
                        var val = ko.unwrap(valueAccessor());
                        element.src = val.src;
                        element.alt = val.alt;
                        element.title = val.alt;
                        element.onerror = function() {
                            this.src = val.onErrorSrc;
                        };
                    };

                    return {
                        update: update
                    };
                }
                
                function initDatepickerBinding() {
                    var selfChanged = false;
                    
                    var init = function(element, valueAccessor) {
                        $(element).datepicker({
                            showAnim: 'slideDown',
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            dateFormat: config.setting('dateFormat'),
                            minDate: 0,
                            prevText: '',
                            nextText: '',
                            onSelect: function(dateText) {
                                var observable = valueAccessor();
                                selfChanged = true;
                                observable(dateText);
                                element.blur();
                            }
                        }).on('keydown', function(e) {
                            if (e.keyCode == KeyCode.BACKSPACE || e.keyCode == KeyCode.DELETE) {
                                var observable = valueAccessor();
                                observable(null);
                                var $element = $(element);
                                $element.datepicker('setDate', null);
                                $element.datepicker('hide');
                                $element.blur();
                            }

                            return false;
                        }).on('paste', function() {
                            return false;
                        });
                    };

                    var update = function(element, valueAccessor) {
                        if (!selfChanged) {
                            var value = ko.unwrap(valueAccessor());
                            var date = util.isNullOrUndef(value) ? null : new Date(value);
                            $(element).datepicker('setDate', date);
                        } else {
                            selfChanged = false;
                        }
                    };

                    return {
                        init: init,
                        update: update
                    };
                }

                ko.bindingHandlers.slideVisible = initSlideVisibleBinding();

                ko.bindingHandlers.href = initAttrBinding('href');

                ko.bindingHandlers.src = initAttrBinding('src');

                ko.bindingHandlers.title = initAttrBinding('title');
                
                ko.bindingHandlers.photoTour = initPhotoTourBinding();

                ko.bindingHandlers.linkNode = initLinkNodeBinding();

                ko.bindingHandlers.image = initImageBinding();

                ko.bindingHandlers.datepicker = initDatepickerBinding();

                ko.validation.init({
                    insertMessages: false,
                    decorateInputElement: true,
                    errorElementClass: 'validation-error',
                    errorsAsTitle: false,
                    grouping: {
                        deep: true
                    }
                });

                var originalApplyBindingsMethod = ko.applyBindings;

                ko.applyBindings = function(data, element) {
                    if (element) {
                        originalApplyBindingsMethod(data, element);
                    }
                };
            }
        };
    });