function initOverlay()
{
    $('form').each(function ()
    {
        if ($(this).find('.submit-area input[type=submit]').length)
        {
            $(this).on('submit', function ()
            {
                if ($(this).valid())
                {
                    $('#overlay').show();
                }
            });
        }
    });
}

function initEditCommunityFormSubmit()
{
    var form = $('#editCommunityForm');
    var overlay = $('#overlay');
    form.find('.submit-area input[type=button]').on('click', function ()
    {
        overlay.show('fast', function ()
        {
            form.submit();
        });
    });
    form.on('submit', function ()
    {
        if ($(this).valid())
        {
            overlay.show();
        }
        else
        {
            overlay.hide();
        }
    });
}