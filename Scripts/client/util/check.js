mslc.define('client/util/check', [], function() {
    'use strict';

    function isDefined(obj) {
        return typeof obj !== 'undefined';
    }

    function isNullOrEmpty(str) {
        return isNullOrUndef(str) || typeof str === 'string' && !str;
    }

    function isNullOrUndef(obj) {
        return isNull(obj) || typeof obj === 'undefined';
    }

    function isNumber(val) {
        return !isNaN(parseFloat(val)) && isFinite(val);
    }

    function isNull(obj) {
        return obj === null;
    }

    return {
         isNullOrEmpty: isNullOrEmpty
        , isNullOrUndef: isNullOrUndef
        , isNumber: isNumber
        , isNull: isNull
        , isDefined: isDefined
    };
});