$(function ()
{
    initImageSlideShow(".slide-show-container a.slide-show-item");

    $(".slide-show-open").on("click", function ()
    {
        openImageSlideShow(this);
        return false;
    });
});

function initImageSlideShow(selector)
{
    var container = $(selector);
    if (container)
    {
        container.fancybox({
            type: 'image',
            cyclic: true,
            titleFormat: function (title, currentArray, currentIndex, currentOpts)
            {
                var index = currentIndex + 1;
                return index + " / " + currentArray.length + " Images";
            },
        });
    }
}

function openImageSlideShow(el)
{
    var imageContainer = $(el).closest("figure").find(".slide-show-container");
    if (imageContainer && imageContainer.length > 0)
    {
        var firstImage = imageContainer.find("a.slide-show-item:first");
        if (firstImage && firstImage.length > 0)
        {
            firstImage.click();
        }
    }
}

