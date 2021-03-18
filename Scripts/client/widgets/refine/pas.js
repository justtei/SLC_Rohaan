mslc.define('client/widgets/refine/pas',
    [
          'lib/ko'
        , 'client/controls/multi'
        , 'client/util/format'
        , 'client/services/remote'
    ],
    function(ko, Multi, format, remote) {
        'use strict';

        function ShcRefine(search) {

            var self = this;

            function formRequest() {
                return {
                    serviceCategories: self.categories.selected.values()
                };
            }

            function reset() {
                self.categories.reset();
            }

            function isInitial() {
                return self.categories.isInitial();
            }

            function isEmpty() {
                return !self.categories.selected.values().length;
            }

            this.categories = null;

            this.formRequest = formRequest;
            this.reset = reset;
            this.isInitial = isInitial;
            this.isEmpty = isEmpty;
            this.urlSource = remote.get.providerSearchUrl;

            function init() {
                self.categories = new Multi(search.refine.serviceCategories, search.serviceCategories, { captionFormatter: format.listCaption });
            }

            init();

            return this;
        }

        return ShcRefine;
    });