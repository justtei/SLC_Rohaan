mslc.define('admin/extends/ko', [
        'lib/jQuery',
        'lib/ko',
        'lib/moment',
        'admin/config',
        'admin/util',
        'admin/models/enums/keyCode',
        'admin/models/enums/callTrackingPhoneType',
        'admin/constants',
        'admin/regexp',
        'admin/extends/imageUploader'
],
    function($, ko, moment, config, util, KeyCode, CallTrackingPhoneType, Constants, Regexp, imageUploader) {
        'use strict';

        return {
            extend: function() {

                function initDatepickerBinding() {
                    var selfChanged = false;
                    
                    var init = function(element, valueAccessor) {
                        $(element).datepicker({
                            showAnim: 'clip',
                            changeMonth: true,
                            changeYear: true,
                            showOtherMonths: true,
                            selectOtherMonths: true,
                            dateFormat: config.setting('dateJsFormat'),
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

                function initTimepickerBinding() {
                    var init = function(element, valueAccessor) {
                        $(element).timepicker({
                            timeFormat: config.setting('timePickerTimeFormat'),
                            stepMinute: config.setting('timeStepMinute')
                        }).on('change', function() {
                            var observable = valueAccessor();
                            observable($(this).val());
                        }).on('keydown', function(e) {
                            var observable = valueAccessor();

                            if (e.keyCode == KeyCode.BACKSPACE || e.keyCode == KeyCode.DELETE) {
                                observable(null);
                            }

                            return false;
                        }).on('paste', function() {
                            return false;
                        });
                    };

                    var update = function(element, valueAccessor) {
                        var value = ko.unwrap(valueAccessor());
                        $(element).val(value);
                    };

                    return {
                        init: init,
                        update: update
                    };
                }

                function initSlideVisibleBinding() {
                    var slideDuration = config.setting('slideDuration');

                    var update = function(element, valueAccessor) {
                        var value = valueAccessor();
                        var valueUnwrapped = ko.unwrap(value);

                        if (valueUnwrapped == true) {
                            $(element).slideDown(slideDuration);
                        } else {
                            $(element).slideUp(slideDuration);
                        }
                    };

                    return {
                        update: update
                    };
                }

                function initImageUploaderBinding() {
                    var init = function(element, valueAccessor) {
                        $(element).on('click', function() {
                            imageUploader.show(element, valueAccessor());
                        });
                    };

                    return {
                        init: init
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

                function initDateRangeValidationRule() {

                    function validator(startDate, endDate) {
                        var start = util.moment(ko.unwrap(startDate));
                        var end = util.moment(ko.unwrap(endDate));
                        var result = !start.isAfter(end, 'days');

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initWeekRangeValidationRule() {

                    function validator(startDay, endDay) {
                        var start = ko.unwrap(startDay);
                        var end = ko.unwrap(endDay);

                        var result = util.isNullOrUndef(start) || util.isNullOrUndef(end)
                            ? true
                            : start <= end;

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initNumberRangeValidationRule() {

                    function validator(number1, number2) {
                        var num1 = parseFloat(ko.unwrap(number1));
                        var num2 = parseFloat(ko.unwrap(number2));
                        var isEmptyNum1 = util.isNullOrUndef(num1) || isNaN(num1);
                        var isEmptyNum2 = util.isNullOrUndef(num2) || isNaN(num2);

                        var result = isEmptyNum1 || isEmptyNum2
                            ? true
                            : num1 <= num2;

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initArrayMaxLengthValidationRule() {

                    function validator(array, maxLength) {
                        var result = ko.unwrap(array).length <= maxLength;
                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initUrlValidationRule() {
                    function validator(url) {
                        var result = util.isNullOrEmpty(url) || Regexp.URL.test(ko.unwrap(url));

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initRequiredCheckboxListValidationRule() {

                    function validator(list) {
                        var result = util.any(list, function(checkbox) {
                            return checkbox.isChecked();
                        });

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initCallTrackingPhonesValidationRule() {

                    function validator(phones) {
                        var result = true;

                        var activePhones = util.filter(phones, function(phone) {
                            return !phone.isDisconnected();
                        });

                        if (activePhones.length > 3) {
                            result = false;
                        }

                        activePhones = activePhones.sort(function(left, right) {
                            return left.phoneType() <= right.phoneType() ? -1 : 1;
                        });

                        for (var i = 1; i < activePhones.length; i++) {
                            if (activePhones[i].phoneType() === activePhones[i - 1].phoneType()) {
                                result = false;
                                break;
                            }
                        }

                        var onlineAndPrint = util.any(activePhones, function(phone) {
                            return phone.phoneType() === CallTrackingPhoneType.PROVISION_ONLINE_AND_PRINT_AD;
                        });

                        var online = util.any(activePhones, function(phone) {
                            return phone.phoneType() === CallTrackingPhoneType.PROVISION_ONLINE;
                        });

                        var print = util.any(activePhones, function(phone) {
                            return phone.phoneType() === CallTrackingPhoneType.PROVISION_PRINT_AD;
                        });

                        if (onlineAndPrint && (online || print)) {
                            result = false;
                        }

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initYearValidationRule() {
                    function validator(year) {
                        if (util.isNullOrEmpty(year)) {
                            return true;
                        }

                        var result = false;
                        var yearStr = year.toString();

                        if (Regexp.YEAR.test(yearStr)) {
                            var intYear = parseInt(year);

                            if (!isNaN(intYear)) {
                                var currentYear = moment().year();
                                result = 0 <= intYear && intYear <= currentYear;
                            }
                        }

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initPositiveIntValidationRule() {
                    function validator(val) {
                        var result = true;

                        if (!util.isNullOrUndef(val) && !util.isString(val)
                            || util.isString(val) && val.length) {
                            var str = val.toString();
                            var num = parseInt(val);
                            result = Regexp.POSITIVE_INT.test(str) && !isNaN(num) && 0 <= num && num <= Constants.MAX_INT;
                        }

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initDecimalValidationRule() {
                    function validator(val) {
                        var result = util.isNullOrUndef(val) || !val.toString().length || Regexp.DECIMAL.test(val.toString());
                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                function initMaxDecimalValidationRule() {
                    function validator(val, max) {
                        var result = true;
                        
                        if (!util.isNullOrUndef(val) && val.toString().length && Regexp.DECIMAL.test(val.toString())) {
                            result = parseFloat(val) <= max;
                        }

                        return result;
                    }

                    return {
                        validator: validator
                    };
                }

                ko.bindingHandlers.datepicker = initDatepickerBinding();

                ko.bindingHandlers.timepicker = initTimepickerBinding();

                ko.bindingHandlers.slideVisible = initSlideVisibleBinding();

                ko.bindingHandlers.imageUploader = initImageUploaderBinding();

                ko.bindingHandlers.href = initAttrBinding('href');

                ko.bindingHandlers.src = initAttrBinding('src');

                ko.validation.rules['dateRange'] = initDateRangeValidationRule();

                ko.validation.rules['weekRange'] = initWeekRangeValidationRule();

                ko.validation.rules['numberRange'] = initNumberRangeValidationRule();

                ko.validation.rules['arrayMax'] = initArrayMaxLengthValidationRule();

                ko.validation.rules['url'] = initUrlValidationRule();

                ko.validation.rules['requiredCheckboxList'] = initRequiredCheckboxListValidationRule();

                ko.validation.rules['callTrackingPhones'] = initCallTrackingPhonesValidationRule();

                ko.validation.rules['year'] = initYearValidationRule();

                ko.validation.rules['positiveInt'] = initPositiveIntValidationRule();

                ko.validation.rules['decimal'] = initDecimalValidationRule();

                ko.validation.rules['maxDecimal'] = initMaxDecimalValidationRule();

                ko.validation.configure({
                    registerExtenders: true,
                    insertMessages: false,
                    errorsAsTitle: true,
                    decorateInputElement: true,
                    errorElementClass: 'input-validation-error',
                    grouping: { deep: true, observable: true, live: true }
                });

                ko.isObservableArray = function(property) {
                    var result = ko.isObservable(property) && property.indexOf !== undefined;
                    return result;
                };
            }
        };
    });