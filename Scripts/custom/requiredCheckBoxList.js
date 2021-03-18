/// <reference path="~/Scripts/jquery/jquery-1.8.2-vsdoc.js" />
/// <reference path="~/Scripts/jquery/jquery.validate-vsdoc.js" />
/// <reference path="~/Scripts/jquery/jquery.validate.unobtrusive.js" />

$.validator.addMethod('requiredcheckboxlist', function (value, element)
{
    var checkboxList = $(element).closest('.checkbox-list');
    var errorMessage = $(checkboxList).siblings('.checkbox-list-error-message').find('[data-valmsg-for]');
    if (!$(checkboxList).find('input:checkbox:checked').length)
    {
        $(checkboxList).addClass('input-validation-error');
        errorMessage.removeClass('field-validation-valid');
        errorMessage.addClass('field-validation-error');
        var errorMessageValue = $(checkboxList).find('[data-val-requiredcheckboxlist]').attr('data-val-requiredcheckboxlist');
        errorMessage.html(errorMessageValue);
        return false;
    }
    else
    {
        removeValidationErrors($(checkboxList).parent());
        return true;
    }
});

$.validator.unobtrusive.adapters.add('requiredcheckboxlist', function (options)
{
    options.messages['requiredcheckboxlist'] = options.message;
    options.rules['requiredcheckboxlist'] = options.params;
});

function initRequiredCheckboxListValidation()
{
    $('[data-val-requiredcheckboxlist]').closest('.checkbox-list').find('input[type=checkbox]').on('change', function ()
    {
        $.validator.methods.requiredcheckboxlist($(this).val(), this);
    });
}

function removeValidationErrors(selector)
{
    $(selector).find('.input-validation-error').each(function ()
    {
        $(this).removeClass('input-validation-error');
    });
    $(selector).find('.field-validation-error').each(function ()
    {
        $(this).removeClass('field-validation-error');
        $(this).html('');
        $(this).add('field-validation-valid');
    });
}