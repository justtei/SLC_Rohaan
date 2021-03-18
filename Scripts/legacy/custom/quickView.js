function initializeQuickView(refreshGallery, getQuickViewCommunityUrl)
{
    window.quickView = QuickView(refreshGallery, getQuickViewCommunityUrl);
    ko.applyBindings(quickView.wizards, document.getElementById("quickViewModal"));
    return quickView;
}

function QuickView(refreshGallery, getQuickViewCommunityUrl)
{
    var disableBodyScroll = function()
    {
        if ($(document).height() > $(window).height())
        {
            var scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop();
            $('html').addClass('no-scroll').css('top', -scrollTop);
        }
    };

    var enableBodyScroll = function()
    {
        var scrollTop = parseInt($('html').css('top'));
        $('html').removeClass('no-scroll');
        $('html,body').scrollTop(-scrollTop);
    };
    var overlay = $('#quickViewOverlay');
    var modalWindow = $('#quickViewModal');
    var showBox = function(title)
    {
        modalWindow.dialog(
        {
            title: title,
            width: 800,
            modal: true,
            resizable: false,
            draggable: false,
            position: ['center', 50],
            show: { effect: 'fade', duration: 400 },
            hide: { effect: 'fade', duration: 400 },
            open: disableBodyScroll,
            close: enableBodyScroll
        });
    };

    /* ----------------------- Models ----------------------- */

    function Wizard(template, model)
    {
        var self = this;

        self.template = template;
        self.model = ko.observable(model);

        self.getTemplate = function()
        {
            return self.template;
        };
    }

    function GlobalModel()
    {
        var self = this;

        self.name = ko.observable();
        self.phone = ko.observable();
        self.address = ko.observable();
        self.detailsUrl = ko.observable();
        self.description = ko.observable();
        self.amenities = ko.observableArray();
        self.services = ko.observableArray();
        self.floorPlans = ko.observableArray();
        self.priceRange = ko.observable();
        self.bathrooms = ko.observable();
        self.bedrooms = ko.observable();
        self.livingSpace = ko.observable();
        self.currentFloorPlan = ko.observable();
        self.contactUsExploreStr = ko.observable();
        self.contactUsComments = ko.observable();
        self.currentLead = ko.observable('');
        self.getMoreInfoLead = null;
        self.checkAvailabilityLead = null;
        self.images = ko.observableArray();

        self.setTemplateWithLeadForm = function (template, leadData)
        {
            self.currentLead(leadData);
            wizards.setTemplate(template);
            initLeadFormValidation();
            customDatePicker('.lead-form');
        };

        self.contactUs = function (floorPlan)
        {
            self.setCurrentFloorPlan(floorPlan.Id);
            self.setTemplateWithLeadForm('contactUsTmpl', self.getMoreInfoLead);
        };

        self.viewLarge = function (floorPlan)
        {
            self.setCurrentFloorPlan(floorPlan.Id);
            wizards.setTemplate('floorPlanTmpl');
        };

        self.setCurrentFloorPlan = function(floorPlanId)
        {
            for (var i = 0; i < self.floorPlans().length; i++)
            {
                if (self.floorPlans()[i].Id === floorPlanId)
                {
                    self.currentFloorPlan(self.floorPlans()[i]);
                    return;
                }
            }
        };

        self.updateModel = function (data)
        {
            self.name(data.Name);
            self.phone(data.Phone);
            self.address(data.Address);
            self.description(data.Description);
            self.amenities(data.Amenities);
            self.services(data.Services);
            self.floorPlans(data.FloorPlans);
            self.detailsUrl(data.DetailsUrl);
            self.priceRange(data.PriceRange);
            self.bathrooms(data.Bathrooms);
            self.bedrooms(data.Bedrooms);
            self.livingSpace(data.LivingSpace);
            self.images(data.Images);
            self.contactUsExploreStr(data.ContactUsExploreStr);
            self.contactUsComments(data.ContactUsComments);
            self.getMoreInfoLead = data.GetMoreInfoLead;
            self.checkAvailabilityLead = data.CheckAvailabilityLead;
        };
    }

    var globalModel = new GlobalModel();

    var stepModels = new Array();
    stepModels['quickViewTmpl'] = new Wizard('quickViewTmpl', globalModel);
    stepModels['floorPlansTmpl'] = new Wizard('floorPlansTmpl', globalModel);
    stepModels['floorPlanTmpl'] = new Wizard('floorPlanTmpl', globalModel);
    stepModels['contactUsTmpl'] = new Wizard('contactUsTmpl', globalModel);
    stepModels['quickViewContactTmpl'] = new Wizard('quickViewContactTmpl', globalModel);

    var wizards =
    {
        getTemplate: function()
        {
            return wizards.currentStep().template();
        },
        stepModels: stepModels,
        currentStep: ko.observable(new Wizard('emptyTmpl', { })),
        setTemplate: function(name)
        {
            var newTemplate = wizards.stepModels[name];
            wizards.currentStep(newTemplate);
        },
        close: function () 
        {
            modalWindow.dialog('close');
        },
        refreshGallery: refreshGallery
    };

    /* ----------------- Change wizard functionality ----------------- */

    var propertyDataCache = [];

    var showWizard = function (communityId, searchType, templateName, titlePrefix)
    {
        overlay.show();

        var data = propertyDataCache[communityId];

        if (data)
        {
            globalModel.updateModel(data);
            wizards.setTemplate(templateName);
            overlay.hide();
            showBox(titlePrefix + data.Name);
        }
        else
        {
            $.ajax(
            {
                type: 'GET',
                dataType: 'json',
                url: getQuickViewCommunityUrl,
                data: { communityId: communityId, searchType: searchType },
                context: this,
                success: function (result)
                {
                    result = result.communityDetails;
                    propertyDataCache[communityId] = result;
                    globalModel.updateModel(result);
                    wizards.setTemplate(templateName);
                    overlay.hide();
                    showBox(titlePrefix + result.Name);
                },
                error: function ()
                {
                    overlay.hide();
                    showMessage(false);
                }
            });
        }
    };

    /* ----------------- Show quick views functions ----------------- */

    var showQuickView = function(communityId, searchType)
    {
        showWizard(communityId, searchType, 'quickViewTmpl', '');
    };

    var showFloorPlans = function (communityId, searchType)
    {
        showWizard(communityId, searchType, 'floorPlansTmpl', 'Floor Plans for ');
    };

    var submitQuickViewLeadForm = function (nextTemplate)
    {
        var form = $(this);
        var submitButton = form.find('input[type=submit]');

        function enableSubmitButton()
        {
            submitButton.prop('disabled', false);
            submitButton.removeClass('button-loading');
        }

        if (form.valid())
        {
            submitButton.prop('disabled', true);
            submitButton.addClass('button-loading');

            var data = getLeadFormData(form);

            $.ajax(
            {
                type: 'GET',
                dataType: 'json',
                url: form.attr('action'),
                data: data,
                success: function (result)
                {
                    showMessage(result.success, 'Your information has been added. Thank you', result.message);
                    enableSubmitButton();

                    if (result.success)
                    {
                        clearLeadForm(form);
                        wizards.setTemplate(nextTemplate);
                    }
                    
                    if ($.browser.msie)
                    {
                        var inputs = form.find('input[placeholder], textarea[placeholder]');
                        inputs.placeholder();
                    }
                },
                error: function ()
                {
                    showMessage(false);
                    enableSubmitButton();

                    if ($.browser.msie)
                    {
                        var inputs = form.find('input[placeholder], textarea[placeholder]');
                        inputs.placeholder();
                    }
                }
            });
        }
    };

    var initLeadFormValidation = function ()
    {
        var form = $('#quickViewLeadForm .lead-form');
        form.validate();
        form.find('#LeadForm_ConsumerFullName').rules('add',
        {
            required: true,
            maxlength: 100,
            messages:
            {
                required: "'Name' is required",
                minlength: "'Name' must be a string with a maximum length of 100."
            }
        });
        form.find('#LeadForm_ConsumerEmail').rules('add',
        {
            required: true,
            maxlength: 100,
            email: true,
            messages:
            {
                required: "'Email' is required",
                maxlength: "'Email' must be a string with a maximum length of 100.",
                email: 'Invalid email format'
            }
        });
        form.find('#LeadForm_ConsumerPhone').rules('add',
        {
            maxlength: 20,
            messages:
            {
                maxlength: "'Phone' must be a string with a maximum length of 20."
            }
        });
        form.find('#LeadForm_ConsumerMessage').rules('add',
        {
            maxlength: 800,
            messages:
            {
                maxlength: "'Phone' must be a string with a maximum length of 800."
            }
        });

        var moveInDate = form.find('#LeadForm_ConsumerMoveInDate');
        var datepickerOptions = getDatepickerOptions();
        
        var inputs = form.find('input[placeholder], textarea[placeholder]');
        if ($.browser.msie)
        {
            inputs.placeholder();
            inputs.on('change', changeIsPlaceholderStatusInIE);

            var submitButton = form.find('input[type=submit]');
            submitButton.on('click', function ()
            {
                clearPlaceholdersInIE(form);
            });

            datepickerOptions.onSelect = changeIsPlaceholderStatusInIE;
            moveInDate.datepicker(datepickerOptions);
        }
        else
        {
            moveInDate.datepicker(datepickerOptions);
        }
        inputs.first().focus();
    };

    return {
            wizards: wizards,
            showQuickView: showQuickView,
            showFloorPlans: showFloorPlans,
            submitQuickViewLeadForm: submitQuickViewLeadForm
        };
};

var disableBodyScroll = function ()
{
    if ($(document).height() > $(window).height())
    {
        var scrollTop = ($('html').scrollTop()) ? $('html').scrollTop() : $('body').scrollTop();
        $('html').addClass('no-scroll').css('top', -scrollTop);
    }
};

var enableBodyScroll = function ()
{
    var scrollTop = parseInt($('html').css('top'));
    $('html').removeClass('no-scroll');
    $('html,body').scrollTop(-scrollTop);
};

$('.target').change(function ()
{
    alert('Handler for .change() called.');
});

var changeIsPlaceholderStatusInIE = function ()
{
    if (this.value.length > 0)
    {
        this.setAttribute('isplaceholder', 'false');
        $(this).removeClass('placeholder');
    }
    else
    {
        this.setAttribute('isplaceholder', 'true');
        $(this).addClass('placeholder');
    }
};

var clearPlaceholdersInIE = function(form)
{
    var emptyInputs = form.find('[isPlaceholder="true"]');
    emptyInputs.each(function() {
        this.value = '';
    });
};