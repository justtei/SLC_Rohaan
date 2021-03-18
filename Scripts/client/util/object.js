mslc.define('client/util/object', [], function() {
    'use strict';

    function extend(source, target) {
        source = source || {};
        for (var prop in target) {
            if (target.hasOwnProperty(prop)) {
                var value = target[prop];
                if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
                    source[prop] = extend(source[prop], target[prop]);
                } else {
                    source[prop] = target[prop];
                }
            }
        }
        return source;
    }

    function compare(a, b) {
        return JSON.stringify(a) == JSON.stringify(b);
    }

    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    return {
        extend: extend
        , clone: clone
        , compare: compare
    };
});