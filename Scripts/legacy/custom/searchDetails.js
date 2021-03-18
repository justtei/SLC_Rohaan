function preventDefaultEvent(e)
{
    e = e || window.event;
    if (e.preventDefault)
    {
        e.preventDefault();
    }
    else
    {
        // for ie
        e.returnValue = false;
    }
}

function showFullDescription(e)
{
    preventDefaultEvent(e);
    $('#shortDescription').hide();
    $('#fullDescription').show();
}
function hideFullDescription(e)
{
    preventDefaultEvent(e);
    $('#fullDescription').hide();
    $('#shortDescription').show();
}