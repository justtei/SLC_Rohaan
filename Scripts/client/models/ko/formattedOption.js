mslc.define('client/models/ko/formattedOption',
    [
        'lib/ko'
        , 'client/models/ko/option'
        , 'client/util'
    ], function(ko, Option, util) {
        'use strict';

        function FormattedOption(data, formatter) {

            function buildFormattedText() {
                return data.selected() ? util.invoke(formatter, data.text) : data.text;
            }

            data = new Option(data);
            data.formatted = ko.computed(buildFormattedText);

            return data;
        }

        return FormattedOption;
    });