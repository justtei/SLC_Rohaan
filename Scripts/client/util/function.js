mslc.define('client/util/function', [], function() {
    'use strict';

    function invoke(fun) {
        var args = Array.prototype.slice.call(arguments, 1);
        return typeof fun === 'function' ? fun.apply(fun, args) : null;
    }

    function invokeAsync(fun) {
        var args = Array.prototype.slice.call(arguments, 1);
        if (typeof fun === 'function') {
            window.setTimeout(function() {
                fun.apply(fun, args);
            }, 0);
        }
    }

    function call(context, fun) {
        var args = Array.prototype.slice.call(arguments, 2);
        return typeof fun === 'function' ? fun.apply(context, args) : null;
    }

    function returnTrue() {
        return true;
    }

    function returnFalse() {
        return false;
    }

    function extendClass(Child, Parent) {
        var F = new Function();
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child;
        Child.base = Parent.prototype;
    }

    return {
        invoke: invoke
        , invokeAsync: invokeAsync
        , call: call
        , returnTrue: returnTrue
        , returnFalse: returnFalse
        , extendClass: extendClass
    };
});