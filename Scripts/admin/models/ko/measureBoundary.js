mslc.define('admin/models/ko/measureBoundary', [
        'lib/ko',
        'admin/config',
        'admin/text',
        'admin/util',
        'admin/constants',
        'admin/regexp',
        'admin/models/enums/keyCode'
],
    function(ko, config, text, util, Constants, Regexp, KeyCode) {
        'use strict';

        function MeasureBoundary(data, type) {
            var self = this;

            this.min = ko.observable(data.min);
            this.max = ko.observable(data.max);
            this.measure = ko.observable(data.measure);
            this.availableMeasures = data.availableMeasures;
            this.regex = type === 'int' ? Regexp.POSITIVE_INT : Regexp.DECIMAL;
            this.maxValue = type === 'int' ? Constants.MAX_INT : Constants.MAX_MONEY;
            

            this.onPriceKeypress = function(currentValue, e) {
                var result;

                if (e.keyCode === KeyCode.BACKSPACE || e.keyCode === KeyCode.DELETE
                    || e.keyCode === KeyCode.LEFT_ARROW || e.keyCode === KeyCode.RIGHT_ARROW
                    || e.keyCode === KeyCode.HOME || e.keyCode === KeyCode.END
                    || !self.regex.test(currentValue)) {
                    result = true;
                } else {
                    result = currentValue <= self.maxValue;
                }

                return result;
            };

            this.applyValidationRules = function() {
                self.min.extend({
                    min: {
                        params: 0,
                        message: util.stringFormat(text.message('minRangeErrorMessage'), text.message('minLabel'), 0)
                    },
                    numberRange: {
                        params: self.max,
                        message: util.stringFormat(text.message('invalidMinValueErrorMessage'), text.message('minLabel'), text.message('maxLabel'))
                    }
                });

                if (type === 'int') {
                    self.min.extend({
                        positiveInt: { message: util.stringFormat(text.message('notPositiveIntErrorMessage'), text.message('minLabel')) },
                        max: {
                            params: Constants.MAX_INT,
                            message: util.stringFormat(text.message('maxRangeErrorMessage'), text.message('minLabel'), Constants.MAX_INT)
                        }
                    });
                } else {
                    self.min.extend({
                        decimal: { message: util.stringFormat(text.message('numericValueErrorMessage'), text.message('minLabel')) },
                        maxDecimal: {
                            params: Constants.MAX_MONEY,
                            message: util.stringFormat(text.message('maxRangeErrorMessage'), text.message('minLabel'), Constants.MAX_MONEY)
                        }
                    });
                }

                self.max.extend({
                    min: {
                        params: 0,
                        message: util.stringFormat(text.message('minRangeErrorMessage'), text.message('maxLabel'), 0)
                    }
                });

                if (type === 'int') {
                    self.max.extend({
                        positiveInt: { message: util.stringFormat(text.message('notPositiveIntErrorMessage'), text.message('maxLabel')) },
                        max: {
                            params: Constants.MAX_INT,
                            message: util.stringFormat(text.message('maxRangeErrorMessage'), text.message('maxLabel'), Constants.MAX_INT)
                        }
                    });
                } else {
                    self.max.extend({
                        decimal: { message: util.stringFormat(text.message('numericValueErrorMessage'), text.message('maxLabel')) },
                        maxDecimal: {
                            params: Constants.MAX_MONEY,
                            message: util.stringFormat(text.message('maxRangeErrorMessage'), text.message('maxLabel'), Constants.MAX_MONEY)
                        }
                    });
                }
            };

            this.removeValidationRules = function() {
                util.removeValidationRules([
                    self.min,
                    self.max
                ]);
            };

            this.getData = function() {
                var result = {
                    min: self.min(),
                    max: self.max(),
                    measure: self.measure()
                };

                return result;
            };

            self.applyValidationRules();
        }

        return MeasureBoundary;
    });