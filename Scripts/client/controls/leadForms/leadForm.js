mslc.define('client/controls/leadForm',
    [
          'lib/ko'
        , 'client/util'
        , 'client/text'
        , 'client/analytics/google'
        , 'client/util/subscriber'
        , 'client/services/remote'
        , 'client/widgets/notification'
        , 'client/controls/select'
        , 'client/models/ko/lead'
    ],
    function(ko, util, text, ga, Subscriber, remote, notification, Select, Lead) {
        'use strict';

        function LeadForm(data) {

            //#region Private

            var self = this,
                submitSubcriber;

            function getSelectOptions() {
                function formatCaption(txt) {
                    return 'I`m looking for ' + (txt);
                }

                return {
                    captionFormatter: formatCaption,
                    textFormatter: formatCaption,
                    stubText: null
                };
            }

            //#endregion

            //#region Public

            this.postLead = function(lead, processResponse) {
                self.isPendingRequest(true);

                remote.post.leadForm(lead, function(response) {
                    if (response.success) {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            'event': 'leadFormSuccess',
                            'formId': 'leadForm'
                        });

                        self.trackLead('Submit');
                        self.showConfirmation(true);
                    }

                    util.invoke(processResponse, response);
                    submitSubcriber.notify(response.success);

                    if (!response.success || !self.omitSuccesNotification) {
                        notification.show(response);
                    }
                }).fail(function(jqXhr, status) {
                    if (status !== 'abort') {
                        notification.show({success: false, message: text.message('ajaxRequestError')});
                    }
                }).always(function() {
                    self.isPendingRequest(false);
                });
            };

            this.onSubmit = function(model) {
                // TODO: hide;
                self.postLead(model);
            };

            this.submit = function() {
                if (self.errors().length) {
                    self.errors.showAllMessages();

                    return;
                }

                var model = ko.toJSON(self.lead);

                self.onSubmit(model);
            };

            this.trackLead = function(action) {
                var leadType = self.getLeadType(),
                    value = self.getLeadValue(),
                    leadData = self.getLeadData();

                ga.trackLead(action, leadType, value, leadData);
            };

            this.getLeadType = function() {
                var result;

                // TODO: review lead types.
                switch (self.lead.inquiry) {
                    case 3:
                    case 4:
                    case 5:
                        result = 'Community Unit';
                        break;
                    case 6:
                        result = 'Coupon';
                        break;
                    default:
                        result = 'Basic';
                }

                return result;
            };

            this.getLeadData = function() {
                var result = self.lead.inquiry === 2
                    ? {serviceProviderId: self.lead.listingId}
                    : {
                        communityId: self.lead.listingId,
                        communityUnitId: self.lead.communityUnitId
                    };

                result.bookNumber = self.lead.bookNumber;

                return result;
            };

            this.getLeadValue = function() {
                return 1;
            };

            this.update = function(data) {
                if (util.isNullOrUndef(data)) {
                    return;
                }

                self.lead.update(data);
                self.listingName(data.listingName);
                self.lookingForChoices.update(data.lookingForChoices, data.loookingFor);
                self.displayProperties(util.isDefined(data.displayProperties) ? data.displayProperties : {});
                self.showConfirmation(false);
            };

            this.subscribeOnSubmit = function(callback) {
                submitSubcriber.subscribe(callback);
            };

            //#endregion

            //#region Interface

            this.isPendingRequest = ko.observable();
            this.showConfirmation = ko.observable();

            this.listingName = ko.observable();
            this.displayProperties = ko.observable();
            this.lead = null;

            this.lookingForChoices = null;

            //#endregion

            //#region Constructor

            function initValidation() {
                self.errors = ko.validation.group(self.lead);
            }

            function init() {
                // TODO: review initial data.
                var initData = {customer: {}, lookingForChoices: []};

                self.isPendingRequest(false);
                self.showConfirmation(false);
                self.omitSuccesNotification = false;

                self.lookingForChoices = new Select(null, null, getSelectOptions());
                self.displayProperties({});
                self.lead = new Lead(initData);
                self.update(data);

                self.lookingForChoices.selected.value.subscribe(function(newValue) {
                    self.lead.lookingFor(newValue);
                });

                submitSubcriber = new Subscriber();

                initValidation();
            };

            init();

            //#endregion

            return this;
        }

        return LeadForm;
    });