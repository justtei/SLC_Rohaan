mslc.define('client/services/location', [], function() {
    'use strict';

    function Location() {

        var self = this;

        function concatUrl() {
            var args = Array.prototype.slice.call(arguments);
            return args.join('/');
        }

        function absoluteUrl(relativeUrl) {
            return concatUrl(self.origin, relativeUrl);
        }

        function go(newUrl) {
            window.location.href = newUrl;
        }

        function goNewWindow(newUrl) {
            window.open(newUrl);
        }

        function goNewTab(newUrl) {
            var a = document.createElement('a');
            a.href = newUrl;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
        }

        this.protocol = null;
        this.host = null;
        this.port = null;
        this.origin = null;
        this.pathname = null;
        this.search = null;
        this.absolute = null;
        this.go = null;
        this.goWindow = null;
        this.goTab = null;

        function init() {
            var loc = window.location;
            self.protocol = loc.protocol.replace(':', '');
            self.host = loc.hostname;
            self.port = loc.port;
            self.origin = loc.origin;
            self.pathname = loc.pathname;
            self.search = loc.search;

            self.absolute = absoluteUrl;
            self.concat = concatUrl;
            self.go = go;
            self.goTab = goNewTab;
            self.goWindow = goNewWindow;
        }

        init();

        return this;
    }

    return new Location();
});