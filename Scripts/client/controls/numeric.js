mslc.define('client/controls/numeric', ['lib/ko', 'client/util', 'client/util/subscriber'], function(ko, util, Subscriber) {
    'use strict';
    
    function Numeric(value, options) {
        //#region Private

        var currentValue = null,
            self = this,
            initial = ko.observable(null),
            regex,
            subscriber = new Subscriber();

        function processChange(newValue) {
            if (util.isNullOrUndef(newValue) || newValue === '') {
                self.text(null);
                self.value(null);
                if (currentValue !== null) {
                    subscriber.notify(null);
                }
                return;
            }
            var numericStr = newValue.toString().replace(regex, '');
            var number = parseInt(numericStr);
            if (numericStr === '') {
                number = null;
            }
            var isUpdate = util.isNumber(number) && number !== currentValue;
            if (isUpdate) {
                currentValue = number;
            }
            self.text(formatNumericStr(currentValue));
            self.value(currentValue);
            if (isUpdate) {
                subscriber.notify(currentValue);
            }
        }

        function formatNumericStr(number) {
            if (util.isNull(number)) {
                return null;
            }
            var str = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, options.thousandSeparator);
            return (str || options.defaultValue);
        }

        function isInitial() {
            return initial() === self.value();
        }

        //#endregion

        //#region Interface

        this.text = ko.observable(null);
        this.value = ko.observable(null);
        this.subscribe = subscriber.subscribe;
        this.unsubscribe = subscriber.unsubscribe;

        this.isInitial = ko.computed(isInitial);

        //#endregion

        //#region Init

        function init() {
            var defaultoptions = {
                defaultValue: 0,
                thousandSeparator: ',',
                fractionSeparator: '.',
            };

            options = util.extend(defaultoptions, options);
            regex = new RegExp('[^0-9' + options.fractionSeparator + ']', 'g');

            self.text.subscribe(processChange);
            self.value.subscribe(processChange);

            self.value(value || null);

            initial(self.value());
        }

        init();

        //#endregion
    }

    return Numeric;
});