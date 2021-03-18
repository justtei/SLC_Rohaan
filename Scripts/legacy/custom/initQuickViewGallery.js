function initQuickViewGallery()
{
    var gallery = $("#thumbs").quickViewGallery({
        animateDuration: 1000,
        intervalDuration: 3000,
        countSelector: "#numberCurrentImage"
    });

    $("#nextImage").click(function ()
    {
        gallery.next();
    });

    $("#previousImage").click(function ()
    {
        gallery.previous();
    });

    $("#firstImage").click(function ()
    {
        gallery.toFirst();
    });

    $("#lastImage").click(function ()
    {
        gallery.toLast();
    });

    $("#playGalleryImage").click(function ()
    {
        gallery.play();
        $("#playGalleryImage").hide();
        $("#pauseGalleryImage").show();
    });

    $("#pauseGalleryImage").click(function ()
    {
        gallery.pause();
        $("#playGalleryImage").show();
        $("#pauseGalleryImage").hide();
    });

    return gallery.refresh;
}