mslc.define('admin/util', ['lib/ko', 'lib/moment', 'admin/config'], function(ko, libMoment, config) {
    'use strict';

    function map(array, constructor) {
        if (typeof constructor != 'function') {
            return null;
        }

        var result = ko.utils.arrayMap(array, function(item) {
            return new constructor(item);
        });

        return result;
    }

    function any(array, predicate) {
        if (typeof predicate != 'function') {
            predicate = returnTrue;
        }

        var firstItem = ko.utils.arrayFirst(array, predicate);

        return !!firstItem;
    }

    function filter(array, predicate) {
        return ko.utils.arrayFilter(array, typeof predicate === 'function' ? predicate : returnTrue);
    }

    function select(array, selector) {
        var selected = [];

        ko.utils.arrayForEach(array, function(item) {
            selected.push(selector(item));
        });

        return selected;
    }

    function safeToString(obj) {
        var result = !isNullOrUndef(obj) ? obj.toString() : null;
        return result;
    }

    function safeSlice(str, start, end) {
        var result = null;
        
        if (!isNullOrEmpty(str)) {
            result = str.slice(start, end);
        }

        return result;
    }
    
    function stringFormat(str) {
        var args = Array.prototype.slice.call(arguments, 1);
        var result = str.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match;
        });
        
        return result;
    }

    function isNullOrUndef(val) {
        var result = typeof val === 'undefined' || val === null;
        return result;
    }

    function isNullOrEmpty(str) {
        var result = isNullOrUndef(str) || isString(str) && !str.trim().length;
        return result;
    }

    function valueOrUndef(val) {
        var result = val || undefined;
        return result;
    }

    function isString(val) {
        var result = typeof val === 'string';
        return result;
    }

    function moment(date) {
        var mDate = libMoment(date);
        
        if (!mDate.isValid()) {
            var serverFormat = config.setting('dateServerFormat').toUpperCase();
            var mDate = libMoment(date, serverFormat);
        }
        
        if (!mDate.isValid()) {
            var jsFormat = config.setting('dateJsFormat').toUpperCase();
            mDate = libMoment(date, jsFormat);
        }

        return mDate;
    }

    function applyValidationRules(properties) {
        ko.utils.arrayForEach(properties, function(property) {
            //checking order is important
            if (ko.isObservableArray(property)) {
                ko.utils.arrayForEach(property(), function(item) {
                    item.applyValidationRules();
                });
            } else {
                property.applyValidationRules();
            }
        });
    }

    function removeValidationRules(properties) {
        ko.utils.arrayForEach(properties, function(property) {
            //checking order is important
            if (ko.isObservableArray(property)) {
                ko.utils.arrayForEach(property(), function(item) {
                    item.removeValidationRules();
                });
            } else if (ko.isObservable(property)) {
                property.rules.removeAll();
            } else {
                property.removeValidationRules();
            }
        });
    }

    function getArrayData(array) {
        var result = select(array, function(item) {
            return item.getData();
        });

        return result;
    }

    return {
        map: map,
        any: any,
        filter: filter,
        foreach: ko.utils.arrayForEach,
        select: select,
        safeToString: safeToString,
        safeSlice: safeSlice,
        stringFormat: stringFormat,
        isNullOrUndef: isNullOrUndef,
        isNullOrEmpty: isNullOrEmpty,
        valueOrUndef: valueOrUndef,
        isString: isString,
        moment: moment,
        applyValidationRules: applyValidationRules,
        removeValidationRules: removeValidationRules,
        getArrayData: getArrayData
    };
});