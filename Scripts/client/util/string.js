mslc.define('client/util/string', [], function() {

    function format(str) {
        var args = Array.prototype.slice.call(arguments, 1);
        return str.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };

    function concat() {
        var args = Array.prototype.slice.call(arguments);
        return args.join();
    }

    function join(delimiter) {
        var args = Array.prototype.slice.call(arguments, 1);
        return args.join(delimiter);
    }

    function substringWithEllipsis(string, maxLen) {
        if (!string) {
            return null;
        }
        var resultLength = Math.min(string.length, maxLen);
        if (resultLength === maxLen) {
            return string.substr(0, resultLength - 1) + '...';
        }
        return string;
    }
    
    function startsWith(str, comparison, ignoreCase) {
        var testedStr;
        var strToCompare;

        if (ignoreCase) {
            testedStr = str.toLowerCase();
            strToCompare = comparison.toLowerCase();
        } else {
            testedStr = str;
            strToCompare = comparison;
        }

        var result = testedStr.indexOf(strToCompare) === 0;

        return result;
    }

    function safeToLowerCase(string) {
        var result = string ? string.toLowerCase() : string;
        return result;
    }

    return {
        format: format
        , concat: concat
        , join: join
        , substringWithEllipsis: substringWithEllipsis
        , startsWith: startsWith
        , safeToLowerCase: safeToLowerCase
    };
});