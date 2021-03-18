var googleMap = null;

$(function ()
{
    googleMap = new GoogleMap(0, 0, '', '');
    ko.applyBindings(googleMap, document.getElementById("mapViewModal"));
    $('.show-map-modal').on('click', showGoogleMapModal);
});

function showGoogleMapModal()
{
    var lon = $(this).attr('data-lon');
    var lat = $(this).attr('data-lat');
    var print = $(this).attr('data-print');
    var name = $(this).parent().parent().parent().prev().children('#listinginfo').children('h1').children('a').text();
    var address = $(this).parent().parent().parent().prev().children('#listinginfo').children('h2').text();
    $('#mapViewModal').dialog({
        width: 750,
        modal: true,
        draggable: false,
        resizable: false,
        title: 'Map & Directions for ' + name,
        position: ['center', 50],
        show: { effect: "fade", duration: 400 },
        hide: { effect: "fade", duration: 400 },
        open: function ()
        {
            googleMap.updateMap(lat, lon, address, name, print);
            disableBodyScroll();
        },
        close: enableBodyScroll
    });
}