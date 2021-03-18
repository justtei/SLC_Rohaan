mslc.define('client/widgets/communityUnit',
    [
        'lib/ko'
        , 'client/util'
        , 'client/text'
        , 'client/widgets/notification'
        , 'client/widgets/popUpCommunityUnit'
    ],
    function(ko, util, text, notification, popup) {
        'use strict';
        function CommunityUnit() {

            //#region Private

            var  unitStorage = {};

            //#endregion

            //#region Public

            function addToStorage(id, data) {
                unitStorage[id] = data;
            }

            function getFromStorage(id) {
                return unitStorage[id];
            }

            function addCollectionToStorage(array) {
                util.foreach(array, function(item) {
                    addToStorage(item.id, item);
                });
            }

            //#endregion

            //#region Interface

            this.addToStorage = addToStorage;
            this.addCollectionToStorage = addCollectionToStorage;

            //#endregion

            //#region Constructor

            function init() {
                $('body').on('click', '[data-toggle="community-unit"]', function(e) {
                    var $target = $(e.target)
                        , data = getFromStorage($(this).data('unitId'));
                    if ($target.data('toggle') === "lead-form") {
                        return;
                    }
                    if (!util.isNullOrUndef(data)) {
                        popup.show(data);
                    } else {
                        notification.show({ success: false, message: text.message('ajaxRequestError') });
                    }
                });
            }

            init();
            //#endregion

            return this;
        }

        return new CommunityUnit();
    });
