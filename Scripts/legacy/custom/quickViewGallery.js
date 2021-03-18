(function ($)
{
    $.fn.quickViewGallery = function (options)
    {
        var settings = $.extend(
            {
                intervalDuration: 1000,
                animateDuration: 500
            }, options);
        var container = this;
        var currentIndex = 0;
        var interval;
        var images;
        var isStarted = false;
        var count = $(settings.countSelector);

        var setImage = function (nextIndex)
        {
            $(images[currentIndex]).hide();
            $(images[nextIndex])
                .css("opacity", 0)
                .show()
                .animate({ opacity: 1 }, settings.animateDuration);
            currentIndex = nextIndex;
            if (count)
            {
                count.html(currentIndex + 1);
            }
        };

        var initImages = function ()
        {
            return container.find("li").hide();
        };

        var next = function ()
        {
            var nextIndex = (currentIndex + 1) % images.length;
            setImage(nextIndex);
        };

        var previous = function ()
        {
            if (currentIndex == 0)
            {
                return;
            }
            var nextIndex = currentIndex - 1;
            setImage(nextIndex);
        };

        var play = function ()
        {
            if (!isStarted)
            {
                interval = setInterval(next, settings.intervalDuration);
                isStarted = true;
            }
        };

        var pause = function ()
        {
            if (isStarted)
            {
                clearInterval(interval);
                isStarted = false;
            }
        };

        var toFirst = function ()
        {
            setImage(0);
        };

        var toLast = function ()
        {
            setImage(images.length - 1);
        };

        var refresh = function ()
        {
            pause();
            images = initImages();
            toFirst();
        };


        images = initImages();
        toFirst();

        return {
            next: next,
            previous: previous,
            play: play,
            pause: pause,
            toFirst: toFirst,
            toLast: toLast,
            refresh: refresh
        };
    };
})(jQuery)