var SelectListSearchType = function (data)
{
    var self = this;

    this.searchTypeValue = ko.observable(data.Value);
    this.searchTypeText = ko.observable(data.Text);
    this.searchTypeSelected = ko.observable(data.Selected);
    this.searchTypeUrlValue = ko.observable(data.UrlValue);

    this.searchTypeSelectedClass = ko.computed(function ()
    {
        var result = self.searchTypeSelected() ? 'current' : '';
        return result;
    });
};

var SelectListItemLocation = function (data)
{
    this.locationValue = ko.observable(data.Value);
    this.locationUrlValue = ko.observable(data.UrlValue);
    this.locationText = ko.observable(data.Text);
    this.locationSelected = ko.observable(data.Selected);
};

var AmenityListItem = function (data)
{
    this.amenityIsChecked = ko.observable(data.IsChecked);
    this.amenityText = ko.observable(data.Text);
    this.amenityValue = ko.observable(data.Value);
};

var SelectListItem = function (data)
{
    this.text = data.Text;
    this.value = data.Value;
};

var MainSearch = function (data)
{
    var self = this;

    this.selectors = {
        countrySelect: $("#ps_Country"),
        stateSelect: $("#ps_State"),
        citySelect: $("#ps_City"),
        refinedSearch: $("#refinedSearch"),
        showOrHideRefinedSearchContainer: $("#showOrHideRefinedSearch"),
        minPrice: $("#minPrice"),
        maxPrice: $("#maxPrice"),
        keyword: $("#keyword")
    };

    this.constants = {
        getStatesUrl: $("#ps_Country").attr("data-url"),
        getCitiesUrl: $("#ps_State").attr("data-url"),
        baseUrl: "",
        productAndServiceValue: "ProductsAndServices"
    };

    //Knockaut view model init
    this.applicationPathUrl = ko.observable(data.ApplicationPathUrl);

    this.searchTypes = ko.observableArray();
    ko.utils.arrayForEach(data.SearchTypes, function (searchType)
    {
        var selectListSearchType = new SelectListSearchType(searchType);
        self.searchTypes.push(selectListSearchType);
    });

    this.countries = ko.observableArray();
    ko.utils.arrayForEach(data.Countries, function (country)
    {
        var selectListItemLocation = new SelectListItemLocation(country);
        self.countries.push(selectListItemLocation);
    });
    this.countryId = ko.observable(data.SelectedCountryId);

    this.states = ko.observableArray();
    ko.utils.arrayForEach(data.States, function (state)
    {
        var selectListItemLocation = new SelectListItemLocation(state);
        self.states.push(selectListItemLocation);
    });
    this.stateId = ko.observable(data.SelectedStateId);

    this.cities = ko.observableArray();
    ko.utils.arrayForEach(data.Cities, function (city)
    {
        var selectListItemLocation = new SelectListItemLocation(city);
        self.cities.push(selectListItemLocation);
    });
    this.cityId = ko.observable(data.SelectedCityId);

    this.isEnableState = ko.observable(true);

    this.isEnableCity = ko.observable(self.stateId());

    this.disableCityTooltip = ko.computed(function ()
    {
        var result = !self.isEnableCity() ? "Select state first" : "";
        return result;
    });

    //Refined Search Knockaut model
    this.isShowRefinedSearch = ko.observable(data.RefinedSearch.IsShowRefinedSearch);

    this.defaultAmenities = ko.observableArray();
    ko.utils.arrayForEach(data.RefinedSearch.DefaultAmenities, function (item)
    {
        var amenityItem = new AmenityListItem(item);
        self.defaultAmenities.push(amenityItem);
    });

    this.amenityText = ko.observable(data.RefinedSearch.AmenityText);

    this.minPrice = ko.observable(data.RefinedSearch.MinPrice);
    this.maxPrice = ko.observable(data.RefinedSearch.MaxPrice);
    this.priceText = ko.observable(data.RefinedSearch.PriceText);

    this.keyword = ko.observable(data.RefinedSearch.Keyword);
    this.keywordText = ko.observable(data.RefinedSearch.KeywordText);

    this.bathroomFromId = ko.observable(data.RefinedSearch.BathroomFromId);

    this.availableBathroomsFromQuantity = ko.observableArray();
    ko.utils.arrayForEach(data.RefinedSearch.AvailableBathroomsFromQuantity, function (item)
    {
        var selectListItem = new SelectListItem(item);
        self.availableBathroomsFromQuantity.push(selectListItem);
    });

    this.bathroomToId = ko.observable(data.RefinedSearch.BathroomToId);

    this.availableBathroomsToQuantity = ko.observableArray();
    ko.utils.arrayForEach(data.RefinedSearch.AvailableBathroomsToQuantity, function (item)
    {
        var selectListItem = new SelectListItem(item);
        self.availableBathroomsToQuantity.push(selectListItem);
    });

    this.bathroomText = ko.observable(data.RefinedSearch.BathroomText);

    this.bedroomFromId = ko.observable(data.RefinedSearch.BedroomFromId);

    this.availableBedroomsFromQuantity = ko.observableArray();
    ko.utils.arrayForEach(data.RefinedSearch.AvailableBedroomsFromQuantity, function (item)
    {
        var selectListItem = new SelectListItem(item);
        self.availableBedroomsFromQuantity.push(selectListItem);
    });

    this.bedroomToId = ko.observable(data.RefinedSearch.BedroomToId);

    this.availableBedroomsToQuantity = ko.observableArray();
    ko.utils.arrayForEach(data.RefinedSearch.AvailableBedroomsToQuantity, function (item)
    {
        var selectListItem = new SelectListItem(item);
        self.availableBedroomsToQuantity.push(selectListItem);
    });

    this.bedroomText = ko.observable(data.RefinedSearch.BedroomText);

    this.searchUrl = ko.observable();

    //Initilization
    this.init = function ()
    {

        $("body").on("mousedown", function (e)
        {
            var srcElement = e.target || e.srcElement;

            if (!$(srcElement).hasClass("dialog") && !$(srcElement).closest(".dialog").length)
            {
                self.hideAllRefinedSearchWindow(false);
            }
        });

        $("#ps_button").on("click", function ()
        {
            var anchor = $(this);
            if (anchor && !$.browser.msie)
            {
                anchor.addClass("button-loading");
            }
        });

        $("input[id*=minPrice], input[id*=maxPrice]").on("keydown", function (event)
        {
            if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                (event.keyCode == 65 && event.ctrlKey === true) ||
                (event.keyCode >= 35 && event.keyCode <= 39))
            {
                return;
            }

            var length = $(this).val().length;
            if (length > 13 || event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105))
            {
                event.preventDefault();
            }
        });

        $("#refinedSearch ul li a").on("click", self.showRefinedSearchWindow);

        //'Ok', 'Clear' event handlers
        $('#amenityButtonClear').on('click', self.clearAmenityWindow);
        $('#amenityButtonOk, #amenityCloseImage').on('click', self.closeAmenityWindow);
        $('#priceButtonClear').on('click', self.clearPriceWindow);
        $('#priceButtonOk, #priceCloseImage').on('click', self.closePriceWindow);
        $('#bedButtonClear').on('click', self.clearBedroomWindow);
        $('#bedButtonOk, #bedCloseImage').on('click', self.closeBedroomWindow);
        $('#bathButtonClear').on('click', self.clearBathroomWindow);
        $('#bathButtonOk, #bathCloseImage').on('click', self.closeBathroomWindow);
        $('#keywordsButtonClear').on('click', self.clearKeywordWindow);
        $('#keywordsButtonOk, #keywordCloseImage').on('click', self.closeKeywordWindow);

        self.generateSearchUrl();
    };

    //Methods
    this.getSelectedSearchType = function ()
    {
        var result = ko.utils.arrayFirst(self.searchTypes(), function (item)
        {
            return item.searchTypeSelected();
        });

        return result;
    };

    this.getSelectedCountry = function ()
    {
        if (self.countryId())
        {
            var result = ko.utils.arrayFirst(self.countries(), function (item)
            {
                return item.locationValue() == self.countryId();
            });

            return result;
        }

        return null;
    };

    this.getSelectedState = function ()
    {
        if (self.stateId())
        {
            var result = ko.utils.arrayFirst(self.states(), function (item)
            {
                return item.locationValue() == self.stateId();
            });

            return result;
        }

        return null;
    };

    this.getSelectedCity = function ()
    {
        if (self.cityId())
        {
            var result = ko.utils.arrayFirst(self.cities(), function (item)
            {
                return item.locationValue() == self.cityId();
            });

            return result;
        }

        return null;
    };

    this.getMinPrice = function ()
    {
        var minPriceEl = $(self.selectors.minPrice);
        var isMinPricePlaceHolder = $.browser.msie && minPriceEl.hasClass("placeholder");
        if (!isMinPricePlaceHolder)
        {
            var minPrice = parseFloat(minPriceEl.val());
            if (minPrice)
            {
                return minPrice;
            }
        }

        return null;
    };

    this.getMaxPrice = function ()
    {
        var maxPriceEl = $(self.selectors.maxPrice);
        var isMaxPricePlaceHolder = $.browser.msie && maxPriceEl.hasClass("placeholder");
        if (!isMaxPricePlaceHolder)
        {
            var maxPrice = parseFloat(maxPriceEl.val());
            if (maxPrice)
            {
                return maxPrice;
            }
        }

        return null;
    };

    this.getKeyword = function ()
    {
        var keywordEl = $(self.selectors.keyword);
        var isKeywordPlaceHolder = $.browser.msie && keywordEl.hasClass("placeholder");
        if (!isKeywordPlaceHolder)
        {
            return $.trim(keywordEl.val());
        }

        return null;
    };

    this.getSelectedBedroomFrom = function ()
    {
        if (self.bedroomFromId())
        {
            var result = ko.utils.arrayFirst(self.availableBedroomsFromQuantity(), function (item)
            {
                return item.value == self.bedroomFromId();
            });

            return result;
        }

        return null;
    };

    this.getSelectedBedroomTo = function ()
    {
        if (self.bedroomToId())
        {
            var result = ko.utils.arrayFirst(self.availableBedroomsToQuantity(), function (item)
            {
                return item.value == self.bedroomToId();
            });

            return result;
        }

        return null;
    };

    this.getSelectedBathroomFrom = function ()
    {
        if (self.bathroomFromId())
        {
            var result = ko.utils.arrayFirst(self.availableBathroomsFromQuantity(), function (item)
            {
                return item.value == self.bathroomFromId();
            });

            return result;
        }

        return null;
    };

    this.getSelectedBathroomTo = function ()
    {
        if (self.bathroomToId())
        {
            var result = ko.utils.arrayFirst(self.availableBathroomsToQuantity(), function (item)
            {
                return item.value == self.bathroomToId();
            });

            return result;
        }

        return null;
    };

    this.getCheckedAmenityIds = function ()
    {
        var checkedAmentyIds = new Array();
        ko.utils.arrayForEach(self.defaultAmenities(), function (item)
        {
            if (item.amenityIsChecked())
            {
                checkedAmentyIds.push(item.amenityValue());
            }
        });

        return checkedAmentyIds;
    };

    this.showOrHideRefinedSearch = function ()
    {
        if ($(self.selectors.refinedSearch).is(":visible"))
        {
            self.isShowRefinedSearch(false);
            refinedSearchAnimationHide(self.selectors.refinedSearch);
        }
        else
        {
            self.isShowRefinedSearch(true);
            refinedSearchAnimationShow(self.selectors.refinedSearch);
        }
    };

    this.enableOrDisableRefinedSearch = function ()
    {
        var selectedSearchType = self.getSelectedSearchType();

        if (selectedSearchType.searchTypeValue() == self.constants.productAndServiceValue)
        {
            refinedSearchAnimationHide(self.selectors.refinedSearch, self.selectors.showOrHideRefinedSearchContainer);
        }
        else
        {
            if (self.isShowRefinedSearch())
            {
                refinedSearchAnimationShow(self.selectors.showOrHideRefinedSearchContainer, self.selectors.refinedSearch);
            }
            else
            {
                refinedSearchAnimationShow(self.selectors.showOrHideRefinedSearchContainer);
            }
        }
    };

    this.hideAllRefinedSearchWindow = function (isClear)
    {
        var windows = $(".dialog").filter(":visible");
        if (windows)
        {
            windows.each(function (index, el)
            {
                var closeEl = isClear
                ? $(el).find(".dialog-save-button input[id*=Clear]")
                : $(el).find(".dialog-save-button input[id*=Ok]");
                if (closeEl)
                {
                    closeEl.click();
                }
            });
        }
    };

    this.hideRefinedSearchWindow = function (el)
    {
        var dialog = $(el).closest(".dialog");
        if (dialog)
        {
            dialog.fadeOut();
        }
    };

    this.getRefinedSearchWindow = function (el)
    {
        return $(el).closest(".dialog");
    };

    this.clearAmenities = function ()
    {
        ko.utils.arrayForEach(self.defaultAmenities(), function (item)
        {
            item.amenityIsChecked(false);
        });
    };

    this.saveAmenities = function ()
    {
        var checkedAmenity = ko.utils.arrayFilter(self.defaultAmenities(), function (item)
        {
            return item.amenityIsChecked();
        });

        var text;
        if (checkedAmenity.length > 0)
        {
            text = checkedAmenity[0].amenityText();
            if (checkedAmenity.length > 1)
            {
                text = text + "..." + (checkedAmenity.length - 1) + " More";
            }
        }
        else
        {
            text = "Not Selected";
        }

        self.amenityText(text);
    };

    this.clearPrices = function ()
    {
        var minPrice = self.getMinPrice();
        var maxPrice = self.getMaxPrice();
        if (minPrice)
        {
            self.minPrice(null);
        }

        if (maxPrice)
        {
            self.maxPrice(null);
        }
    };

    this.savePrices = function ()
    {
        var minPrice = self.getMinPrice();
        var maxPrice = self.getMaxPrice();

        var text = minPrice ? minPrice + " - " : "No Min - ";
        text = maxPrice ? text + maxPrice : text + "No Max";

        self.priceText(text);
    };

    this.saveBedrooms = function ()
    {
        var selectedFrom = self.getSelectedBedroomFrom();
        var selectedTo = self.getSelectedBedroomTo();
        var text = "Any";
        if (selectedFrom || selectedTo)
        {
            text = selectedFrom ? selectedFrom.text + " - " : "Any - ";
            text = text + (selectedTo ? selectedTo.text : "Any");
        }

        self.bedroomText(text);
    };

    this.clearBedrooms = function ()
    {
        self.bedroomFromId(null);
        self.bedroomToId(null);
    };

    this.saveBathrooms = function ()
    {
        var selectedFrom = self.getSelectedBathroomFrom();
        var selectedTo = self.getSelectedBathroomTo();

        var text = "Any";
        if (selectedFrom || selectedTo)
        {
            text = selectedFrom ? selectedFrom.text + " - " : "Any - ";
            text = text + (selectedTo ? selectedTo.text : "Any");
        }

        self.bathroomText(text);
    };

    this.clearBathrooms = function ()
    {
        self.bathroomFromId(null);
        self.bathroomToId(null);
    };

    this.saveKeyword = function ()
    {
        var keyword = self.getKeyword();
        var text = "No keywords entered";
        if (keyword)
        {
            text = keyword;
            if (keyword.length > 15)
            {
                text = keyword.substr(0, 15) + "...";
            }
        }

        self.keywordText(text);
    };

    this.clearKeyword = function ()
    {
        var keyword = self.getKeyword();
        if (keyword)
        {
            self.keyword(null);
        }
    };

    this.getStates = function ()
    {
        var selectedSearchType = self.getSelectedSearchType();

        self.isEnableState(false);
        showWaitingSelect(self.selectors.stateSelect);

        self.isEnableCity(false);
        showWaitingSelect(self.selectors.citySelect);

        $.get(self.constants.getStatesUrl, {
            countryId: self.countryId(),
            selectedType: selectedSearchType.searchTypeValue()
        }).done(function (result)
        {
            self.states.removeAll();
            ko.utils.arrayForEach(result, function (state)
            {
                var selectItem = new SelectListItemLocation(state);
                self.states.push(selectItem);
            });

            var stateId = self.getSelectedState();
            if (stateId)
            {
                self.getCities();
            }
            else
            {
                hideWaitingSelect(self.selectors.citySelect);
                self.cityId(null);
                self.isEnableCity(false);
            }

        }).always(function ()
        {
            self.generateSearchUrl();
            hideWaitingSelect(self.selectors.stateSelect);
            self.isEnableState(true);
        });
    };

    this.getCities = function ()
    {
        var selectedSearchType = self.getSelectedSearchType();

        $.get(self.constants.getCitiesUrl, {
            stateId: self.stateId(),
            selectedType: selectedSearchType.searchTypeValue()
        }).done(function (result)
        {
            self.cities.removeAll();
            ko.utils.arrayForEach(result, function (state)
            {
                var selectItem = new SelectListItemLocation(state);
                self.cities.push(selectItem);
            });

        }).always(function ()
        {
            self.generateSearchUrl();
            hideWaitingSelect(self.selectors.citySelect);
            self.isEnableCity(true);
        });
    };

    this.generateRefinedSearchPathUrl = function ()
    {
        var url = "";
        var urlparametrSeparator = "&";
        var isFirstParametr = true;

        var keyword = self.getKeyword();
        if (keyword)
        {
            url = url + "keyword=" + encodeURIComponent(keyword);
            isFirstParametr = false;
        }

        var minPrice = self.getMinPrice();
        if (minPrice)
        {
            url = !isFirstParametr ? url + urlparametrSeparator : url;
            url = url + "minprice=" + minPrice;
            isFirstParametr = false;
        }

        var maxPrice = self.getMaxPrice();
        if (maxPrice)
        {
            url = !isFirstParametr ? url + urlparametrSeparator : url;
            url = url + "maxprice=" + maxPrice;
            isFirstParametr = false;
        }

        var bathFrom = self.getSelectedBathroomFrom();
        if (bathFrom)
        {
            url = !isFirstParametr ? url + urlparametrSeparator : url;
            url = url + "bathfrom=" + bathFrom.value;
            isFirstParametr = false;
        }

        var bathTo = self.getSelectedBathroomTo();
        if (bathTo)
        {
            url = !isFirstParametr ? url + urlparametrSeparator : url;
            url = url + "bathto=" + bathTo.value;
            isFirstParametr = false;
        }

        var bedFrom = self.getSelectedBedroomFrom();
        if (bedFrom)
        {
            url = !isFirstParametr ? url + urlparametrSeparator : url;
            url = url + "bedfrom=" + bedFrom.value;
            isFirstParametr = false;
        }

        var bedTo = self.getSelectedBedroomTo();
        if (bedTo)
        {
            url = !isFirstParametr ? url + urlparametrSeparator : url;
            url = url + "bedto=" + bedTo.value;
            isFirstParametr = false;
        }

        var checkedAmenities = self.getCheckedAmenityIds();
        if (checkedAmenities && checkedAmenities.length > 0)
        {
            url = !isFirstParametr ? url + urlparametrSeparator : url;
            url = url + "amenities=" + checkedAmenities.join("-");
        }

        return url;
    };

    this.generateSearchUrl = function ()
    {
        var urlParametrSeparator = "/";
        var url = self.applicationPathUrl();
        var selectedSearchType = self.getSelectedSearchType();
        if (selectedSearchType)
        {
            if (url === urlParametrSeparator)
            {
                url = url + selectedSearchType.searchTypeUrlValue();
            }
            else
            {
                url = url + urlParametrSeparator + selectedSearchType.searchTypeUrlValue();
            }

            var selectedCountry = self.getSelectedCountry();
            if (selectedCountry)
            {
                url = url + urlParametrSeparator + selectedCountry.locationUrlValue();

                var selectedState = self.getSelectedState();
                if (selectedState)
                {
                    url = url + urlParametrSeparator + selectedState.locationUrlValue();

                    var selectedCity = self.getSelectedCity();
                    if (selectedCity)
                    {
                        url = url + urlParametrSeparator + selectedCity.locationUrlValue();
                    }
                }
            }

            if (self.isShowRefinedSearch() &&
                selectedSearchType.searchTypeValue() != self.constants.productAndServiceValue)
            {
                var refinedSearchPathUrl = self.generateRefinedSearchPathUrl();
                if (refinedSearchPathUrl)
                {
                    url = url + "?" + refinedSearchPathUrl;
                }
            }
        }

        self.searchUrl(url);
    };


    //Event hendlers
    this.changeSearchType = function (selectSearchType)
    {
        /*self.searchTypes().forEach(function (element)*/
        ko.utils.arrayForEach(self.searchTypes(), function (element)
        {
            if (element.searchTypeSelected() && element.searchTypeValue() != selectSearchType.searchTypeValue())
            {
                element.searchTypeSelected(false);
            }

            if (element.searchTypeValue() == selectSearchType.searchTypeValue())
            {
                element.searchTypeSelected(true);
            }
        });

        self.generateSearchUrl();

        self.enableOrDisableRefinedSearch();
        self.getStates();
    };

    this.changeCountry = function ()
    {
        self.generateSearchUrl();
        if (!self.countryId())
        {
            self.stateId(null);
            self.isEnableState(false);
            return;
        }

        self.getStates();
    };

    this.changeState = function ()
    {
        self.generateSearchUrl();
        if (!self.stateId())
        {
            self.cityId(null);
            self.isEnableCity(false);
            return;
        }

        self.isEnableCity(false);
        showWaitingSelect(self.selectors.citySelect);
        self.getCities();
    };

    this.changeCity = function ()
    {
        self.generateSearchUrl();
    };

    this.showOrHideRefinedSearchClick = function ()
    {
        self.showOrHideRefinedSearch();
        self.generateSearchUrl();
    };

    this.showRefinedSearchWindow = function ()
    {
        var dialog = $(this).next(".dialog");
        if (dialog)
        {
            dialog.fadeIn();
        }

        return false;
    };

    this.clearAmenityWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.clearAmenities();
            self.saveAmenities();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.closeAmenityWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.saveAmenities();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.clearPriceWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.clearPrices();
            self.savePrices();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.closePriceWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.savePrices();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.clearBedroomWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.clearBedrooms();
            self.saveBedrooms();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.closeBedroomWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.saveBedrooms();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.clearBathroomWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.clearBathrooms();
            self.saveBathrooms();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.closeBathroomWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.saveBathrooms();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.clearKeywordWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.clearKeyword();
            self.saveKeyword();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };

    this.closeKeywordWindow = function ()
    {
        var refinedSearchWindow = self.getRefinedSearchWindow(this);
        if (refinedSearchWindow)
        {
            self.saveKeyword();
            self.hideRefinedSearchWindow(refinedSearchWindow);
        }

        self.generateSearchUrl();
    };
};

function showWaitingSelect(select)
{
    var waitingOptions = "<option id='waitoption' selected='selected'>Please wait...</option>";
    $(select).find("option").removeAttr("selected");
    var firstOption = $(select).find("option:first");
    if (firstOption.length > 0)
    {
        firstOption.before(waitingOptions);
        return;
    }

    $(select).append(waitingOptions);
}

function hideWaitingSelect(select)
{
    var waitOption = $(select).find("option[id=waitoption]");
    if (waitOption || waitOption.length > 0) 
    {
        waitOption.remove();
    }
}

function refinedSearchAnimationShow(el)
{
    $(el).show("slide", { direction: "up", easing: "linear" }, 400);
    $(el).parent(".ui-effects-wrapper").hide().slideDown(400);
}

function refinedSearchAnimationShow(firstEl, secondEl)
{
    $(firstEl).show("slide", { direction: "up", easing: "linear" }, 400, function ()
    {
        refinedSearchAnimationShow(secondEl);
    });
    $(firstEl).parent(".ui-effects-wrapper").hide().slideDown(400);
}

function refinedSearchAnimationHide(el)
{
    $(el).hide("slide", { direction: "up", easing: "linear" }, 400);
    $(el).parent(".ui-effects-wrapper").slideUp(400);
}

function refinedSearchAnimationHide(firstEl, secondEl)
{
    $(firstEl).hide("slide", { direction: "up", easing: "linear" }, 400, function ()
    {
        refinedSearchAnimationHide(secondEl);
    });
    $(firstEl).parent(".ui-effects-wrapper").slideUp(400);
}