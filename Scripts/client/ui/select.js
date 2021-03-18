mslc.define('client/ui/selectManager', ['lib/jQuery', 'client/ui/util', 'client/util'], function($, ui, util) {
    'use strict';

    function UiSelectManager() {
        //#region Private

        var selects = [];

        function closeAll() {
            util.foreach(selects, function(select) {
                ui.animateToggle(select.$target, false);
                select.$elem.toggleClass('active', false);
            });
        }

        function closeAllExcept($exception) {
            util.foreach(selects, function(select) {
                if (select.$target !== $exception) {
                    ui.animateToggle(select.$target, false);
                    select.$elem.toggleClass('active', false);
                }
            });
        }

        //#endregion

        //#region Public

        function applySelect() {
            $('[data-select="single"]:not([data-handled]), [data-select="multi"]:not([data-handled])')
                .each(function(ind, elem) {
                    var $elem = $(elem),
                        $caption = $elem.find('[data-select="caption"]'),
                        $target = $elem.find('[data-select="target"]');

                    $elem.attr('data-handled', true);

                    $caption.on('click', function() {
                        ui.animateToggle($target);
                        $elem.toggleClass('active');
                    });

                    if ($elem.attr('data-select') === 'single') {
                        $target.on('click', function() {
                            ui.animateToggle($target, false);
                            $elem.toggleClass('active');
                        });
                    }

                    $elem.on('click', function(e) {
                        closeAllExcept($target);
                        e.stopPropagation();
                    });

                    selects.push({
                        $elem: $elem,
                        $caption: $caption,
                        $target: $target
                    });
                });
        }

        //#endregion

        //#region Interface

        this.apply = applySelect;

        //#endregion

        //#region Constructor

        function init() {
            $('body').on('click', function(e) {
                closeAll(selects);

                util.foreach(selects, function(obj) {
                    util.trigger(obj.$elem, 'outerClick', e);
                });
            });

            applySelect();
        }

        init();

        //#endregion

        return this;
    }

    return new UiSelectManager();
});