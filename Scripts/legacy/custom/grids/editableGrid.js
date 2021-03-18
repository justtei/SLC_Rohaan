// is used only for header filters
ko.bindingHandlers.slideVisible =
{
    init: function(element, valueAccessor)
    {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).toggle(value);
    },
    update: function(element, valueAccessor, allBindingsAccessor, grid)
    {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value)
        {
            // it is essential to check if element is hidden because without it:
            // click to show showcase filter -> click on any showcase or publish date -> 'update' is invoked twice -> this hides showcase or publish dates selector
            if ($(element).is(':hidden'))
            {
                grid.closeAllSelectors();
                $(element).show('slide', { direction: 'up' }, 200, function()
                {
                    $('.name-filter.filter input[type=text]').focus();
                    //$(document).on('click', grid.closeAllFiltersOnDocumentClick);
                    $(document).on('keydown', grid.closeAllFiltersOnEscKeyDown);
                });
            }
        }
        else
        {
            $(element).hide('slide', { direction: 'up' }, 200);
        }
    }
};


var convertFromBoolToCheckboxState = function(boolValue)
{
    var result;
    switch (boolValue)
    {
    case true:
        result = 'Checked';
        break;
    case false:
        result = 'Unchecked';
        break;
    default:
        result = 'Any';
        break;
    }
    return ko.observable(result);
};


// base grid for CommuityGrid and ServiceProviderGrid
// inherits 'Grid'
var EditableGrid = function()
{
    Grid.apply(this, arguments);
    var self = this;

    // generic method for changing package type
    this.changePackageType = function(entity, idName)
    {
        // update package only if it has been changed
        if (entity.selectedPackage() == entity.package())
        {
            entity.packageSelectorIsVisible(false);
            return;
        }

        var jsonData = {};
        jsonData[idName] = entity.id;
        jsonData.packageType = entity.selectedPackage();

        disableTableRow(entity);
        $.get(self.changePackageTypeUrl, jsonData).done(function(result)
        {
            enableTableRow(entity);
            if (result.success)
            {
                entity.package(entity.selectedPackage());
                entity.packageSelectorIsVisible(false);
            }
        }).fail(function()
        {
            enableTableRow(entity);
            showErrorMessage();
        });
    };

    // generic method for updating senior housing and care categories
    this.updateSeniorHousingAndCareCategories = function(entity, idName)
    {
        var currentCategories = [];
        ko.utils.arrayForEach(entity.currentCategories(), function(category)
        {
            if (category.isChecked())
            {
                currentCategories.push(category.value());
            }
        });

        var selectedCategories = [];
        ko.utils.arrayForEach(entity.selectedCategories(), function(category)
        {
            if (category.isChecked())
            {
                selectedCategories.push(category.value());
            }
        });

        // if user hasn't updated categories do nothing
        if (arraysAreEqual(currentCategories, selectedCategories))
        {
            entity.categoriesSelectorIsVisible(false);
            return;
        }

        var jsonData = {};
        jsonData[idName] = entity.id;
        jsonData.seniorHousingAndCareCategoryIds = selectedCategories;

        disableTableRow(entity);
        $.get(self.changeSeniorHousingAndCareCategoriesUrl, jsonData).done(function(result)
        {
            enableTableRow(entity);
            if (result.success)
            {
                ko.utils.arrayForEach(entity.currentCategories(), function(category)
                {
                    var value = category.value();
                    if (selectedCategories.indexOf(value) == -1)
                    {
                        category.isChecked(false);
                    }
                    else
                    {
                        category.isChecked(true);
                    }
                });
                entity.categoriesSelectorIsVisible(false);
            }
            else
            {
                showErrorMessage();
            }
        }).fail(function()
        {
            enableTableRow(entity);
            showErrorMessage();
        });
    };

    // checkboxes: 'showcase', 'publish', 'feature' click
    // inputData is json containing: entity, idName, url, checkbox, showSelector, closeSelector, startDate, endDate, selectedEndDate, updateCheckboxState
    this.changeCheckboxState = function(inputData)
    {
        if (inputData.checkbox())
        {
            inputData.showSelector(inputData.entity);
            inputData.checkbox(true);
            return true;
        }
        inputData.closeSelector(inputData.entity);

        var currentDate = new Date();
        var startDateString = inputData.startDate();
        var endDateString = inputData.endDate();
        if (!startDateString || !endDateString)
        {
            return true;
        }
        //dateString mm-dd-yyyy to array [mm,dd,yyyy]
        var dateArray = startDateString.split('-');
        //new Date(yyyy,mm,dd); mm from [0..11], dd from [1-31]
        var startDate = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
        dateArray = endDateString.split('-');
        var endDate = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
        if (currentDate > endDate && currentDate.toDateString() !== endDate.toDateString()
            || currentDate < startDate && currentDate.toDateString() !== startDate.toDateString())
        {
            return true;
        }
        var yesterdayDate = getDateString(currentDate.setDate(currentDate.getDate() - 1));

        var jsonData = {};
        jsonData[inputData.idName] = inputData.entity.id;

        // in order to convert js date object to string of format 'mm-dd-yyyy'
        // it is essential to add '1' to month because '0' is 'January'
        jsonData.startDate = [startDate.getMonth() + 1, startDate.getDate(), startDate.getFullYear()].join('-');
        jsonData.endDate = yesterdayDate;

        disableTableRow(inputData.entity);
        $.get(inputData.url, jsonData).done(function(result)
        {
            enableTableRow(inputData.entity);
            if (!result.success)
            {
                showErrorMessage();
            }
            else
            {
                inputData.selectedEndDate(yesterdayDate);
                inputData.endDate(yesterdayDate);
            }
            inputData.updateCheckboxState(inputData.entity);
        }).fail(function()
        {
            inputData.updateCheckboxState(inputData.entity);
            enableTableRow(inputData.entity);
            showErrorMessage();
        });
        return true;
    };

    // generic method for updating showcase, publish, features dates
    // inputData is json containing: entity, idName, url, selectedStartDate, selectedEndDate, startDate, endDate, datesSelectorIsVisible, updateCheckboxState
    this.changeDates = function(inputData)
    {
        // update dates only if they have been changed
        if (inputData.selectedStartDate() == inputData.startDate()
            && inputData.selectedEndDate() == inputData.endDate())
        {
            inputData.datesSelectorIsVisible(false);
            return;
        }

        var jsonData = {};
        jsonData[inputData.idName] = inputData.entity.id;
        jsonData.startDate = inputData.selectedStartDate();
        jsonData.endDate = inputData.selectedEndDate();

        disableTableRow(inputData.entity);
        $.get(inputData.url, jsonData).done(function(result)
        {
            enableTableRow(inputData.entity);
            if (!result.success)
            {
                showErrorMessage();
            }
            else
            {
                inputData.startDate(inputData.selectedStartDate());
                inputData.endDate(inputData.selectedEndDate());
                inputData.datesSelectorIsVisible(false);
            }
            inputData.updateCheckboxState(inputData.entity);
        }).fail(function()
        {
            self.updatePublishState(inputData.entity);
            enableTableRow(inputData.entity);
            showErrorMessage();
        });
    };

    /* +++++++++++++++++ 'show selector' handlers +++++++++++++++++ */

    // generic method for showing selector
    this.showSelector = function(entity, selectorIsVisible)
    {
        if (!entity.isDisabled())
        {
            self.closeAllSelectors();
            selectorIsVisible(true);
        }
    };

    this.showPackageSelector = function(entity)
    {
        self.showSelector(entity, entity.packageSelectorIsVisible);
    };

    this.showCategoriesSelector = function(entity)
    {
        self.showSelector(entity, entity.categoriesSelectorIsVisible);
    };

    this.showPublishDatesSelector = function(entity)
    {
        self.showSelector(entity, entity.publishDatesSelectorIsVisible);
    };

    /* ----------------- 'show selector' handlers ----------------- */

    /* +++++++++++++++++ 'close selector' handlers +++++++++++++++++ */

    this.closePackageSelector = function(entity)
    {
        entity.packageSelectorIsVisible(false);
    };

    this.closeDatesSelector = function(entity, updateCheckboxStateHandler, datesSelectorIsVisible)
    {
        updateCheckboxStateHandler(entity);
        datesSelectorIsVisible(false);
    };

    this.closePublishDatesSelector = function(entity)
    {
        self.closeDatesSelector(entity, self.updatePublishState, entity.publishDatesSelectorIsVisible);
    };

    /* ----------------- 'close selector' handlers ----------------- */

    /* +++++++++++++++++ 'update checkbox state' handlers +++++++++++++++++ */

    // updates state of checkbox ('showcase', 'publish' or 'feature') depending on start and end dates
    this.updateCheckboxState = function(checkbox, startDate, endDate)
    {
        var checkboxState = setCheckboxStateForDates(startDate(), endDate());
        checkbox(checkboxState);
    };

    this.updatePublishState = function(entity)
    {
        self.updateCheckboxState(entity.publish, entity.publishStartDate, entity.publishEndDate);
    };

    /* ----------------- 'update checkbox state' handlers ----------------- */

    /* ++++++++++++++++++ filter functions ++++++++++++++++++++++++++++++++++*/

    this.checkboxFilterIsApplied = function(filterBoolValue)
    {
        var result = filterBoolValue() != null;
        return result;
    };

    // shows/hides particular filters
    this.toggleFilter = function(allFilterIsVisibleFunctions, filterIsVisible)
    {
        // close all filters but current one
        ko.utils.arrayForEach(allFilterIsVisibleFunctions, function(filterIsVisibleFunction)
        {
            if (filterIsVisibleFunction != filterIsVisible)
            {
                filterIsVisibleFunction(false);
            }
        });

        $(document).off('keydown', self.closeAllFiltersOnEscKeyDown);
        //$(document).off('click', self.closeAllFiltersOnDocumentClick);
        if (filterIsVisible())
        {
            filterIsVisible(false);
        }
        else
        {
            filterIsVisible(true);
        }
    };

    this.closeAllGridFilters = function(allFilterIsVisibleFunctions)
    {
        ko.utils.arrayForEach(allFilterIsVisibleFunctions, function(item)
        {
            item(false);
        });
        //$(document).off('click', self.closeAllFiltersOnDocumentClick);
        $(document).off('keydown', self.closeAllFiltersOnEscKeyDown);
    };

    this.closeAllFiltersOnDocumentClick = function(e)
    {
        var srcElement = e.target || e.srcElement;
        if (!$(srcElement).hasClass('filter') && !$(srcElement).parents('.filter').length)
        {
            self.closeAllFilters();
        }
    };

    this.closeAllFiltersOnEscKeyDown = function(e)
    {
        if (e.keyCode == 27)
        {
            self.closeAllFilters();
        }
    };

    this.multiCheckboxFilterIsApplied = function(checkboxArray)
    {
        var result = false;
        ko.utils.arrayForEach(checkboxArray, function(item)
        {
            if (item.isChecked())
                result = true;
        });
        return result;
    };

    this.clearFilter = function(initialFilterOption, attemptedFilterOption, notCheckboxFilter)
    {
        var currentHistoryData = getHistoryData(self);
        self.paging.pageNumber(1);
        
        initialFilterOption(null);
        if (notCheckboxFilter)
        {
            attemptedFilterOption(null);
        }
        else
        {
            attemptedFilterOption('Any');
        }
        self.getGrid(currentHistoryData);
    };

    this.clearMultiCheckboxFilter = function(initialFilterOption, attemptedFilterOption, filterIsApplied)
    {
        var currentHistoryData = getHistoryData(self);
        self.paging.pageNumber(1);
        
        ko.utils.arrayForEach(initialFilterOption, function(item)
        {
            item.isChecked(false);
        });
        ko.utils.arrayForEach(attemptedFilterOption, function(item)
        {
            item.isChecked(false);
        });
        filterIsApplied(false);
        self.getGrid(currentHistoryData);
    };

    this.applyFilter = function(initialFilterOption, attemptedFilterOption, notCheckboxFilter)
    {
        var initialHistoryData = getHistoryData(self);
        self.paging.pageNumber(1);
        
        var initialValue = initialFilterOption();
        var attepmtedValue;
        if (notCheckboxFilter)
        {
            attepmtedValue = $.trim(attemptedFilterOption());
            if (attepmtedValue === '')
            {
                attemptedFilterOption(null);
                attepmtedValue = null;
            }
            else
            {
                // set trimmed value
                attemptedFilterOption(attepmtedValue);
            }
        }
        else
        {
            switch (attemptedFilterOption())
            {
            case 'Checked':
                attepmtedValue = true;
                break;
            case 'Unchecked':
                attepmtedValue = false;
                break;
            default:
                attepmtedValue = null;
            }
        }
        if (initialValue === attepmtedValue)
        {
            self.closeAllFilters();
        }
        else
        {
            initialFilterOption(attepmtedValue);
            self.getGrid(initialHistoryData);
        }
    };

    this.applyMultiCheckboxFilter = function(initialFilterOption, attemptedFilterOption, filterIsApplied)
    {
        var initialHistoryData = getHistoryData(self);
        self.paging.pageNumber(1);
        
        var isEqual = true;
        for (var i = 0; i < initialFilterOption.length; i++)
        {
            if (initialFilterOption[i].isChecked() != attemptedFilterOption[i].isChecked())
            {
                isEqual = false;
            }
        }
        //if initialFilterOption == attemptedFilterOption do nothing. Else copy values and change grid
        if (isEqual)
        {
            self.closeAllFilters();
        }
        else
        {
            var isAllUnChecked = true;
            for (var j = 0; j < initialFilterOption.length; j++)
            {
                initialFilterOption[j].isChecked(attemptedFilterOption[j].isChecked());
                if (initialFilterOption[j].isChecked())
                {
                    isAllUnChecked = false;
                }
            }
            filterIsApplied(!isAllUnChecked);
            self.getGrid(initialHistoryData);
        }
    };

    this.applySort = function(sortOption)
    {
        var initialHistoryData = getHistoryData(self);
        self.paging.pageNumber(1);

        var orderByOption = { Asc: 'Asc', Desc: 'Desc' };
        if (self.sortBy() == sortOption)
        {
            if (self.orderBy() == orderByOption.Asc)
            {
                self.orderBy(orderByOption.Desc);
            }
            else
            {
                self.sortBy(null);
                self.orderBy(null);
            }
        }
        else
        {
            self.sortBy(sortOption);
            self.orderBy(orderByOption.Asc);
        }

        self.getGrid(initialHistoryData);
    };

    /* ----------------- filter functions ----------------- */
}