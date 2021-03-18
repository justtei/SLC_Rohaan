mslc.define('client/util',
    [
        'lib/jQuery'
        , 'client/util/check'
        , 'client/util/event'
        , 'client/util/format'
        , 'client/util/function'
        , 'client/util/linq'
        , 'client/util/number'
        , 'client/util/object'
        , 'client/util/string'
    ],
    function( $, check, event, format, func, linq, number, obj, string) {
        return $.extend(check, event, format, func, linq, number, obj, string);
    });