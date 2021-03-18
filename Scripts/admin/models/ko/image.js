mslc.define('admin/models/ko/image', ['lib/ko', 'admin/util', 'admin/config'], function(ko, util, config) {
    'use strict';

    function Image(data) {
        var self = this;
        
        this.id = data.id;
        this.name = data.name;
        this.href = !util.isNullOrEmpty(data.url) ? data.url : null;
        this.src = !util.isNullOrEmpty(data.url) ? data.url : config.setting('emptyImageUrl');

        this.getData = function() {
            var result = {
                id: self.id,
                name: self.name
            };

            return result;
        };
    }

    return Image;
});