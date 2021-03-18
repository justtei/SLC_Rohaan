var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function ()
{
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') + '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
})();

googletag.cmd.push(function ()
{
    googletag.defineSlot('/11762922/MLC_SLC_300x250', [300, 250], 'div-gpt-ad-1355770777438-0').addService(googletag.pubads())
        /*.setTargeting("country", googleAdTargetCountry)
        .setTargeting("state", googleAdTargetState)
        .setTargeting("city", googleAdTargetCity)*/;
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});

googletag.cmd.push(function ()
{
    googletag.defineSlot('/11762922/MLC_SLC_160x600', [160, 600], 'div-gpt-ad-1355770323094-0').addService(googletag.pubads())
        .setTargeting("country", googleAdTargetCountry)
        .setTargeting("state", googleAdTargetState)
        .setTargeting("city", googleAdTargetCity);
    googletag.pubads().enableSingleRequest();
    googletag.enableServices();
});

googletag.cmd.push(function ()
{
    googletag.display('div-gpt-ad-1355770777438-0');
    googletag.display('div-gpt-ad-1355770323094-0');
});