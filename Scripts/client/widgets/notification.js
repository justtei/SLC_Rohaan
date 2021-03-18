mslc.define('client/widgets/notification',
    [
          'lib/ko'
        , 'lib/jQuery'
    ],
    function(ko, $) {
        'use strict';

        function NotificationWidget() {
            var self = this,
                $container = null,
                templateId = null;

            function showNotification(data) {
                var notification = $('<div/>').appendTo($container).get();

                ko.renderTemplate(
                    templateId,
                    data,
                    {
                        afterRender: function(notifySelector) {
                            $(notifySelector).delay(5000).fadeOut(3000, function() {
                                $(this).remove();
                            });
                        }
                    },
                    notification,
                    'replaceNode');
            }

            //#region Interface

            this.show = showNotification;

            //#endregion

            //#region Constructor

            function init() {
                $container = $('.notifications-area');
                templateId = 'notification-template';
            }

            init();
            
            //#endregion
        }

        return new NotificationWidget();
    });