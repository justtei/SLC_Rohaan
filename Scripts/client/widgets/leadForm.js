mslc.define('client/widgets/leadForm',
    [
        'lib/ko'
        , 'client/util'
        , 'client/text'
        , 'client/widgets/notification'
        , 'client/widgets/popUpLeadForm'
        , 'client/controls/leadForm'
    ],
    function(ko, util, text, notification, popUpLeadForm, LeadForm) {
        'use strict';
        function LeadFormWidget() {

            //#region Private

            var inlineLeadForm,
                popUpSharedData;

            function getPrefilledMessage(address) {
                var message;

                if (typeof address !== "undefined") {
                    message = text.message('Txt_ListingLeadFormMessage').replace('{ListingAddress}', address);
                } else {
                    message = text.message('Txt_AgentLeadFormMessage');
                }

                return message;
            }

            function initLeadForm(idSelector, constructor) {
                var leadForm = document.getElementById(idSelector),
                   control = null,
                   args = Array.prototype.slice.call(arguments, 2);

                if (leadForm != null) {
                    control = constructor.apply({}, args);
                    ko.applyBindings(control, leadForm);
                }

                return control;
            }

            // TODO: review attr data resolving.
            function resolvePopUpData($button) {
                var result,
                    accessor = $button.data('accessor');
                
                if (accessor === 'attr') {
                    var inquiry = $button.data('inquiry'),
                        communityUnitId = $button.data('unitId'),
                        listingId = $button.data('listingId'),
                        listingName = $button.data('listingName'),
                        message = $button.data('message');

                    result = util.clone(popUpSharedData);
                    setIfPresent(result, 'inquiry', inquiry);
                    setIfPresent(result, 'listingId', listingId);
                    setIfPresent(result, 'listingName', listingName);
                    setIfPresent(result, 'communityUnitId', communityUnitId);
                    setIfPresent(result, 'message', message);
                } else {
                    var data = ko.dataFor($button.get(0));

                    if (data.hasOwnProperty('leadForm')
                        && !util.isNullOrUndef(data.leadForm)) {
                        result = data.leadForm;
                    } else {
                        result = data;
                    }
                }

                return result;
            }

            function setIfPresent(obj, property, value) {
                if (!util.isNullOrUndef(value)) {
                    obj[property] = value;
                }
            }
            
            //#endregion

            //#region Public

            function initInline(data) {
                return initLeadForm('inline-lead-form', LeadForm, data);
            }

            function initPopUpSharedData(data) {
                popUpSharedData = data;
            }

            //#endregion

            //#region Interface

            this.initInline = initInline;
            this.initPopUpSharedData = initPopUpSharedData;

            //#endregion

            //#region Constructor

            function init() {
                // TODO: review handler.
                $('body').on('click', 'button[data-toggle="lead-form"]', function() {
                    var data = resolvePopUpData($(this));

                    if (!util.isNullOrUndef(data)) {
                        popUpLeadForm.show(data);
                    } else {
                        notification.show({ success: false, message: text.message('ajaxRequestError') });
                    }
                });
            }

            init();
            //#endregion

            return this;
        }

        return new LeadFormWidget();
    });
