mslc.resolve(
    [
        'lib/jQuery'
        , 'client/extends/ko'
        , 'client/extends/nanobar'
        , 'client/extends/alert'
        , 'client/extends/events'
        , 'client/ui/selectManager'
        , 'client/services/browser'
    ], function($, ko, nanobar, alert, events, selectManager, browser) {
        ko.extend();
        nanobar.extend();
        alert.extend();
        events.extend();
        $(document).ready(selectManager.apply);
        browser.applyFixes();
    });