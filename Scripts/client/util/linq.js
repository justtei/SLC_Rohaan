mslc.define('client/util/linq', ['lib/ko', 'client/util/function'], function(ko, util) {
    'use strict';

    function map(array, constructor) {
        if (typeof constructor != 'function') {
            return null;
        }

        var result = ko.utils.arrayMap(array, function(item, ind) {
            return new constructor(item, ind);
        });

        return result;
    }

    function any(array, predicate) {
        if (typeof predicate != 'function') {
            predicate = util.returnTrue;
        }

        var firstItem = ko.utils.arrayFirst(array, predicate);

        return !!firstItem;
    }

    function first(array, predicate) {
        return ko.utils.arrayFirst(array, typeof predicate === 'function' ? predicate : util.returnTrue);
    }

    function last(array, predicate) {
        var func = typeof predicate === 'function' ? predicate : util.returnTrue;
        for (var i = array.length - 1, j = 0; i >= j; i++) {
            if (func(array[i], i)) {
                return array[i];
            }
        }
        return null;
    }

    function where(array, predicate) {
        var selected = [];

        ko.utils.arrayForEach(array, function(item) {
            if (predicate(item)) {
                selected.push(item);
            }
        });

        return selected;
    }

    function select(array, selector) {
        var selected = [];
        ko.utils.arrayForEach(array, function(item) {
            selected.push(selector(item));
        });
        return selected;
    }

    function selectProperty(array, properyName) {
        function selector(item) {
            return item[properyName];
        }

        return select(array, selector);
    }

    function isEqualFactory(propertyName, value) {
        return function(item) {
            //Don't use type comparison. We sholud compare numbers with theis string represents.
            return item[propertyName] == value;
        }
    }

    return {
        map: map
        , any: any
        , first: first
        , last: last
        , select: select
        , selectProperty: selectProperty
        , where: where
        , foreach: ko.utils.arrayForEach
        , isEqualFactory: isEqualFactory
    };
});