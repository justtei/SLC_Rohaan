mslc.define('client/widgets/popUpCommunityUnit',
    [
        'lib/ko'
        , 'lib/jQuery'
        , 'client/text'
        , 'client/controls/communityUnit'

    ],
    function(ko, $, text, CommunityUnit) {
        'use strict';
        function PopUpCommunityUnit() {
            //#region Private

            var unit,
                $modal;

            //#endregion

            //#region Public

            function show(data) {
                unit.update(data);

                $modal.modal('show');
                unit.leadForm.trackLead('Open');
            }

            function hide() {
                $modal.modal('hide');
            }

            //#endregion

            //#region Interface

            this.show = show;
            this.hide = hide;

            //#endregion

            //#region Constructor

            function init() {
                $modal = $('#pop-up-community-unit');
                $modal.on('shown.bs.modal', function() {
                    //We reapply changes to photoTour because html is hidden
                    //while pop up isn't brought up.
                    unit._tour.recalculate();
                });
                var node = $modal.get(0);
                unit = new CommunityUnit();

                unit.leadForm.subscribeOnSubmit(function(success) {
                    if (success) {
                        hide();
                    }
                });

                ko.applyBindings(unit, node);
                
                $modal.on('hidden.bs.modal', function() {
                    unit.leadForm.trackLead('Close');
                });
            }

            init();

            //#endregion

            return this;
        }

        return new PopUpCommunityUnit();
    });
