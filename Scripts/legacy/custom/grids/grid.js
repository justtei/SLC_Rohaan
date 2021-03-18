// in order to pass array to mvc Action via AJAX
$.ajaxSettings.traditional = true;

window.onpopstate = function (event)
{
    if (event.state === null)
    {
        var historyData = getHistoryData(window.viewModel);
        window.history.replaceState(historyData);
    }
    else
    {
        var currentHistoryData = getHistoryData(window.viewModel);
        if (historyDatasAreEqual(event.state, currentHistoryData))
        {
            return;
        }
        window.viewModel.setGridStateFromHistoryData(event.state);
        window.viewModel.getGrid(currentHistoryData, true);
    }
};

ko.bindingHandlers.fadeVisible =
{
    init: function (element, valueAccessor)
    {
        var value = valueAccessor();
        $(element).toggle(ko.utils.unwrapObservable(value));
    },
    update: function (element, valueAccessor)
    {
        var value = valueAccessor();
        ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).hide();
    }
};

// sets attr 'selected' depending on received value (only for <select>)
ko.bindingHandlers.selected =
{
    init: function (element, valueAccessor)
    {
        var value = valueAccessor();
        if (value)
        {
            $(element).prop('selected', true);
        }
    },
    update: function (element, valueAccessor)
    {
        ko.bindingHandlers.selected.init(element, valueAccessor);
    }
};

/* +++++++++++++++++++++++++++++++++++++++++++++++++++ constructors +++++++++++++++++++++++++++++++++++++++++++++++++++ */

function GridHistoryData(grid)
{
    this.paging = {};

    this.paging.totalCount = grid.paging.totalCount();
    this.paging.pageNumber = grid.paging.pageNumber();
    this.paging.pageNumbers = grid.paging.pageNumbers();
    this.paging.pages = grid.paging.pages();
    this.paging.pageCount = grid.paging.pageCount();
    this.paging.pageSize = grid.paging.pageSize();
    this.paging.pageSizes = grid.paging.pageSizes();
    this.paging.listCount = grid.paging.listCount();
}

var CheckBox = function (data)
{
    this.isChecked = ko.observable(data.IsChecked);
    this.value = ko.observable(data.Value);
    this.text = ko.observable(data.Text);
};

var Paging = function (data)
{
    var self = this;

    this.totalCount = ko.observable(data.TotalCount);
    this.pageNumber = ko.observable(data.PageNumber);
    this.pageNumbers = ko.observableArray([]);
    ko.utils.arrayForEach(data.PageNumbers, function (pageNumber)
    {
        self.pageNumbers().push(parseInt(pageNumber.Value));
    });
    this.pages = ko.observableArray(data.Pages);
    this.pageCount = ko.observable(data.PageCount);
    this.pageSize = ko.observable(data.PageSize);
    this.pageSizes = ko.observableArray([]);
    ko.utils.arrayForEach(data.PageSizes, function (pageSize)
    {
        self.pageSizes().push(parseInt(pageSize.Value));
    });
    this.listCount = ko.observable(data.List.length);

    this.pageInfo = ko.computed(function ()
    {
        var firstRecordNumber = self.pageSize() * (self.pageNumber() - 1) + 1;
        var lastRecordNumber = firstRecordNumber + self.listCount() - 1;
        var result = lastRecordNumber > self.totalCount() && self.pageInfo
            ? self.pageInfo()
            : firstRecordNumber + ' - ' + lastRecordNumber + ' of ' + self.totalCount();
        return result;
    });
};

var Grid = function (data)
{
    var self = this;

    this.gridUrl = '';
    this.jsonGridUrl = '';
    this.paging = new Paging(data);
    this.list = ko.observableArray([]);

    this.goToFirstPage = function ()
    {
        var currentHistoryData = getHistoryData(window.viewModel);
        self.paging.pageNumber(1);
        self.getGrid(currentHistoryData);
    };

    this.goToPreviousPage = function ()
    {
        var currentHistoryData = getHistoryData(window.viewModel);
        var previousPageNumber = self.paging.pageNumber() - 1;
        self.paging.pageNumber(previousPageNumber);
        self.getGrid(currentHistoryData);
    };

    this.goToPage = function (pageNumber)
    {
        if (pageNumber === self.paging.pageNumber())
        {
            return;
        }
        var currentHistoryData = getHistoryData(window.viewModel);
        self.paging.pageNumber(pageNumber);
        self.getGrid(currentHistoryData);
    };

    this.goToNextPage = function ()
    {
        var currentHistoryData = getHistoryData(window.viewModel);
        var nextPageNumber = self.paging.pageNumber() + 1;
        self.paging.pageNumber(nextPageNumber);
        self.getGrid(currentHistoryData);
    };

    this.goToLastPage = function ()
    {
        var currentHistoryData = getHistoryData(window.viewModel);
        self.paging.pageNumber(self.paging.pageCount());
        self.getGrid(currentHistoryData);
    };

    this.changePageNumber = function (paging, event)
    {
        changePaging(event, paging.pageNumber);
    };

    this.changePageSize = function (paging, event)
    {
        changePaging(event, paging.pageSize, true);
    };

    this.showOverlay = function (community, event)
    {
        // show overlay only after left mouse click
        if (event.which == 1)
        {
            $('#overlay').show();
        }
        // in order not to prevent default action we must return true
        return true;
    };

    this.getUrlParameters = function ()
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

    // udpates grid after 'getGrid' ajax request
    this.updateGrid = function (grid)
    {
        self.paging.totalCount(grid.TotalCount);
        var pageNumbers = [];
        ko.utils.arrayForEach(grid.PageNumbers, function (pageNumber)
        {
            pageNumbers.push(parseInt(pageNumber.Value));
        });
        self.paging.pageNumbers(pageNumbers);
        self.paging.pages(grid.Pages);
        self.paging.pageCount(grid.PageCount);
        self.paging.listCount(grid.List.length);

        self.list(self.getList(grid));
        if (typeof (customDatePicker) !== 'undefined')
        {
            customDatePicker('.grid');
        }
        if (self.closeAllFilters)
        {
            self.closeAllFilters();
        }
    };

    // gets data for ajax request
    this.getDataForGrid = function ()
    {
        var result =
        {
            pageNumber: self.paging.pageNumber(),
            pageSize: self.paging.pageSize()
        };
        return result;
    };

    this.setGridStateFromHistoryData = function (historyData)
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
    };

    this.getGrid = function (initialHistoryData, notPushState)
    {
        var overlay = $('#overlay');
        overlay.show();

        var urlParameters = self.getUrlParameters();
        // for browsers which do not support history.pushState (like IE9)
        if (!window.history.pushState)
        {
            window.open(self.gridUrl + urlParameters, '_self');
            return;
        }

        $.get(self.jsonGridUrl, self.getDataForGrid()).done(function (result)
        {
            if (result.success)
            {
                // update url
                if (!notPushState)
                {
                    var historyData = getHistoryData(self);
                    window.history.pushState(historyData, '', urlParameters);
                }
                self.updateGrid(result.grid);
            }
            else
            {
                self.setGridStateFromHistoryData(initialHistoryData);
                showErrorMessage();
            }
            overlay.hide();
        }).fail(function ()
        {
            self.setGridStateFromHistoryData(initialHistoryData);
            overlay.hide();
            showErrorMessage();
        });
    };

    function changePaging(event, initialValue, resetPageNumber)
    {
        var currentHistoryData = getHistoryData(window.viewModel);
        var srcElement = event.target || event.srcElement;
        var selectedValue;
        if (srcElement.tagName.toLowerCase() == 'option' && srcElement.selected)
        {
            selectedValue = parseInt(srcElement.value);
        }
        else
        {
            selectedValue = parseInt($(srcElement).find('option:selected').val());
        }
        if (selectedValue && initialValue() != selectedValue)
        {
            initialValue(selectedValue);
            if (resetPageNumber)
            {
                self.paging.pageNumber(1);
            }
            self.getGrid(currentHistoryData);
        }
    }
};

/* --------------------------------------------------- constructors --------------------------------------------------- */

/* ----------------- functions to be 'overriden' ----------------- */

function getHistoryData(grid)
{
    var historyData = new GridHistoryData(grid);
    return historyData;
}

function historyDatasAreEqual(historyDataA, historyDataB)
{
    var result = gridHistoryDatasAreEqual(historyDataA, historyDataB);
    return result;
};

/* +++++++++++++++++ functions to be 'overriden' +++++++++++++++++ */

function showErrorMessage()
{
    $('#serverError').dialog({
        resizable: false,
        modal: true,
        buttons:
        {
            OK: function ()
            {
                $(this).dialog("close");
            }
        }
    });
}

function disableTableRow(self)
{
    self.isDisabled(true);
    var row = $('table.grid input:hidden[value=' + self.id + ']').parents('tr');
    $(row).find('.loader').show();
    $(row).find('td').each(function ()
    {
        if (!$(this).find('img.loader').length)
        {
            $(this).append('<div class="background"></div>');
        }
    });
}

function enableTableRow(self)
{
    self.isDisabled(false);
    var row = $('table.grid input:hidden[value=' + self.id + ']').parents('tr');
    $(row).find('.loader').hide();
    $(row).find('td').each(function ()
    {
        if (!$(this).find('img.loader').length)
        {
            if (!$(this).attr('style'))
            {
                $(this).removeAttr('style');
            }
            $(this).find('.background').remove();
        }
    });
}

// converts date obtained from server (e.g. /Date(1245398693390)/) to string of format 'mm-dd-yy'
function getDateString(milliseconds)
{
    // converts e.g. '2' to '02', '9' to '09', etc.
    function formatNumber(number)
    {
        return number < 10
            ? '0' + number
            : number;
    }

    if (!milliseconds)
    {
        return null;
    }
    var regExResult = new RegExp('\\d+').exec(milliseconds);
    milliseconds = parseInt(regExResult);
    var date = new Date(milliseconds);
    // it is essential to add '1' because '0' month is 'January'
    var month = date.getMonth() + 1;

    var result = [formatNumber(month), formatNumber(date.getDate()), date.getFullYear()].join('-');
    return result;
}

// checks if two arrays are equal on length and each value (sequance of elements is taking into consideration too)
function arraysAreEqual(arrA, arrB)
{
    if (arrA.length != arrB.length)
    {
        return false;
    }
    else
    {
        for (var i = 0; i < arrA.length; i++)
        {
            if (arrA[i] !== arrB[i])
            {
                return false;
            }
        }
        return true;
    }
};

function gridHistoryDatasAreEqual(historyDataA, historyDataB)
{
    var result = historyDataA.paging.totalCount === historyDataB.paging.totalCount
                && historyDataA.paging.pageNumber === historyDataB.paging.pageNumber
                && arraysAreEqual(historyDataA.paging.pageNumbers, historyDataB.paging.pageNumbers)
                && arraysAreEqual(historyDataA.paging.pages, historyDataB.paging.pages)
                && historyDataA.paging.pageCount === historyDataB.paging.pageCount
                && historyDataA.paging.pageSize === historyDataB.paging.pageSize
                && arraysAreEqual(historyDataA.paging.pageSizes, historyDataB.paging.pageSizes)
                && historyDataA.paging.listCount === historyDataB.paging.listCount;
    return result;
};

// sets checkbox 'checked' only if current date is greater than or equal to 'start date' and is less than or equal to 'end date'

function setCheckboxStateForDates(startDateString, endDateString)
{

    function resetTimeOfDate(date)
    {
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        return date;
    }

    if (!startDateString)
    {
        return false;
    }

    //dateString: mm-dd-yyyy
    var dateArray = startDateString.split('-');
    //new Date(yyyy,mm,dd); mm from [0..11], dd from [1-31]
    var startDate = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
    startDate = resetTimeOfDate(startDate);

    var currentDate = new Date();
    currentDate = resetTimeOfDate(currentDate);
    var currentDateTime = currentDate.getTime();

    var result;
    if (!endDateString)
    {
        result = startDate.getTime() <= currentDateTime;
    } 
    else
    {
        //dateString: mm-dd-yyyy
        dateArray = endDateString.split('-');
        //new Date(yyyy,mm,dd); mm from [0..11], dd from [1-31]
        var endDate = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
        endDate = resetTimeOfDate(endDate);
        result = startDate.getTime() <= currentDateTime && endDate.getTime() >= currentDateTime;
    }
    return result;
}