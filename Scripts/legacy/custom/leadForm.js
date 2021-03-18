function showLeadDialog(sender, modalDialog)
{
    var communityId = $(sender).parents('section#buttons').attr('data-community-id');
    modalDialog.find('form input[name*=ListingId]').val(communityId);

    modalDialog.dialog({
        width: 335,
        modal: true,
        resizable: false,
        title: 'Contact information',
        show: { effect: "fade", duration: 400 },
        hide: { effect: "fade", duration: 400 },
        close: function ()
        {
            closeLeadForm(this);
        }
    });
}

function showBrochureLeadForm()
{
    showLeadDialog(this, $('#brochureLeadForm'));
}

function showInfoLeadForm()
{
    showLeadDialog(this, $('#infoLeadForm'));
}

function showCouponLeadForm() {
    var modalDialog = $('#couponLeadForm');

    modalDialog.dialog({
        width: 800,
        modal: true,
        resizable: false,
        title: $('section#description .coupon-title').text(),
        show: { effect: "fade", duration: 400 },
        hide: { effect: "fade", duration: 400 },
        close: function () {
            closeLeadForm(this);
        }
    });
}

function submitLeadForm ()
{
    var form = $(this);
    function showSubmitResult(success, errorMessage)
    {
        $('.ui-dialog-content:visible').dialog('close');
        showMessage(success, 'Your information has been added. Thank you', errorMessage);
    }

    var submitButton = form.find('input[type=submit]');

    function enableSubmitButton()
    {
        submitButton.prop('disabled', false);
        submitButton.removeClass('button-loading');
    }
    
    function sendCoupon(email, name) {
        if (form.parents("#couponLeadForm").length == 0)
            return;
        data = {
            email: email,
            name: name,
            printCouponUrl: $("#print-coupon").attr("href")
        };
        var url = $("#email-coupon").data("send-url");
        $.get(url, data).done(function(result) {
            if (!result.success) {
	            showSubmitResult(result.success, result.message);
            }
        }).fail(function() {
	        showSubmitResult(false, "Unable to send coupon. Please, try again later.");
        });
    }

    if (form.valid())
    {
        submitButton.prop('disabled', true);
        submitButton.addClass('button-loading');

        var data = getLeadFormData(form);
        
        $.get(form.attr('action'), data).done(function (result)
        {
            if (result.success) {
                sendCoupon(data.ConsumerEmail, data.ConsumerFullName);
                clearLeadForm(form);
            }
            enableSubmitButton();
            showSubmitResult(result.success, result.message);
        }).fail(function ()
        {
            enableSubmitButton();
            showSubmitResult(false);
        });
    }
    // prevent default behaviour
    return false;
}
var getLeadFormData = function(form)
{
    var data =
    {
        ListingId: form.find('[name*=ListingId]').val(),
        LeadEvent: form.find('[name*=LeadEvent]').val(),
        LeadBrand: form.find('[name*=LeadBrand]').val(),
        LeadPage: form.find('[name*=LeadPage]').val(),
        ConsumerFullName: form.find('[name*=ConsumerFullName]').val(),
        ConsumerEmail: form.find('[name*=ConsumerEmail]').val(),
        ConsumerMoveInDate: form.find('[name*=ConsumerMoveInDate]').val(),
        ConsumerPhone: form.find('[name*=ConsumerPhone]').val(),
        LookingFor: form.find('[name*=LookingFor]').val(),
        ConsumerMessage: form.find('[name*=ConsumerMessage]').val()
    };
    return data;
};
function closeLeadForm(dialog)
{
    //reset validation
    var form = $(dialog).find("form");
    if (form)
    {
        form.validate().resetForm();
        var errormessages = form.find(".field-validation-error");
        errormessages.empty();
        errormessages.addClass("field-validation-valid");
        errormessages.removeClass("field-validation-error");
        clearLeadForm(form);
    }
}
function clearLeadForm(leadForm)
{
    //clear inputs
    var inputs = $(leadForm).find("textarea, input[type=text]");
    var selects = $(leadForm).find("select");
    var clearInputs = $.browser.msie ? inputs.not(".placeholder") : inputs;
    if (clearInputs) 
    {
        clearInputs.val("");
    }

    if (selects)
    {
        selects.find("option:first").attr("selected", "selected");
    }

    if ($.browser.msie)
    {
        inputs.placeholder();
    }
}

function showMessage(success, successMessage, errorMessage)
{
    var modalWindow = $('#ajaxResponse');
    var title, message;
    if (!success)
    {
        errorMessage = errorMessage || 'Sorry, an error occurred while processing your request.';
        message = '<span class="server-error">' + errorMessage + '</span>';
        title = 'Error';
    }
    else
    {
        message = successMessage;
        title = 'Result';
    }
    modalWindow.html(message);
    modalWindow.dialog(
    {
        height: 180,
        width: 350,
        modal: true,
        resizable: false,
        title: title,
        show: { effect:"fade", duration: 400},
        hide: { effect: "fade", duration: 400 },
        buttons:
        {
            'Ok': function ()
            {
                $(this).dialog('close');
            }
        }
    });
}