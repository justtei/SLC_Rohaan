mslc.define('client/ui/hintsManager', ['lib/jQuery', 'client/ui/util', 'client/util'], function($, ui, util) {
    'use strict';

    function HintsManager() {
        //#region Private

        var hints = [];

        function closeAll() {
            util.foreach(hints, function($hint) {
                $hint.popover('hide');
            });
        }
        
        function closeAllExcept($exception) {
            util.foreach(hints, function($hint) {
                if ($hint !== $exception) {
                    $hint.popover('hide');
                }
            });
        }

        //#endregion

        //#region Public

        function applyHints() {
            var $hints = $('[data-hint]:not([data-handled])');

            function determinePosition() {
                if (window.innerWidth < 992) {
                    return 'bottom';
                }
                return 'right';
            }

            $hints.each(function() {
                var $elem = $(this),
                    template = $($elem.attr('data-hint')).html();

                $elem.attr('data-handled', true);

                $elem.popover({
                    html: true,
                    content: template,
                    placement: determinePosition,
                    trigger: 'click'
                });

                $elem.on('click', function(e) {
                    closeAllExcept($elem);
                    e.stopPropagation();
                });

                $elem.on('hidden.bs.popover', function() {
                    $(this).siblings('.popover').hide();
                });

                hints.push($elem);
            });
        }

        //#endregion

        //#region Interface

        this.apply = applyHints;

        //#endregion

        //#region Constructor

        function init() {
            $('body').on('click', closeAll);
            $(window).on('responseResize', closeAll);

            applyHints();
        }

        init();

        //#endregion

        return this;
    }

    return new HintsManager();
});