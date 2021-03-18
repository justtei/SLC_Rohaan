mslc.define('admin/models/ko/seoMetadata', ['lib/ko'], function(ko) {
    'use strict';

    function SeoMetadata(data) {
        this.metaDescription = ko.observable(data.metaDescription);
        this.metaKeywords = ko.observable(data.metaKeywords);
        this.seoCopyText = ko.observable(data.seoCopyText);
    }

    return SeoMetadata;
});