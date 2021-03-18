$(function () {
    initImageGallery();
});

function initImageGallery() {
    if ($("#thumbs ul li").length > 0) {
        var gallery = $("#thumbs").galleriffic({
            imageContainerSel: '#slideshow',
            numThumbs: 3,
            preloadAhead: -1,
            renderSSControls: false,
            renderNavControls: false,
            enableBottomPager: false,
            enableKeyboardNavigation: false,
            onSlideChange: function(prevIndex, nextIndex) {
                changeCountImagesText(this, nextIndex);
                this.$imageContainer.empty();
            }
        });

        $("#nextImage").click(function() {
            gallery.next(false, false);
        });

        $("#previousImage").click(function() {
            gallery.previous(false, false);
        });

        $("#firstImage").click(function() {
            gallery.gotoIndex(0, false, false);
        });

        $("#lastImage").click(function() {
            var lastIndex = gallery.data.length - 1;
            gallery.gotoIndex(lastIndex, false, false);
        });

        $("#playGalleryImage").click(function() {
            playOrStopGallery(gallery, true);
        });

        $("#pauseGalleryImage").click(function() {
            playOrStopGallery(gallery, false);
        });
    }
}

function playOrStopGallery(gallery, isPlay) {
    if (isPlay) {
        gallery.play();
        $("#playGalleryImage").hide();
        $("#pauseGalleryImage").show();
    } else {
        gallery.pause();
        $("#pauseGalleryImage").hide();
        $("#playGalleryImage").show();
    }
}

function changeCountImagesText(gallery, nextIndex) {
    if (gallery != undefined && gallery != null) {
        var image = gallery.data[nextIndex];
        if (image != null) {
            var numberCurrentImageText = $(".imagenumbers span#numberCurrentImage");
            if (numberCurrentImageText != undefined) {
                numberCurrentImageText.text(image.index + 1);
            }
        }
    }
}