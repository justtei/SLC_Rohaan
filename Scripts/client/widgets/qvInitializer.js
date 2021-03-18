mslc.define('client/widgets/qvInitializer',
    [
          'lib/ko'
        , 'lib/jQuery'
        , 'client/util'
        , 'client/widgets/quickView'
    ],
    function(ko, $, util, QuickView) {
        'use strict';

        function createQvBindings(searchType, paramName) {
            var $qvControls = $('[data-qv]'),
                tabContainer = $('#qv-widget').html();
            $qvControls.each(function(ind, elem) {
                function handleFirstTabClick(e) {
                    $tabs.off('click', handleFirstTabClick);
                    var communityData = { searchType: searchType },
                        //TODO: Use dataset instead getAttribute when ie 10 will be depricated
                        action = e.target.getAttribute('data-qv-action');

                    communityData[paramName] = $elem.data('qv');
                    $elem.append(tabContainer);

                    var qv = new QuickView(communityData);
                    ko.applyBindings(qv, $elem[0]);
                    util.invoke(qv.tabs(action));
                }

                var $elem = $(elem),
                    $tabs = $elem.find('[data-qv-action]');
                $tabs.on('click', handleFirstTabClick);
            });
        }

        return createQvBindings;
    });