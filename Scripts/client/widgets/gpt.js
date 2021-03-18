mslc.define('client/widgets/googlePublisherTag', [], function() {
    'use strict';

    function GooglePublisherTag() {
        //#region Public
        
        function initSearchResultsSlots(params) {
            googletag.cmd.push(function() {
                googletag.defineSlot('/11762922/MLC_SLC_300x250', [300, 250], 'div-gpt-ad-1355770777438-0')
                    .addService(googletag.pubads())
                    .setTargeting("country", params.country)
                    .setTargeting("state", params.state)
                    .setTargeting("city", params.city)
                    .setCollapseEmptyDiv();

                googletag.defineSlot('/11762922/MLC_SLC_160x600', [160, 600], 'div-gpt-ad-1355770323094-0')
                    .addService(googletag.pubads())
                    .setTargeting("country", params.country)
                    .setTargeting("state", params.state)
                    .setTargeting("city", params.city)
                    .setCollapseEmptyDiv();

                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
            });

            googletag.cmd.push(function() {
                googletag.display('div-gpt-ad-1355770777438-0');
            });

            googletag.cmd.push(function() {
                googletag.display('div-gpt-ad-1355770323094-0');
            });
        };

        function initDetailsSlots(params) {
            googletag.cmd.push(function() {
                googletag.defineSlot('/11762922/MLC_SLC_160x600', [160, 600], 'div-gpt-ad-1355770323094-0')
                    .addService(googletag.pubads())
                    .setTargeting("country", params.country)
                    .setTargeting("state", params.state)
                    .setTargeting("city", params.city)
                    .setCollapseEmptyDiv();

                googletag.pubads().enableSingleRequest();
                googletag.enableServices();
            });

            googletag.cmd.push(function() {
                googletag.display('div-gpt-ad-1355770323094-0');
            });
        };
        
        //#endregion

        //#region Interface
        
        this.initSearchResultsSlots = initSearchResultsSlots;
        this.initDetailsSlots = initDetailsSlots;
        
        //#endregion

        //#region Constructor

        function init() {
            var gads = document.createElement('script'),
            useSsl = document.location.protocol === 'https:' ? true : false;

            window.googletag = {};
            window.googletag.cmd = [];

            gads.async = true;
            gads.type = 'text/javascript';
            gads.src = (useSsl ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';

            var node = document.getElementsByTagName('script')[0];
            node.parentNode.insertBefore(gads, node);
        }

        init();
        
        //#endregion

        return this;
    };

    return new GooglePublisherTag();
});
