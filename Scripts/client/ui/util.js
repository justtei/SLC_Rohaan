mslc.define('client/ui/util', ['lib/jQuery', 'client/util'], function($, util) {
    'use strict';

    function animateToggle(selector, isShow, duration) {
        var $elem = selector instanceof $ ? selector : $(selector),
            isVisible = $elem.is(':visible'),
            toggleDuration = util.isNullOrUndef(duration) ? 150 : duration,
            toggleType = 'linear';

        isShow = util.isNullOrUndef(isShow) ? !isVisible : isShow;

        if (isVisible === !isShow) {
            $elem.slideToggle(toggleDuration, toggleType);
        }
    };

    function compileKoTemplate(templateId, data) {
        var temp = $("<div>");
        ko.applyBindingsToNode(temp[0], { template: { name: name, data: data } });
        var html = temp.html();
        temp.remove();
        return html;
    }

   return {
       animateToggle: animateToggle
       , compileKoTemplate: compileKoTemplate
    }
});