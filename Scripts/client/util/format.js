mslc.define('client/util/format', ['client/util/string', 'client/util/check'], function(string, check) {
    'use strict';

    var defMaxSingleAmenitieLen = 25
        , defStubTxt = 'Any'
        , defMultiFormat = '{0} and {1} more';

    function formatListCaption(txts, length, format) {
        if (!txts || !txts.length) {
            return null;
        }
        format = format || defMultiFormat;
        var count = txts.length
            , maxSingle = length || defMaxSingleAmenitieLen
            , maxMulti = maxSingle - format.length + format.match(/{/g).length * 3;//3 symbols used for placeholder '{n}'
        return count === 1
            ? string.substringWithEllipsis(txts[0], maxSingle)
            : string.format(format, string.substringWithEllipsis(txts[0], maxMulti), count - 1);
    }

    function formatSelectFactory(entityName, stubTxt) {
        function formatText(txt) {
            if (isNaN(parseInt(txt))) {
                return txt;
            }
            return txt + '+ ' + entityName;
        }

        function formatCaption(txt) {
            var stub = stubTxt || defStubTxt;
            if (txt === stub) {
                return entityName;
            }
            return formatText(txt);
        }

        return {
            captionFormatter: formatCaption,
            textFormatter: formatText
        };
    }

    function formatMultiFactory(maxLength, format) {
        function formatCaption(txt) {
            return formatListCaption(txt, maxLength, format);
        }

        return {
            captionFormatter: formatCaption,
        };
    }

    function formatPriceString(number) {
        if (check.isNull(number)) {
            return null;
        }
        return '$' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return {
        listCaption: formatListCaption
        , selectFactory: formatSelectFactory
        , multiFactory: formatMultiFactory
        , price: formatPriceString
    };
});