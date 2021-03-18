function initializeCommunityGrid(initialData, sortBy, orderBy)
{
    // we have to set 'SortBy' and 'OrderBy' directly because enums are serialized into integers, not strings as required
    initialData.SortBy = sortBy;
    initialData.OrderBy = orderBy;
    
    window.viewModel = new CommunityGrid(initialData);
    ko.applyBindings(viewModel);

    customDatePicker(document.body);
    $('#communityNameHeader .filter input[type=text]').on('focus', focusCommunityNameFilterTextBox);

    return viewModel;
}

/* +++++++++++++++++++++++++++++++++++++++++++++++++++ constructors +++++++++++++++++++++++++++++++++++++++++++++++++++ */

// inherits 'GridHistoryData'
function CommunityGridHistoryData(communityGrid)
{
    GridHistoryData.apply(this, arguments);

    this.packageFilterIsApplied = communityGrid.packageFilterIsApplied();
    this.categoryFilterIsApplied = communityGrid.categoryFilterIsApplied();

    var self = this;
    this.filter = {};
    this.filter.community = communityGrid.filter.community();

    function multiCheckboxToHistory(filter,history)
    {
        ko.utils.arrayForEach(filter, function (item) 
        {
            history[item.value()] = item.isChecked();
        });
    }

    self.filter.currentFilterPackages = {};
    multiCheckboxToHistory(communityGrid.filter.currentFilterPackages, self.filter.currentFilterPackages);
    self.filter.selectedFilterPackages = {};
    multiCheckboxToHistory(communityGrid.filter.selectedFilterPackages,self.filter.selectedFilterPackages);
    self.filter.currentFilterCategories = {};
    multiCheckboxToHistory(communityGrid.filter.currentFilterCategories, self.filter.currentFilterCategories);
    self.filter.selectedFilterCategories = {};
    multiCheckboxToHistory(communityGrid.filter.selectedFilterCategories, self.filter.selectedFilterCategories);
    
    this.filter.showcaseStart = communityGrid.filter.showcaseStart();
    this.filter.showcaseStartOption = communityGrid.filter.showcaseStartOption(); 
    this.filter.showcaseEnd = communityGrid.filter.showcaseEnd();
    this.filter.showcaseEndOption = communityGrid.filter.showcaseEndOption();
    this.filter.publishStart = communityGrid.filter.publishStart();
    this.filter.publishStartStartOption = communityGrid.filter.publishStartOption();
    this.filter.publishEnd = communityGrid.filter.publishEnd();
    this.filter.publishEndOption = communityGrid.filter.publishEndOption();
    
    this.filter.aac = communityGrid.filter.aac();
    this.filter.aacOption = communityGrid.filter.aacOption();
    this.filter.aah = communityGrid.filter.aah();
    this.filter.aahOption = communityGrid.filter.aahOption();
    this.filter.shc = communityGrid.filter.shc();
    this.filter.shcOption = communityGrid.filter.shcOption();
    this.filter.showcase = communityGrid.filter.showcase();
    this.filter.showcaseOption = communityGrid.filter.showcaseOption();
    this.filter.publish = communityGrid.filter.publish();
    this.filter.publishOption = communityGrid.filter.publishOption();

    this.sortBy = communityGrid.sortBy();
    this.orderBy = communityGrid.orderBy();
}

var Filter = function (data)
{
    var self = this;

    this.community = ko.observable(data.Community);
    self.currentFilterPackages = [];
    self.selectedFilterPackages = [];
    ko.utils.arrayForEach(data.Packages, function (item)
    {
        self.currentFilterPackages.push(new CheckBox(item));
        self.selectedFilterPackages.push(new CheckBox(item));
    });
    
    self.currentFilterCategories = [];
    self.selectedFilterCategories = [];
    ko.utils.arrayForEach(data.SHCCategories, function (item)
    {
        self.currentFilterCategories.push(new CheckBox(item));
        self.selectedFilterCategories.push(new CheckBox(item));
    });
    
    this.showcaseStart = ko.observable(data.ShowcaseStart);
    this.showcaseEnd = ko.observable(data.ShowcaseEnd);
    this.publishStart = ko.observable(data.PublishStart);
    this.publishEnd = ko.observable(data.PublishEnd);

    this.aac = ko.observable(data.AAC);
    this.aah = ko.observable(data.AAH);
    this.shc = ko.observable(data.SHC);
    this.showcase = ko.observable(data.Showcase);
    this.publish = ko.observable(data.Publish);

    // options which are used directly in 'filter' selector
    this.communityOption = ko.observable(data.Community);
    this.showcaseStartOption = ko.observable(data.ShowcaseStart);
    this.showcaseEndOption = ko.observable(data.ShowcaseEnd);
    this.publishStartOption = ko.observable(data.PublishStart);
    this.publishEndOption = ko.observable(data.PublishEnd);
    this.aacOption = convertFromBoolToCheckboxState(data.AAC);
    this.aahOption = convertFromBoolToCheckboxState(data.AAH);
    this.shcOption = convertFromBoolToCheckboxState(data.SHC);
    this.showcaseOption = convertFromBoolToCheckboxState(data.Showcase);
    this.publishOption = convertFromBoolToCheckboxState(data.Publish);
};

var Community = function (data) 
{
    var self = this;

    this.isDisabled = ko.observable(false);
    this.id = data.Id;
    this.communityName = data.Name;

    /* book number */
    this.bookNumber = data.BookNumber;

    /* package */
    this.package = ko.observable(data.Package);
    this.selectedPackage = ko.observable(data.Package);
    this.packages = data.Packages;
    this.packageSelectorIsVisible = ko.observable(false);

    this.ActiveAdultCommunities = ko.observable(data.ActiveAdultCommunities);
    this.ActiveAdultHomes = ko.observable(data.ActiveAdultHomes);
    this.SeniorHousingAndCare = ko.observable(data.SeniorHousingAndCare);
    this.packageCount = ko.computed(function() {
        var result = 0;

        if (self.ActiveAdultCommunities()) {
            result++;
        }
        if (self.ActiveAdultHomes()) {
            result++;
        }
        if (self.SeniorHousingAndCare()) {
            result++;
        }

        return result;
    });

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
    this.categoriesSelectorIsVisible = ko.observable(false);
    this.categories = ko.computed(function () 
    {
        var result = '';
        ko.utils.arrayForEach(self.currentCategories(), function (category) 
        {
            if (category.isChecked()) {
                if (result != '') {
                    result += ', ';
                }
                result += category.text();
            }
        });
        return result;
    });

    /* showcase */
    this.showcaseStartDate = ko.observable(getDateString(data.ShowcaseStartDate));
    this.selectedShowcaseStartDate = ko.observable(getDateString(data.ShowcaseStartDate));
    this.showcaseEndDate = ko.observable(getDateString(data.ShowcaseEndDate));
    this.selectedShowcaseEndDate = ko.observable(getDateString(data.ShowcaseEndDate));
    var shocaseState = setCheckboxStateForDates(self.showcaseStartDate(), self.showcaseEndDate());
    this.showcase = ko.observable(shocaseState);
    this.showcaseDatesSelectorIsVisible = ko.observable(false);

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
var CommunityGrid = function(data)
{
    EditableGrid.apply(this, arguments);
    var self = this;

    /* urls */
    this.gridUrl = data.GridUrl;
    this.jsonGridUrl = data.JsonGridUrl;
    this.changeListingTypeStateUrl = data.ChangeListingTypeStateUrl;
    this.changePackageTypeUrl = data.ChangePackageTypeUrl;
    this.changeSeniorHousingAndCareCategoriesUrl = data.ChangeSeniorHousingAndCareCategoriesUrl;
    this.changeShowcaseDatesUrl = data.ChangeShowcaseDatesUrl;
    this.changePublishDatesUrl = data.ChangePublishDatesUrl;
    this.deleteCommunityUrl = data.DeleteCommunityUrl;

    this.getList = function(communityGrid)
    {
        var list = [];
        for (var i = 0; i < communityGrid.List.length; i++)
        {
            var communityForList = new Community(communityGrid.List[i]);
            list.push(communityForList);
        }
        return list;
    };

    this.list = ko.observableArray(self.getList(data));
    this.sortBy = ko.observable(data.SortBy);
    this.orderBy = ko.observable(data.OrderBy);

    /* +++++++++++++++++ filter +++++++++++++++++ */

    this.filter = new Filter(data.Filter);
    this.checkboxFilterOptions = ['Checked', 'Unchecked', 'Any'];

    this.communityNameFilterIsVisible = ko.observable(false);
    this.communityPackageFilterIsVisible = ko.observable(false);
    this.showcaseStartFilterIsVisible = ko.observable(false);
    this.showcaseEndFilterIsVisible = ko.observable(false);
    this.publishStartFilterIsVisible = ko.observable(false);
    this.publishEndFilterIsVisible = ko.observable(false);
    this.categoriesFilterIsVisible = ko.observable(false);
    this.activeAdultCommunitiesFilterIsVisible = ko.observable(false);
    this.activeAdultHomesFilterIsVisible = ko.observable(false);
    this.seniorHousingAndCareFilterIsVisible = ko.observable(false);
    this.showcaseFilterIsVisible = ko.observable(false);
    this.publishFilterIsVisible = ko.observable(false);

    this.allFilterIsVisibleFunctions = [
        self.communityNameFilterIsVisible,
        self.communityPackageFilterIsVisible,
        self.showcaseStartFilterIsVisible,
        self.showcaseEndFilterIsVisible,
        self.publishStartFilterIsVisible,
        self.publishEndFilterIsVisible,
        self.activeAdultCommunitiesFilterIsVisible,
        self.activeAdultHomesFilterIsVisible,
        self.seniorHousingAndCareFilterIsVisible,
        self.showcaseFilterIsVisible,
        self.publishFilterIsVisible,
        self.categoriesFilterIsVisible
    ];

    this.closeAllFilters = function()
    {
        self.closeAllGridFilters(self.allFilterIsVisibleFunctions);
    };

    this.toggleCommunityNameFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.communityNameFilterIsVisible);
    };

    this.toggleCommunityPackageFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.communityPackageFilterIsVisible);
    };

    this.toggleShowcaseStartFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.showcaseStartFilterIsVisible);
    };

    this.toggleShowcaseEndFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.showcaseEndFilterIsVisible);
    };

    this.togglePublishStartFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.publishStartFilterIsVisible);
    };

    this.togglePublishEndFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.publishEndFilterIsVisible);
    };

    this.toggleCategoriesFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.categoriesFilterIsVisible);
    };

    this.toggleActiveAdultCommunitiesFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.activeAdultCommunitiesFilterIsVisible);
    };

    this.toggleActiveAdultHomesFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.activeAdultHomesFilterIsVisible);
    };

    this.toggleSeniorHousingAndCareFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.seniorHousingAndCareFilterIsVisible);
    };

    this.toggleShowcaseFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.showcaseFilterIsVisible);
    };

    this.togglePublishFilter = function () {
        self.toggleFilter(self.allFilterIsVisibleFunctions, self.publishFilterIsVisible);
    };

    this.aacFilterIsApplied = function()
    {
        return self.checkboxFilterIsApplied(self.filter.aac);
    };

    this.aahFilterIsApplied = function()
    {
        return self.checkboxFilterIsApplied(self.filter.aah);
    };

    this.shcFilterIsApplied = function()
    {
        return self.checkboxFilterIsApplied(self.filter.shc);
    };

    this.showcaseFilterIsApplied = function()
    {
        return self.checkboxFilterIsApplied(self.filter.showcase);
    };

    this.publishFilterIsApplied = function()
    {
        return self.checkboxFilterIsApplied(self.filter.publish);
    };

    this.packageFilterIsApplied = ko.observable(self.multiCheckboxFilterIsApplied(self.filter.currentFilterPackages));
    this.categoryFilterIsApplied = ko.observable(self.multiCheckboxFilterIsApplied(self.filter.currentFilterCategories));

    this.clearCommunityNameFilter = function()
    {
        self.clearFilter(self.filter.community, self.filter.communityOption, true);
    };

    this.clearCommunityPackageFilter = function()
    {
        self.clearMultiCheckboxFilter(self.filter.currentFilterPackages, self.filter.selectedFilterPackages, self.packageFilterIsApplied);
    };

    this.clearShowcaseStartFilter = function()
    {
        self.clearFilter(self.filter.showcaseStart, self.filter.showcaseStartOption, true);
    };

    this.clearShowcaseEndFilter = function()
    {
        self.clearFilter(self.filter.showcaseEnd, self.filter.showcaseEndOption, true);
    };

    this.clearPublishStartFilter = function()
    {
        self.clearFilter(self.filter.publishStart, self.filter.publishStartOption, true);
    };

    this.clearPublishEndFilter = function()
    {
        self.clearFilter(self.filter.publishEnd, self.filter.publishEndOption, true);
    };

    this.clearCategoriesFilter = function()
    {
        self.clearMultiCheckboxFilter(self.filter.currentFilterCategories, self.filter.selectedFilterCategories, self.categoryFilterIsApplied);
    };

    this.clearAACFilter = function()
    {
        self.clearFilter(self.filter.aac, self.filter.aacOption);
    };

    this.clearAAHFilter = function()
    {
        self.clearFilter(self.filter.aah, self.filter.aahOption);
    };

    this.clearSHCFilter = function()
    {
        self.clearFilter(self.filter.shc, self.filter.shcOption);
    };

    this.clearShowcaseFilter = function()
    {
        self.clearFilter(self.filter.showcase, self.filter.showcaseOption);
    };

    this.clearPublishFilter = function()
    {
        self.clearFilter(self.filter.publish, self.filter.publishOption);
    };

    this.communityNameFilterOnKeyDown = function(communityGrid, event)
    {
        if (event.keyCode === 13)
        {
            var srcElement = event.target || event.srcElement;
            // we must lose focus because otherwise value won't be updated ('onchange' won't be invoked)
            srcElement.blur();
            self.applyCommunityNameFilter();
        }
        return true;
    };

    this.applyCommunityNameFilter = function()
    {
        self.applyFilter(self.filter.community, self.filter.communityOption, true);
    };

    this.applyCommunityPackageFilter = function()
    {
        self.applyMultiCheckboxFilter(self.filter.currentFilterPackages, self.filter.selectedFilterPackages, self.packageFilterIsApplied);
    };

    this.applyShowcaseStartFilter = function()
    {
        self.applyFilter(self.filter.showcaseStart, self.filter.showcaseStartOption, true);
    };

    this.applyShowcaseEndFilter = function()
    {
        self.applyFilter(self.filter.showcaseEnd, self.filter.showcaseEndOption, true);
    };

    this.applyPublishStartFilter = function()
    {
        self.applyFilter(self.filter.publishStart, self.filter.publishStartOption, true);
    };

    this.applyPublishEndFilter = function()
    {
        self.applyFilter(self.filter.publishEnd, self.filter.publishEndOption, true);
    };

    this.applyCategoriesFilter = function()
    {
        self.applyMultiCheckboxFilter(self.filter.currentFilterCategories, self.filter.selectedFilterCategories, self.categoryFilterIsApplied);
    };

    this.applyAACFilter = function()
    {
        self.applyFilter(self.filter.aac, self.filter.aacOption);
    };

    this.applyAAHFilter = function()
    {
        self.applyFilter(self.filter.aah, self.filter.aahOption);
    };

    this.applySHCFilter = function()
    {
        self.applyFilter(self.filter.shc, self.filter.shcOption);
    };

    this.applyShowcaseFilter = function()
    {
        self.applyFilter(self.filter.showcase, self.filter.showcaseOption);
    };

    this.applyPublishFilter = function()
    {
        self.applyFilter(self.filter.publish, self.filter.publishOption);
    };

    /* ----------------- filter ----------------- */

    this.changePackage = function(community)
    {
        return self.changePackageType(community, 'communityId');
    };

    this.changeActiveAdultCommunities = function(community)
    {
        return changeListingTypeState(community, 'ActiveAdultCommunities');
    };

    this.changeActiveAdultHomes = function(community)
    {
        return changeListingTypeState(community, 'ActiveAdultHomes');
    };

    this.changeSeniorHousingAndCare = function(community)
    {
        self.closeAllSelectors();
        var attemptedValue = community.SeniorHousingAndCare();
        if (attemptedValue)
        {
            self.showCategoriesSelector(community);
            return true;
        }
        else if (!community.categories())
        {
            ko.utils.arrayForEach(community.currentCategories(), function(category)
            {
                category.isChecked(false);
            });
            ko.utils.arrayForEach(community.selectedCategories(), function(category)
            {
                category.isChecked(false);
            });
            community.categoriesSelectorIsVisible(false);
            return true;
        }

        disableTableRow(community);
        $.get(self.changeListingTypeStateUrl, {
            communityId: community.id,
            listingType: 'SeniorHousingAndCare',
            value: false
        }).done(function(result)
        {
            enableTableRow(community);
            if (!result.success)
            {
                community.SeniorHousingAndCare(!attemptedValue);
                showErrorMessage();
            }
            else
            {
                ko.utils.arrayForEach(community.currentCategories(), function(category)
                {
                    category.isChecked(false);
                });
                ko.utils.arrayForEach(community.selectedCategories(), function(category)
                {
                    category.isChecked(false);
                });
                community.categoriesSelectorIsVisible(false);
            }
        }).fail(function()
        {
            enableTableRow(community);
            community.SeniorHousingAndCare(!attemptedValue);
            showErrorMessage();
        });
        return true;
    };

    this.updateCategories = function(community)
    {
        return self.updateSeniorHousingAndCareCategories(community, 'communityId');
    };

    this.changeShowcase = function(community)
    {
        var result = self.changeCheckboxState({
            entity: community,
            idName: 'communityId',
            url: self.changeShowcaseDatesUrl,
            checkbox: community.showcase,
            showSelector: self.showShowcaseDatesSelector,
            closeSelector: self.closeShowcaseDatesSelector,
            startDate: community.showcaseStartDate,
            endDate: community.showcaseEndDate,
            selectedEndDate: community.selectedShowcaseEndDate,
            updateCheckboxState: self.updateShowcaseState
        });
        return result;
    };

    this.changeShowcaseDates = function(community)
    {
        return self.changeDates({
            entity: community,
            idName: 'communityId',
            url: self.changeShowcaseDatesUrl,
            selectedStartDate: community.selectedShowcaseStartDate,
            selectedEndDate: community.selectedShowcaseEndDate,
            startDate: community.showcaseStartDate,
            endDate: community.showcaseEndDate,
            datesSelectorIsVisible: community.showcaseDatesSelectorIsVisible,
            updateCheckboxState: self.updateShowcaseState
        });
    };

    this.changePublish = function(community)
    {
        var result = self.changeCheckboxState({
            entity: community,
            idName: 'communityId',
            url: self.changePublishDatesUrl,
            checkbox: community.publish,
            showSelector: self.showPublishDatesSelector,
            closeSelector: self.closePublishDatesSelector,
            startDate: community.publishStartDate,
            endDate: community.publishEndDate,
            selectedEndDate: community.selectedPublishEndDate,
            updateCheckboxState: self.updatePublishState
        });
        return result;
    };

    this.changePublishDates = function(community)
    {
        return self.changeDates({
            entity: community,
            idName: 'communityId',
            url: self.changePublishDatesUrl,
            selectedStartDate: community.selectedPublishStartDate,
            selectedEndDate: community.selectedPublishEndDate,
            startDate: community.publishStartDate,
            endDate: community.publishEndDate,
            datesSelectorIsVisible: community.publishDatesSelectorIsVisible,
            updateCheckboxState: self.updatePublishState
        });
    };

    this.deleteCommunity = function(community, event)
    {
        var confirmDialog = $('#dialogConfirm');
        confirmDialog.find('.delete-community-name').text(community.communityName.toString());
        confirmDialog.dialog(
            {
                position: [event.pageX - 300 - window.scrollX, event.pageY - window.scrollY],
                resizable: false,
                modal: true,
                buttons:
                {
                    OK: function()
                    {
                        $(this).dialog('close');
                        var dataForGrid = $.extend(self.getDataForGrid(), { communityId: community.id });
                        disableTableRow(community);
                        $.get(self.deleteCommunityUrl, dataForGrid).done(function(result)
                        {
                            enableTableRow(community);
                            if (!result.success)
                            {
                                showErrorMessage();
                            }
                            else
                            {
                                // updates 'totalCount' in order to refresh 'pageInfo'
                                var totalCount = self.paging.totalCount() - 1;
                                self.paging.totalCount(totalCount);

                                self.list.remove(community);
                                if (result.community)
                                {
                                    var lastCommunity = new Community(result.community);
                                    self.list.push(lastCommunity);
                                    customDatePicker($('table.grid input:hidden[value=' + lastCommunity.id + ']').parents('tr'));
                                }
                                else
                                {
                                    // updates 'listCount' in order to refresh 'pageInfo'
                                    var listCount = self.paging.listCount() - 1;
                                    self.paging.listCount(listCount);
                                }
                            }
                        }).fail(function()
                        {
                            enableTableRow(community);
                            showErrorMessage();
                        });
                    },
                    Cancel: function()
                    {
                        $(this).dialog('close');
                    }
                }
            });
    };

    /* +++++++++++++++++ 'show selector' handlers +++++++++++++++++ */

    this.showShowcaseDatesSelector = function(community)
    {
        self.showSelector(community, community.showcaseDatesSelectorIsVisible);
    };

    /* ----------------- 'show selector' handlers ----------------- */

    /* +++++++++++++++++ 'close selector' handlers +++++++++++++++++ */

    this.closeCategoriesSelector = function(community)
    {
        if (!community.categories())
        {
            community.SeniorHousingAndCare(false);
        }
        community.categoriesSelectorIsVisible(false);
    };

    this.closeShowcaseDatesSelector = function(community)
    {
        self.closeDatesSelector(community, self.updateShowcaseState, community.showcaseDatesSelectorIsVisible);
    };

    /* ----------------- 'close selector' handlers ----------------- */

    /* +++++++++++++++++ 'sort by' handlers +++++++++++++++++ */

    this.sortByCommunityName = function()
    {
        self.applySort('Community');
    };

    this.sortByBookNumber = function()
    {
        self.applySort('BookNumber');
    };

    this.sortByPackage = function()
    {
        self.applySort('Package');
    };

    this.sortByActiveAdultCommunities = function()
    {
        self.applySort('AAC');
    };

    this.sortByActiveAdultHomes = function()
    {
        self.applySort('AAH');
    };

    this.sortBySeniorHousingAndCare = function()
    {
        self.applySort('SHC');
    };

    this.sortByShowcase = function()
    {
        self.applySort('Showcase');
    };

    this.sortByShowcaseStartDate = function()
    {
        self.applySort('ShowcaseStart');
    };

    this.sortByShowcaseEndDate = function()
    {
        self.applySort('ShowcaseEnd');
    };

    this.sortByPublish = function()
    {
        self.applySort('Publish');
    };

    this.sortByPublishStartDate = function()
    {
        self.applySort('PublishStart');
    };

    this.sortByPublishEndDate = function()
    {
        self.applySort('PublishEnd');
    };

    /* ----------------- 'sort by' handlers ----------------- */

    /* +++++++++++++++++ 'overloaded' methods +++++++++++++++++ */

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
        var community = self.filter.community();
        if (community)
        {
            urlParameters.push('community=' + community);
        }
        if (self.packageFilterIsApplied())
        {
            var result = [];
            var index = 0;
            ko.utils.arrayForEach(self.filter.selectedFilterPackages, function(item)
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
            ko.utils.arrayForEach(self.filter.selectedFilterCategories, function(item)
            {
                if (item.isChecked())
                {
                    result[index++] = item.value();
                }
            });
            urlParameters.push('shcCategories=' + result.toString());
        }
        var showcaseStart = self.filter.showcaseStart();
        if (showcaseStart != null)
        {
            urlParameters.push('showcaseStart=' + showcaseStart);
        }
        var showcaseEnd = self.filter.showcaseEnd();
        if (showcaseEnd != null)
        {
            urlParameters.push('showcaseEnd=' + showcaseEnd);
        }
        var publishStart = self.filter.publishStart();
        if (publishStart != null)
        {
            urlParameters.push('publishStart=' + publishStart);
        }
        var publishEnd = self.filter.publishEnd();
        if (publishEnd != null)
        {
            urlParameters.push('publishEnd=' + publishEnd);
        }
        var aac = self.filter.aac();
        if (aac != null)
        {
            urlParameters.push('aac=' + aac);
        }
        var aah = self.filter.aah();
        if (aah != null)
        {
            urlParameters.push('aah=' + aah);
        }
        var shc = self.filter.shc();
        if (shc != null)
        {
            urlParameters.push('shc=' + shc);
        }
        var showcase = self.filter.showcase();
        if (showcase != null)
        {
            urlParameters.push('showcase=' + showcase);
        }
        var publish = self.filter.publish();
        if (publish != null)
        {
            urlParameters.push('publish=' + publish);
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
        self.filter.community(historyData.filter.community);
        self.filter.communityOption(historyData.filter.community);

        ko.utils.arrayForEach(self.filter.currentFilterPackages, function(item)
        {
            item.isChecked(historyData.filter.currentFilterPackages[item.value()]);
        });
        ko.utils.arrayForEach(self.filter.selectedFilterPackages, function(item)
        {
            item.isChecked(historyData.filter.selectedFilterPackages[item.value()]);
        });
        ko.utils.arrayForEach(self.filter.currentFilterCategories, function(item)
        {
            item.isChecked(historyData.filter.currentFilterCategories[item.value()]);
        });
        ko.utils.arrayForEach(self.filter.selectedFilterCategories, function(item)
        {
            item.isChecked(historyData.filter.selectedFilterCategories[item.value()]);
        });
        self.packageFilterIsApplied(historyData.packageFilterIsApplied);
        self.categoryFilterIsApplied(historyData.categoryFilterIsApplied);
        self.filter.showcaseStart(historyData.filter.showcaseStart);
        self.filter.showcaseStartOption(historyData.filter.showcaseStartOption);
        self.filter.showcaseEnd(historyData.filter.showcaseEnd);
        self.filter.showcaseEndOption(historyData.filter.showcaseEndOption);
        self.filter.publishStart(historyData.filter.publishStart);
        self.filter.publishStartOption(historyData.filter.publishStartOption);
        self.filter.publishEnd(historyData.filter.publishEnd);
        self.filter.publishEndOption(historyData.filter.publishEndOption);

        self.filter.aac(historyData.filter.aac);
        self.filter.aacOption(historyData.filter.aacOption);
        self.filter.aah(historyData.filter.aah);
        self.filter.aahOption(historyData.filter.aahOption);
        self.filter.shc(historyData.filter.shc);
        self.filter.shcOption(historyData.filter.shcOption);
        self.filter.showcase(historyData.filter.showcase);
        self.filter.showcaseOption(historyData.filter.showcaseOption);
        self.filter.publish(historyData.filter.publish);
        self.filter.publishOption(historyData.filter.publishOption);

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
            Community: self.filter.community(),
            ShowcaseStart: self.filter.showcaseStart(),
            ShowcaseEnd: self.filter.showcaseEnd(),
            PublishStart: self.filter.publishStart(),
            PublishEnd: self.filter.publishEnd(),
            AAC: self.filter.aac(),
            AAH: self.filter.aah(),
            SHC: self.filter.shc(),
            Showcase: self.filter.showcase(),
            Publish: self.filter.publish()
        };
        if (self.packageFilterIsApplied())
        {
            var params = [];
            var index = 0;
            ko.utils.arrayForEach(self.filter.selectedFilterPackages, function(item)
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
            ko.utils.arrayForEach(self.filter.selectedFilterCategories, function(item)
            {
                if (item.isChecked())
                {
                    params[index++] = item.value();
                }
            });
            result['shcCategories'] = params.toString();
        }
        return result;
    };

    /* ----------------- 'overloaded' methods ----------------- */

    this.closeAllSelectors = function()
    {
        ko.utils.arrayForEach(self.list(), function(community)
        {
            community.packageSelectorIsVisible(false);
            // if user checked 'Senior Housing And Care' and now is selecting categories
            if (!community.categories() && community.categoriesSelectorIsVisible())
            {
                community.SeniorHousingAndCare(false);
            }
            community.categoriesSelectorIsVisible(false);

            if (community.showcaseDatesSelectorIsVisible())
            {
                self.updateShowcaseState(community);
            }
            community.showcaseDatesSelectorIsVisible(false);

            if (community.publishDatesSelectorIsVisible())
            {
                self.updatePublishState(community);
            }
            community.publishDatesSelectorIsVisible(false);
        });
    };

    this.updateShowcaseState = function(community)
    {
        self.updateCheckboxState(community.showcase, community.showcaseStartDate, community.showcaseEndDate);
    };

    function changeListingTypeState(community, listingType)
    {
        var attemptedValue = community[listingType]();
        
        if (community.packageCount() === 0 && !attemptedValue) {
            return false;
        }

        disableTableRow(community);
        $.get(self.changeListingTypeStateUrl, {
            communityId: community.id,
            listingType: listingType,
            value: attemptedValue
        }).done(function(result)
        {
            enableTableRow(community);
            if (!result.success)
            {
                community[listingType](!attemptedValue);
                showErrorMessage();
            }
        }).fail(function()
        {
            enableTableRow(community);
            community[listingType](!attemptedValue);
            showErrorMessage();
        });
        return true;
    }
};

/* --------------------------------------------------- constructors --------------------------------------------------- */

/* +++++++++++++++++ 'overriden' functions +++++++++++++++++ */

// 'overriden' function
function getHistoryData(communityGrid)
{
    var historyData = new CommunityGridHistoryData(communityGrid);
    return historyData;
}

// 'overriden' function
function historyDatasAreEqual(historyDataA, historyDataB)
{
    var result = communityGridHistoryDatasAreEqual(historyDataA, historyDataB);
    return result;
};

/* ----------------- 'overriden' functions ----------------- */

// places cursor at the end of input text
function focusCommunityNameFilterTextBox()
{
    this.value = this.value;
}

function communityGridHistoryDatasAreEqual(historyDataA, historyDataB)
{
    var result = gridHistoryDatasAreEqual(historyDataA, historyDataB);
    if (result) {
        result = historyDataA.filter.community === historyDataB.filter.community
                && historyDataA.filter.currentFilterPackages == historyDataB.filter.currentFilterPackages
                && historyDataA.packageFilterIsApplied == historyDataB.packageFilterIsApplied
                && historyDataA.filter.currentFilterCategories == historyDataB.filter.currentFilterCategories
                && historyDataA.categoryFilterIsApplied == historyDataB.categoryFilterIsApplied
                && historyDataA.filter.showcaseStart == historyDataB.filter.showcaseStart
                && historyDataA.filter.showcaseEnd == historyDataB.filter.showcaseEnd
                && historyDataA.filter.publishStart == historyDataB.filter.publishEStart
                && historyDataA.filter.publishEnd == historyDataB.filter.publishEnd
                && historyDataA.filter.aac === historyDataB.filter.aac
                && historyDataA.filter.aah === historyDataB.filter.aah
                && historyDataA.filter.shc === historyDataB.filter.shc
                && historyDataA.filter.showcase === historyDataB.filter.showcase
                && historyDataA.filter.publish === historyDataB.filter.publish
                && historyDataA.sortBy === historyDataB.sortBy
                && historyDataA.orderBy === historyDataB.orderBy;
    }
    return result;
};