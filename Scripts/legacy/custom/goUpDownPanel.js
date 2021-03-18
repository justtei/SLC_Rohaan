$(function ()
{
    var goUpDownPanel = $('#goUpDownPanel');
    var arrow = goUpDownPanel.find('.arrow');
    // stores scrollY for 'go down' action
    var y;
    var animationPending;

    function makeUpArrow()
    {
        arrow.text('↑');
        goUpDownPanel.attr('title', 'go up');
        y = 0;
    }

    function scrollWindow()
    {
        var yOffset = window.pageYOffset || document.documentElement.scrollTop;
        if (yOffset > 120)
        {
            goUpDownPanel.show();
            if (y && !animationPending)
            {
                makeUpArrow();
            }
        }
        else if (!y)
        {
            goUpDownPanel.hide();
        }
    }

    function changeScroll()
    {
        if (animationPending)
        {
            return;
        }

        function animateScroll(scrollTopValue)
        {
            animationPending = true;
            $('html, body').animate({ scrollTop: scrollTopValue }, 'fast', function ()
            {
                animationPending = false;
            });
        }

        var yOffset = window.pageYOffset || document.documentElement.scrollTop;
        if (yOffset > 120)
        {
            y = yOffset;
            // go up
            animateScroll(0);
            arrow.text('↓');
            goUpDownPanel.attr('title', 'go down');
        }
        else
        {
            // go down
            animateScroll(y);
            makeUpArrow();
        }
    }

    $(window).on('scroll', scrollWindow);
    goUpDownPanel.on('click', changeScroll);
});