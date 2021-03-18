mslc.define('client/controls/multi', ['lib/ko', 'client/models/ko/option', 'client/util'], function(ko, Option, util) {
    'use strict';

    function Multi(items, value, options) {
        //#region Private

        var self = this,
            collection = ko.observableArray(),
            initial = ko.observable([]),
            settings = {
                captionFormatter: function(texts) {
                    return texts.join(",");
                },
            };

        function selectedItems() {
            return util.where(collection(), isSelected);
        }

        function selectedValues() {
            return util.selectProperty(self.selected(), 'value');
        }

        function selectedTexts() {
            return util.selectProperty(self.selected(), 'text');
        }

        function isSelected(item) {
            return item.selected();
        }

        function isInitial() {
            return util.compare(self.selected.values(), initial());
        }

        //#endregion

        //#region Public

        function select(selected) {
            util.foreach(selected, function(val) {
                var el = util.first(collection(), util.isEqualFactory('value', val));
                if (el) {
                    el.selected(true);
                }
            });
        }

        function update(newCollection) {
            collection(util.map(newCollection, Option));
        }

        function caption() {
            var texts = self.selected.texts();
            return util.invoke(settings.captionFormatter, texts);
        }

        function reset() {
            util.foreach(collection(), function(item) {
                item.selected(false);
            });
        }

        //#endregion

        //#region Interface

        this.items = null;
        this.selected = ko.computed(selectedItems);
        this.selected.texts = ko.computed(selectedTexts);
        this.selected.values = ko.computed(selectedValues);
        this.caption = ko.computed(caption);
        this.isInitial = ko.computed(isInitial);

        this.select = select;
        this.reset = reset;

        //#endregion

        function init() {
            util.extend(settings, options);
            self.items = collection;
            update(items);

            initial(self.selected.values());
        }

        init();

        return this;
    }

    return Multi;
})