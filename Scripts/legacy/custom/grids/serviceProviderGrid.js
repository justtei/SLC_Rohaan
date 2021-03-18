function initializeServiceProviderGrid(initialData, sortBy, orderBy)
{
    // we have to set 'SortBy' and 'OrderBy' directly because enums are serialized into integers, not strings as required
    initialData.SortBy = sortBy;
    initialData.OrderBy = orderBy;
    
    window.viewModel = new ServiceProviderGrid(initialData);
    ko.applyBindings(viewModel);
    customDatePicker(document.body);
    
    $('#serviceProviderNameHeader .filter input[type=text]').on('focus', focusServiceProviderNameFilterTextBox);
}

/* +++++++++++++++++++++++++++++++++++++++++++++++++++ constructors +++++++++++++++++++++++++++++++++++++++++++++++++++ */

// inherits 'GridHistoryData'
function ServiceProviderGridHistoryData(serviceProviderGrid)
{
    GridHistoryData.apply(this, arguments);
    var self = this;
    this.filter = {};

    function fillHistory(fromFilter, toObjectInHistory)
    {
        ko.utils.arrayForEach(fromFilter, function(item)
        {
            toObjectInHistory[item.value()] = item.isChecked();
        });
    }

    this.packageFilterIsApplied = serviceProviderGrid.packageFilterIsApplied();
    this.categoryFilterIsApplied = serviceProviderGrid.categoryFilterIsApplied();

    self.filter.packages = {};
    fillHistory(serviceProviderGrid.filter.packages, self.filter.packages);
    self.filter.packagesOption = {};
    fillHistory(serviceProviderGrid.filter.packagesOption, self.filter.packagesOption);
    self.filter.categories = {};
    fillHistory(serviceProviderGrid.filter.categories, self.filter.categories);
    self.filter.categoriesOption = {};
    fillHistory(serviceProviderGrid.filter.categoriesOption, self.filter.categoriesOption);

    this.filter.serviceProviderName = serviceProviderGrid.filter.serviceProviderName();
    this.filter.serviceProviderNameOption = serviceProviderGrid.filter.serviceProviderNameOption();
    this.filter.feature = serviceProviderGrid.filter.feature();
    this.filter.featureOption = serviceProviderGrid.filter.featureOption();
    this.filter.featureStart = serviceProviderGrid.filter.featureStart();
    this.filter.featureStartOption = serviceProviderGrid.filter.featureStartOption();
    this.filter.featureEnd = serviceProviderGrid.filter.featureEnd();
    this.filter.featureEndOption = serviceProviderGrid.filter.featureEndOption();
    this.filter.publish = serviceProviderGrid.filter.publish();
    this.filter.publishOption = serviceProviderGrid.filter.publishOption();
    this.filter.publishStart = serviceProviderGrid.filter.publishStart();
    this.filter.publishStartOption = serviceProviderGrid.filter.publishStartOption();
    this.filter.publishEnd = serviceProviderGrid.filter.publishEnd();
    this.filter.publishEndOption = serviceProviderGrid.filter.publishEndOption();

    this.sortBy = serviceProviderGrid.sortBy();
    this.orderBy = serviceProviderGrid.orderBy();
}

var ServiceProviderFilter = function(data)
{
    var self = this;

    this.serviceProviderName = ko.observable(data.ServiceProvider);
    this.serviceProviderNameOption = ko.observable(data.ServiceProvider);
    this.feature = ko.observable(data.Feature);
    this.featureOption = convertFromBoolToCheckboxState(data.Feature);
    this.featureStart = ko.observable(data.FeatureStart);
    this.featureStartOption = ko.observable(data.FeatureStart);
    this.featureEnd = ko.observable(data.FeatureEnd);
    this.featureEndOption = ko.observable(data.FeatureEnd);
    this.publish = ko.observable(data.Publish);
    this.publishOption = convertFromBoolToCheckboxState(data.Publish);
    this.publishStart = ko.observable(data.PublishStart);
    this.publishStartOption = ko.observable(data.PublishStart);
    this.publishEnd = ko.observable(data.PublishEnd);
    this.publishEndOption = ko.observable(data.PublishEnd);

    self.packages = [];
    self.packagesOption = [];
    ko.utils.arrayForEach(data.Packages, function(item)
    {
        self.packages.push(new CheckBox(item));
        self.packagesOption.push(new CheckBox(item));
    });

    self.categories = [];
    self.categoriesOption = [];
    ko.utils.arrayForEach(data.Categories, function(category)
    {
        self.categories.push(new CheckBox(category));
        self.categoriesOption.push(new CheckBox(category));
    });
};



var ServiceProvider = function (data)
{
    var self = this;

    this.isDisabled = ko.observable(false);
    this.id = data.Id;
    this.name = data.Name;

    /* package */
    this.package = ko.observable(data.Package);
    this.selectedPackage = ko.observable(data.Package);
    this.packages = data.Packages;
    this.packageSelectorIsVisible = ko.observable(false);

    /* senior housing & care categories */
    var currentCategories = [];
    var selectedCategories = [];
    ko.utils.arrayForEach(data.SeniorHousingAndCareCategories, function (category)
    {
        currentCategories.push(new CheckBox(category));
        selectedCategories.push(new CheckBox(category));
    });
    this.currentCategories = ko.observableArray(currentCategories);
    this.selectedCategories = ko.observableArray(selectedCategories);
    this.categories = ko.computed(function ()
    {
        var result = '';
        ko.utils.arrayForEach(self.currentCategories(), function (category)
        {
            if (category.isChecked())
            {
                if (result != '')
                {
                    result += ', ';
                }
                result += category.text();
            }
        });
        return result;
    });
    this.categoriesSelectorIsVisible = ko.observable(false);
    this.categoriesSelectorIsValid = ko.computed(function ()
    {
        for (var j = 0; j < self.selectedCategories().length; j++)
        {
            if (self.selectedCategories()[j].isChecked())
            {
                return true;
            }
        }
        return false;
    });

    /* feature */
    this.featureStartDate = ko.observable(getDateString(data.FeatureStartDate));
    this.selectedFeatureStartDate = ko.observable(getDateString(data.FeatureStartDate));
    this.featureEndDate = ko.observable(getDateString(data.FeatureEndDate));
    this.selectedFeatureEndDate = ko.observable(getDateString(data.FeatureEndDate));
    var featureState = setCheckboxStateForDates(self.featureStartDate(), self.featureEndDate());
    this.feature = ko.observable(featureState);
    this.featureDatesSelectorIsVisible = ko.observable(false);

    /* publish */
    this.publishStartDate = ko.observable(getDateString(data.PublishStartDate));
    this.selectedPublishStartDate = ko.observable(getDateString(data.PublishStartDate));
    this.publishEndDate = ko.observable(getDateString(data.PublishEndDate));
    this.selectedPublishEndDate = ko.observable(getDateString(data.PublishEndDate));
    var publishState = setCheckboxStateForDates(self.publishStartDate(), self.publishEndDate());
    this.publish = ko.observable(publishState);
    this.publishDatesSelectorIsVisible = ko.observable(false);
};

// inherits 'EditableGrid'
var ServiceProviderGrid = function(data)
{
    EditableGrid.apply(this, arguments);
    var self = this;

    /* urls */
    this.gridUrl = data.GridUrl;
    this.jsonGridUrl = data.JsonGridUrl;
    this.changePackageTypeUrl = data.ChangePackageTypeUrl;
    this.changeSeniorHousingAndCareCategoriesUrl = data.ChangeSeniorHousingAndCareCategoriesUrl;
    this.changeFeatureDatesUrl = data.ChangeFeatureDatesUrl;
    this.changePublishDatesUrl = data.ChangePublishDatesUrl;

    this.getList = function(serviceProviderGrid)
    {
        var list = [];
        for (var i = 0; i < serviceProviderGrid.List.length; i++)
        {
            var serviceProvider = new ServiceProvider(serviceProviderGrid.List[i]);
            list.push(serviceProvider);
        }
        return list;
    };

    this.list = ko.observableArray(self.getList(data));
    this.sortBy = ko.observable(data.SortBy);
    this.orderBy = ko.observable(data.OrderBy);

    /* +++++++++++++++++ filter +++++++++++++++++ */

    this.filter = new ServiceProviderFilter(data.Filter);
    this.checkboxFilterOptions = ['Checked', 'Unchecked', 'Any'];

    this.serviceProviderNameFilterIsVisible = ko.observable(false);
    this.packageFilterIsVisible = ko.observable(false);
    this.categoriesFilterIsVisible = ko.observable(false);
    this.featureFilterIsVisible = ko.observable(false);
    this.featureStartFilterIsVisible = ko.observable(false);
    this.featureEndFilterIsVisible = ko.observable(false);
    this.publishFilterIsVisible = ko.observable(false);
    this.publishStartFilterIsVisible = ko.observable(false);
    this.publishEndFilterIsVisible = ko.observable(false);

    this.allFilterIsVisibleFunctions = [
        self.serviceProviderNameFilterIsVisible,
        self.packageFilterIsVisible,
        self.categoriesFilterIsVisible,
        self.featureFilterIsVisible,
        self.featureStartFilterIsVisible,
        self.featureEndFilterIsVisible,
        self.publishFilterIsVisible,
        self.publishStartFilterIsVisible,
        self.publishEndFilterIsVisible
    ];

    this.closeAllFilters = function()
    {
        self.closeAllGridFilters(self.allFilterIsVisibleFunctions);
    };

    // shows/hides particular filter
    this.toggleServiceProviderNameFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.serviceProviderNameFilterIsVisible);
    };

    this.togglePackageFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.packageFilterIsVisible);
    };

    this.toggleCategoriesFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.categoriesFilterIsVisible);
    };

    this.toggleFeatureFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.featureFilterIsVisible);
    };

    this.toggleFeatureStartFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.featureStartFilterIsVisible);
    };

    this.toggleFeatureEndFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.featureEndFilterIsVisible);
    };

    this.toggleFeatureEndFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.featureEndFilterIsVisible);
    };

    this.togglePublishFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.publishFilterIsVisible);
    };

    this.togglePublishStartFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.publishStartFilterIsVisible);
    };

    this.togglePublishEndFilter = function()
    {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.publishEndFilterIsVisible);
    };

    // checks if particular checkbox filter is applied
    this.publishFilterIsApplied = function()
    {
        return self.checkboxFilterIsApplied(self.filter.publish);
    };

    this.featureFilterIsApplied = function()
    {
        return self.checkboxFilterIsApplied(self.filter.feature);
    };

    this.packageFilterIsApplied = ko.observable(self.multiCheckboxFilterIsApplied(self.filter.packages));
    this.categoryFilterIsApplied = ko.observable(self.multiCheckboxFilterIsApplied(self.filter.categories));

    // clears particular filter
    this.clearServiceProviderNameFilter = function()
    {
        self.clearFilter(self.filter.serviceProviderName, self.filter.serviceProviderNameOption, true);
    };

    this.clearPackageFilter = function()
    {
        self.clearMultiCheckboxFilter(self.filter.packages, self.filter.packagesOption, self.packageFilterIsApplied);
    };

    this.clearCategoriesFilter = function()
    {
        self.clearMultiCheckboxFilter(self.filter.categories, self.filter.categoriesOption, self.categoryFilterIsApplied);
    };

    this.clearFeatureFilter = function()
    {
        self.clearFilter(self.filter.feature, self.filter.featureOption);
    };

    this.clearFeatureStartFilter = function()
    {
        self.clearFilter(self.filter.featureStart, self.filter.featureStartOption, true);
    };

    this.clearFeatureEndFilter = function()
    {
        self.clearFilter(self.filter.featureEnd, self.filter.featureEndOption, true);
    };

    this.clearPublishFilter = function()
    {
        self.clearFilter(self.filter.publish, self.filter.publishOption);
    };

    this.clearPublishStartFilter = function()
    {
        self.clearFilter(self.filter.publishStart, self.filter.publishStartOption, true);
    };

    this.clearPublishEndFilter = function()
    {
        self.clearFilter(self.filter.publishEnd, self.filter.publishEndOption, true);
    };


    this.serviceProviderNameFilterOnKeyDown = function(serviceProviderGrid, event)
    {
        if (event.keyCode === 13)
        {
            var srcElement = event.target || event.srcElement;
            // we must lose focus because otherwise value won't be updated ('onchange' won't be invoked)
            srcElement.blur();
            self.applyServiceProviderNameFilter();
        }
        return true;
    };

    this.applyServiceProviderNameFilter = function()
    {
        self.applyFilter(self.filter.serviceProviderName, self.filter.serviceProviderNameOption, true);
    };

    this.applyPackageFilter = function()
    {
        self.applyMultiCheckboxFilter(self.filter.packages, self.filter.packagesOption, self.packageFilterIsApplied);
    };

    this.applyCategoriesFilter = function()
    {
        self.applyMultiCheckboxFilter(self.filter.categories, self.filter.categoriesOption, self.categoryFilterIsApplied);
    };

    this.applyFeatureFilter = function()
    {
        self.applyFilter(self.filter.feature, self.filter.featureOption);
    };

    this.applyFeatureStartFilter = function()
    {
        self.applyFilter(self.filter.featureStart, self.filter.featureStartOption, true);
    };

    this.applyFeatureEndFilter = function()
    {
        self.applyFilter(self.filter.featureEnd, self.filter.featureEndOption, true);
    };

    this.applyPublishFilter = function()
    {
        self.applyFilter(self.filter.publish, self.filter.publishOption);
    };

    this.applyPublishStartFilter = function()
    {
        self.applyFilter(self.filter.publishStart, self.filter.publishStartOption, true);
    };

    this.applyPublishEndFilter = function()
    {
        self.applyFilter(self.filter.publishEnd, self.filter.publishEndOption, true);
    };

    /* ---------------filter ---------------------*/

    this.changePackage = function(serviceProvider)
    {
        return self.changePackageType(serviceProvider, 'serviceProviderId');
    };

    this.updateCategories = function(serviceProvider)
    {
        return self.updateSeniorHousingAndCareCategories(serviceProvider, 'serviceProviderId');
    };

    this.changeFeature = function(serviceProvider)
    {
        var result = self.changeCheckboxState({
            entity: serviceProvider,
            idName: 'serviceProviderId',
            url: self.changeFeatureDatesUrl,
            checkbox: serviceProvider.feature,
            showSelector: self.showFeatureDatesSelector,
            closeSelector: self.closeFeatureDatesSelector,
            startDate: serviceProvider.featureStartDate,
            endDate: serviceProvider.featureEndDate,
            selectedEndDate: serviceProvider.selectedFeatureEndDate,
            updateCheckboxState: self.updateFeatureState
        });
        return result;
    };

    this.changeFeatureDates = function(serviceProvider)
    {
        return self.changeDates({
            entity: serviceProvider,
            idName: 'serviceProviderId',
            url: self.changeFeatureDatesUrl,
            selectedStartDate: serviceProvider.selectedFeatureStartDate,
            selectedEndDate: serviceProvider.selectedFeatureEndDate,
            startDate: serviceProvider.featureStartDate,
            endDate: serviceProvider.featureEndDate,
            datesSelectorIsVisible: serviceProvider.featureDatesSelectorIsVisible,
            updateCheckboxState: self.updateFeatureState
        });
    };

    this.changePublish = function(serviceProvider)
    {
        var result = self.changeCheckboxState({
            entity: serviceProvider,
            idName: 'serviceProviderId',
            url: self.changePublishDatesUrl,
            checkbox: serviceProvider.publish,
            showSelector: self.showPublishDatesSelector,
            closeSelector: self.closePublishDatesSelector,
            startDate: serviceProvider.publishStartDate,
            endDate: serviceProvider.publishEndDate,
            selectedEndDate: serviceProvider.selectedPublishEndDate,
            updateCheckboxState: self.updatePublishState
        });
        return result;
    };

    this.changePublishDates = function(serviceProvider)
    {
        return self.changeDates({
            entity: serviceProvider,
            idName: 'serviceProviderId',
            url: self.changePublishDatesUrl,
            selectedStartDate: serviceProvider.selectedPublishStartDate,
            selectedEndDate: serviceProvider.selectedPublishEndDate,
            startDate: serviceProvider.publishStartDate,
            endDate: serviceProvider.publishEndDate,
            datesSelectorIsVisible: serviceProvider.publishDatesSelectorIsVisible,
            updateCheckboxState: self.updatePublishState
        });
    };

    /* +++++++++++++++++ 'show selector' handlers +++++++++++++++++ */

    this.showFeatureDatesSelector = function(serviceProvider)
    {
        self.showSelector(serviceProvider, serviceProvider.featureDatesSelectorIsVisible);
    };

    /* ----------------- 'show selector' handlers ----------------- */

    /* +++++++++++++++++ 'close selector' handlers +++++++++++++++++ */

    this.closeCategoriesSelector = function(serviceProvider)
    {
        serviceProvider.categoriesSelectorIsVisible(false);
    };

    this.closeFeatureDatesSelector = function(serviceProvider)
    {
        self.closeDatesSelector(serviceProvider, self.updateFeatureState, serviceProvider.featureDatesSelectorIsVisible);
    };

    /* ----------------- 'close selector' handlers ----------------- */

    this.closeAllSelectors = function()
    {
        ko.utils.arrayForEach(self.list(), function(serviceProvider)
        {
            serviceProvider.packageSelectorIsVisible(false);
            serviceProvider.categoriesSelectorIsVisible(false);

            if (serviceProvider.featureDatesSelectorIsVisible())
            {
                self.updateFeatureState(serviceProvider);
            }
            serviceProvider.featureDatesSelectorIsVisible(false);

            if (serviceProvider.publishDatesSelectorIsVisible())
            {
                self.updatePublishState(serviceProvider);
            }
            serviceProvider.publishDatesSelectorIsVisible(false);
        });
    };

    this.updateFeatureState = function(serviceProvider)
    {
        self.updateCheckboxState(serviceProvider.feature, serviceProvider.featureStartDate, serviceProvider.featureEndDate);
    };


    /* +++++++++++++++++ 'sort by' handlers +++++++++++++++++ */

    this.sortByServiceProviderName = function()
    {
        self.applySort('ServiceProvider');
    };

    this.sortByPackage = function()
    {
        self.applySort('Package');
    };

    this.sortByCategories = function()
    {
        self.applySort('Categories');
    };

    this.sortByFeature = function()
    {
        self.applySort('Feature');
    };

    this.sortByFeatureStart = function()
    {
        self.applySort('FeatureStart');
    };

    this.sortByFeatureEnd = function()
    {
        self.applySort('FeatureEnd');
    };

    this.sortByPublish = function()
    {
        self.applySort('Publish');
    };

    this.sortByPublishStart = function()
    {
        self.applySort('PublishStart');
    };

    this.sortByPublishEnd = function()
    {
        self.applySort('PublishEnd');
    };

    /* ----------------- 'sort by' handlers -----------------*/

    /*+++++++++++++++++++ 'overloaded' methods ++++++++++++*/
    this.getUrlParameters = function()
    {
        var urlParameters = [];
        if (self.paging.pageNumber() != window.defaultGridPageNumber)
        {
            urlParameters.push('pageNumber=' + self.paging.pageNumber());
        }
        if (self.paging.pageSize() != window.defaultGridPageSize)
        {
            urlParameters.push('pageSize=' + self.paging.pageSize());
        }
        var sortByValue = self.sortBy();
        if (sortByValue)
        {
            urlParameters.push('sortBy=' + sortByValue);
        }
        var orderBy = self.orderBy();
        if (orderBy)
        {
            urlParameters.push('orderBy=' + orderBy);
        }
        var serviceProvider = self.filter.serviceProviderName();
        if (serviceProvider)
        {
            urlParameters.push('serviceProvider=' + serviceProvider);
        }
        if (self.packageFilterIsApplied())
        {
            var result = [];
            var index = 0;
            ko.utils.arrayForEach(self.filter.packagesOption, function(item)
            {
                if (item.isChecked())
                {
                    result[index++] = item.value();
                }
            });
            urlParameters.push('packages=' + result.toString());
        }
        if (self.categoryFilterIsApplied())
        {
            var result = [];
            var index = 0;
            ko.utils.arrayForEach(self.filter.categoriesOption, function(item)
            {
                if (item.isChecked())
                {
                    result[index++] = item.value();
                }
            });
            urlParameters.push('categories=' + result.toString());
        }
        var feature = self.filter.feature();
        if (feature != null)
        {
            urlParameters.push('feature=' + feature);
        }
        var featureStart = self.filter.featureStart();
        if (featureStart)
        {
            urlParameters.push('featureStart=' + featureStart);
        }
        var featureEnd = self.filter.featureEnd();
        if (featureEnd)
        {
            urlParameters.push('featureEnd=' + featureEnd);
        }
        var publish = self.filter.publish();
        if (publish != null)
        {
            urlParameters.push('publish=' + publish);
        }
        var publishStart = self.filter.publishStart();
        if (publishStart)
        {
            urlParameters.push('publishStart=' + publishStart);
        }
        var publishEnd = self.filter.publishEnd();
        if (publishEnd)
        {
            urlParameters.push('publishEnd=' + publishEnd);
        }
        if (urlParameters.length)
        {
            urlParameters = '?' + urlParameters.join('&');
        }
        else
        {
            urlParameters = window.location.pathname;
        }
        return urlParameters;
    };

    this.setGridStateFromHistoryData = function(historyData)
    {
        if (!historyData)
        {
            return;
        }

        // paging
        self.paging.totalCount(historyData.paging.totalCount);
        self.paging.pageNumber(historyData.paging.pageNumber);
        self.paging.pageNumbers(historyData.paging.pageNumbers);
        self.paging.pages(historyData.paging.pages);
        self.paging.pageCount(historyData.paging.pageCount);
        self.paging.pageSize(historyData.paging.pageSize);
        self.paging.pageSizes(historyData.paging.pageSizes);
        self.paging.listCount(historyData.paging.listCount);

        // filter 
        function fillFilterFromHistory(fromHistory, toFilter)
        {
            ko.utils.arrayForEach(toFilter, function(item)
            {
                item.isChecked(fromHistory[item.value()]);
            });
        }

        fillFilterFromHistory(historyData.filter.packages, self.filter.packages);
        fillFilterFromHistory(historyData.filter.packagesOption, self.filter.packagesOption);
        fillFilterFromHistory(historyData.filter.categories, self.filter.categories);
        fillFilterFromHistory(historyData.filter.categoriesOption, self.filter.categoriesOption);
        self.packageFilterIsApplied(historyData.packageFilterIsApplied);
        self.categoryFilterIsApplied(historyData.categoryFilterIsApplied);
        
        self.filter.serviceProviderName(historyData.filter.serviceProviderName);
        self.filter.serviceProviderNameOption(historyData.filter.serviceProviderNameOption);
        self.filter.feature(historyData.filter.feature);
        self.filter.featureOption(historyData.filter.featureOption);
        self.filter.featureStart(historyData.filter.featureStart);
        self.filter.featureStartOption(historyData.filter.featureStartOption);
        self.filter.featureEnd(historyData.filter.featureEnd);
        self.filter.featureEndOption(historyData.filter.featureEndOption);
        self.filter.publish(historyData.filter.publish);
        self.filter.publishOption(historyData.filter.publishOption);
        self.filter.publishStartOption(historyData.filter.publishStart);
        self.filter.publishEnd(historyData.filter.publishEnd);
        self.filter.publishEndOption(historyData.filter.publishEndOption);
        //sort
        self.sortBy(historyData.sortBy);
        self.orderBy(historyData.orderBy);
    };

    // gets data for ajax request 
    this.getDataForGrid = function()
    {
        var result =
        {
            pageNumber: self.paging.pageNumber(),
            pageSize: self.paging.pageSize(),
            sortBy: self.sortBy(),
            orderBy: self.orderBy(),
            serviceProvider: self.filter.serviceProviderName(),
            feature: self.filter.feature(),
            featureStart: self.filter.featureStart(),
            featureEnd: self.filter.featureEnd(),
            publish: self.filter.publish(),
            publishStart: self.filter.publishStart(),
            publishEnd: self.filter.publishEnd()
        };
        if (self.packageFilterIsApplied())
        {
            var params = [];
            var index = 0;
            ko.utils.arrayForEach(self.filter.packagesOption, function(item)
            {
                if (item.isChecked())
                {
                    params[index++] = item.value();
                }
            });
            result['packages'] = params.toString();
        }
        if (self.categoryFilterIsApplied())
        {
            var params = [];
            var index = 0;
            ko.utils.arrayForEach(self.filter.categoriesOption, function(item)
            {
                if (item.isChecked())
                {
                    params[index++] = item.value();
                }
            });
            result['categories'] = params.toString();
        }
        return result;
    };
};

/*-----------------------------------------------------------constructors -----------------------------------------------*/

/* +++++++++++++++++ 'overriden' functions +++++++++++++++++ */

// 'overriden' function
function getHistoryData(serviceProviderGrid) {
    var historyData = new ServiceProviderGridHistoryData(serviceProviderGrid);
    return historyData;
}

// 'overriden' function
function historyDatasAreEqual(historyDataA, historyDataB) {
    var result = serviceProviderGridHistoryDatasAreEqual(historyDataA, historyDataB);
    return result;
};

/* ----------------- 'overriden' functions ----------------- */

// places cursor at the end of input text
function focusServiceProviderNameFilterTextBox() {
    this.value = this.value;
}

function serviceProviderGridHistoryDatasAreEqual(historyDataA, historyDataB) {
    var result = gridHistoryDatasAreEqual(historyDataA, historyDataB);
    if (result) {
        result = historyDataA.filter.serviceProviderName === historyDataB.filter.serviceProviderName
            && historyDataA.sortBy === historyDataB.sortBy
            && historyDataA.orderBy === historyDataB.orderB
            && historyDataA.filter.packages == historyDataB.filter.packages
            && historyDataA.packageFilterIsApplied == historyDataB.packageFilterIsApplied
            && historyDataA.filter.categories == historyDataB.filter.categories
            && historyDataA.categoryFilterIsApplied == historyDataB.categoryFilterIsApplied
            && historyDataA.filter.feature === historyDataB.filter.feature
            && historyDataA.filter.featureStart === historyDataB.filter.featureStart
            && historyDataA.filter.featureEnd === historyDataB.filter.featureEnd
            && historyDataA.filter.publish === historyDataB.filter.publish
            && historyDataA.filter.publishStart === historyDataA.filter.publishStart
            && historyDataA.filter.publishEnd === historyDataB.filter.publishEnd;
    }
    return result;
}