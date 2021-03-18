mslc.define('client/controls/autocomplete', ['lib/ko'], function(ko) {
    'use strict';

    function Autocomplete() {
        var self = this;

        this.list = ko.observableArray();
        this.index = ko.observable(-1);

        this.length = ko.computed(function() {
            var result = self.list().length;
            return result;
        });

        this.current = ko.computed(function() {
            var result = null;

            if (self.index() >= 0) {
                result = self.list()[self.index()];
            }

            return result;
        });

        this.update = function(newList) {
            self.index(-1);
            self.list(newList);
        };

        this.clear = function() {
            self.list.removeAll();
        };

        this.next = function() {
            if (self.length()) {
                if (self.index() >= self.length() - 1) {
                    self.index(0);
                } else {
                    self.index(self.index() + 1);
                }
            }
        };

        this.prev = function() {
            if (self.length()) {
                if (self.index() <= 0) {
                    self.index(self.length() - 1);
                } else {
                    self.index(self.index() - 1);
                }
            }
        };

        this.select = function(index) {
            self.index(index);
        };
    }

    return Autocomplete;
})