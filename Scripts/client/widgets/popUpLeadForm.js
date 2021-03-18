mslc.define('client/widgets/popUpLeadForm',
    [
        'lib/ko'
        , 'lib/jQuery'
        , 'client/text'
        , 'client/controls/leadForm'

    ],
    function(ko, $, text, LeadForm) {
        'use strict';
        function PopUpLeadFormWidget() {
            //#region Private

            var leadForm,
                $modal;

            //#endregion

            //#region Public

            function show(data) {
                leadForm.update(data);

                $modal.modal('show');
                leadForm.trackLead('Open');
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
                $modal = $('#pop-up-lead-form');
                var node = $modal.get(0);
                leadForm = new LeadForm();

                leadForm.subscribeOnSubmit(function(success) {
                    if (success) {
                        hide();
                    }
                });

                ko.applyBindings(leadForm, node);

                $modal.on('hidden.bs.modal', function() {
                    leadForm.trackLead('Close');
                });
            }

            init();

            //#endregion

            return this;
        }

        return new PopUpLeadFormWidget();
    });
