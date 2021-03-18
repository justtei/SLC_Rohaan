mslc.define('client/controls/select',
    [
        'lib/ko'
        , 'client/models/ko/option'
        , 'client/models/ko/formattedOption'
        , 'client/util'
    ], function(ko, Option, FormattedOption, util) {
        'use strict';

        function Select(items, value, options) {

            //#region Private
            console.log(value);
            console.log(options);
            console.log(items);
            var self = this,
                initial = null,
                innerSelected = ko.observable(),
                collection = [],
                settings = {
                    stubText: 'Any'
                    , captionFormatter: null
                    , textFormatter: null
                    , defaultValue: null
                };

            function selectedItem() {
                return innerSelected();
            }

            function selectedValue() {
                var selected = self.selected();
                return selected ? selected.value : null;
            }

            function selectedText() {
                var selected = self.selected();
                return selected ? selected.text : null;
            }

            function isSelected(item) {
                return item.selected();
            }

            //#endregion

            //#region Public

            function select(val) {
                var current = innerSelected();

                if (current) {
                    if (current.value === val) {
                        return;
                    }
                    current.selected(false);
                }
                var next = util.first(collection, util.isEqualFactory('value', val));

                if (!next) {
                    next = util.first(collection);
                }

                if (next) {
                    next.selected(true);
                    innerSelected(next);
                }
            }


            function selectItem(item) {
                console.log(item);
                select(item.value);
            }
            function selectItemmod(item) {
                console.log(item);
                
                select(item);
            }
            
            function caption() {
                var text = self.selected.text();
                if (settings.captionFormatter) {
                    return util.invoke(settings.captionFormatter, text);
                }
                return text;
            }

            function reset() {
                util.foreach(collection, function(item) {
                    item.selected(false);
                });
                select(settings.defaultValue);
            }

            function isInitial() {
                return self.selected.value() == initial;
            }

            function update(newItems, newValue) {
                if (settings.textFormatter) {
                    collection = ko.utils.arrayMap(newItems, function(item) {
                        return new FormattedOption(item, settings.textFormatter);
                    });
                } else {
                    collection = util.map(newItems, Option);
                }

                if (typeof settings.stubText === 'string') {
                    var stub = {
                        value: null,
                        text: settings.stubText
                    };

                    if (settings.textFormatter) {
                        collection.unshift(new FormattedOption(stub, settings.textFormatter));
                    } else {
                        collection.unshift(new Option(stub));
                    }
                }

                if (!util.isDefined(newValue)) {
                    var selected = util.first(collection, isSelected);
                    newValue = selected || settings.defaultValue;
                }

                reset();
                select(newValue);
                self.items(collection);

                initial = self.selected.value();
                self.isInitial = ko.computed(isInitial);
            }

            //#endregion

            //#region Interface

            this.items = ko.observableArray();
            this.selected = ko.computed(selectedItem);
            this.selected.text = ko.computed(selectedText);
            this.selected.value = ko.computed(selectedValue);
            this.caption = ko.computed(caption);
            this.isInitial = null;

            this.select = select;
            this.selectItem = selectItem;
            this.update = update;
            this.reset = reset;

            //#endregion

            function init() {
                util.extend(settings, options);

                update(items, value);
            }

            init();

            return this;
        }

        return Select;
    });