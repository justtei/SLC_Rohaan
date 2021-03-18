mslc.define('client/services/browser', ['lib/jQuery'], function($) {
    'use strict';

    var ua = window.navigator.userAgent.toLowerCase(),
        isOldIe = (ua.indexOf('msie') != -1) && (parseInt(ua.split('msie')[1]) < 10),
        isIe = ua.indexOf("msie") != -1 || ua.indexOf('trident/') != -1;

    function applyFixes() {
        var body = document.getElementsByTagName("body")[0];
        if (isOldIe) {
            body.className += " old-ie-fix";
        }
    }
    return {
        applyFixes: applyFixes,
        isIe: isIe,
        isOldIe: isOldIe
    };
});