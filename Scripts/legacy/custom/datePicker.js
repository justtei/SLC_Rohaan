function customDatePicker(selector)
{
    var datepickerOptions = getDatepickerOptions();
    var allDatepickers = $(selector).find('.date-picker');
    //disable textbox editing
    allDatepickers.on('keydown', function ()
    {
        return false;
    });
    allDatepickers.on('paste', function ()
    {
        return false;
    });
    if (!$.browser.msie)
    {
        allDatepickers.removeClass('hasDatepicker').datepicker(datepickerOptions);
    }
    else
    {
        allDatepickers.each(function ()
        {
            $(this).removeClass('hasDatepicker');
            // bug: do not place placeholder on datepicker input with [data-bind] attribute
            if ($(this).attr('placeholder') && !$(this).attr('data-bind'))
            {
                datepickerOptions.onSelect = function ()
                {
                    $(this).removeClass('placeholder');
                };
                allDatepickers.removeClass('hasDatepicker').datepicker(datepickerOptions);
            }
            else
            {
                delete datepickerOptions.onSelect;
                allDatepickers.removeClass('hasDatepicker').datepicker(datepickerOptions);
            }
        });
    }
}

function getDatepickerOptions()
{
    return {
        showAnim: 'clip',
        changeMonth: true,
        changeYear: true,
        showOtherMonths: true,
        selectOtherMonths: true,
        dateFormat: window.dateFormat
    };
};
