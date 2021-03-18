mslc.define('client/widgets/refine',
    [
          'lib/ko'
        , 'client/services/location'
        , 'client/util'
        , 'client/controls/select'
    ],
    function(ko, location, util, Select) {
        'use strict';

        function Refine(search, ControlConstructor) {

            var self = this, initial;

            function formCriteria(data) {
                return {
                    pageType: data.pageType
                    , stateCode: data.criteria.stateCode
                    , city: data.criteria.city
                };
            }

            function formRequest() {
                var current = util.invoke(self.controls.formRequest);
                current.sortType = self.sort.selected.value();

                return util.extend(initial, current);
            }

            function apply() {
                if (!self.isInitial()) {
                    self.pending(true);
                    self.controls.urlSource(formRequest(), location.go).fail(function() {
                        self.pending(false);
                    });
                }
            }

            function sort(newSortValue) {
                self.pending(true);
                initial.sortType = newSortValue;
                self.controls.urlSource(initial, location.go).fail(function() {
                    self.pending(false);
                });
            }

            function clear() {
                self.controls.reset();
                self.apply();
            }

            this.isInitial = null;
            this.isEmpty = null;
            this.pending = null;
            this.apply = apply;
            this.controls = null;
            this.sort = null;
            this.clear = clear;


            function init() {
                self.controls = new ControlConstructor(search);

                self.sort = new Select(search.refine.sortTypes, search.sortType, { stubText: null });

                self.sort.selected.value.subscribe(sort);

                self.isInitial = ko.computed(self.controls.isInitial);
                self.isEmpty = ko.computed(self.controls.isEmpty);
                self.pending = ko.observable(false);

                var initialCriteria = formCriteria(search);
                initial = util.extend(initialCriteria, util.invoke(self.controls.formRequest));
            }

            init();

            return this;
        }

        return Refine;
    });