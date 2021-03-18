mslc.define('client/util/event', ['lib/jQuery'], function($) {
    'use strict';

    function addEventHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }

    function removeEventHandler(element, type, handler) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    }

    function trigger(target, type, inner) {
        $(target).trigger({
            type: type,
            innerEvent: inner
        });
    }

    return {
        removeEventHandler: removeEventHandler
        , addEventHandler: addEventHandler
        , trigger: trigger
    };
});