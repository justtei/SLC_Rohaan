/// <reference path="~/Scripts/jquery/jquery-1.8.2.min.js" />
/// <reference path="~/Scripts/jquery/jquery-ui-1.9.2.min.js" />
/// <reference path="~/Scripts/bootstrap/bootstrap.min.js" />
/// <reference path="~/Scripts/knockout/knockout-2.2.0.debug.js"/>

var overlay = $('#overlay');

var initUserGrid = function (initData, gridUrl, jsonGridUrl, defaultPageIndex, defaultPageSize)
{
    window.userGrid = new UserGrid(initData, gridUrl, jsonGridUrl, defaultPageIndex, defaultPageSize);
    ko.applyBindings(userGrid);
};

window.onpopstate = function (event)
{
    if (event.state === null)
    {
        var historyData = window.userGrid.getGridOptionsData();
        window.history.replaceState(historyData);
    }
    else
    {
        window.userGrid.updateGridOptions(event.state);
        window.userGrid.getUserGrid(true);
    }
};

ko.bindingHandlers.slideVisible =
{
    init: function (element, valueAccessor)
    {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).toggle(value);
    },
    update: function (element, valueAccessor, allBindingsAccessor, userGrid)
    {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value)
        {
            if ($(element).is(':hidden'))
            {
                $(element).show('slide', { direction: 'up' }, 200, function ()
                {
                    $(document).on('click', userGrid.closeAllFiltersOnDocumentClick);
                    $(document).on('keydown', userGrid.closeAllFiltersOnEscKeyDown);
                });

                if (userGrid.isVisibleSubnameFilter())
                {
                    $('table .subname-filter input[type=text]').focus();
                }

                if (userGrid.isVisibleSubEmailFilter())
                {
                    $('table .sub-email-filter input[type=text]').focus();
                }
            }
        }
        else
        {
            $(element).hide('slide', { direction: 'up' }, 200);
        }
    }
};

var User = function (user)
{
    var self = this;

    self.id = user.Id;
    self.username = user.Username;
    self.email = user.Email;
    self.leads = ko.observable(user.Leads);
    self.notifications = ko.observable(user.Notifications);
};

var UserGrid = function (initData, gridUrl, jsonGridUrl, defaultPageIndex, defaultPageSize)
{
    var self = this;

    /********** Enums **********/
    self.sortOrder =
    {
        unsorted: 1,
        ascending: 2,
        descending: 3
    };

    self.checkFilter =
    {
        any: 1,
        checked: 2,
        unchecked: 3
    };

    self.sortOrderToArray = function ()
    {
        var array = [];

        $.each(self.sortOrder, function (key, value)
        {
            array.push({ key: key, value: value });
        });

        return array;
    };

    self.checkFilterToArray = function ()
    {
        var array = [];

        $.each(self.checkFilter, function (key, value)
        {
            array.push({ key: key, value: value });
        });

        return array;
    };

    self.sortOrderArray = self.sortOrderToArray();
    self.checkFilterArray = self.checkFilterToArray();

    /********** Grid properties **********/
    self.getUserList = function (users)
    {
        var userList = [];

        for (var i = 0; i < users.length; i++)
        {
            var user = new User(users[i]);
            userList.push(user);
        }

        return userList;
    };

    self.userList = ko.observableArray(self.getUserList(initData.Users));
    self.gridUrl = gridUrl;
    self.jsonGridUrl = jsonGridUrl;

    /********** Grid options **********/
    self.subnameFilter = ko.observable(initData.GridOptions.SubnameFilter);
    self.subEmailFilter = ko.observable(initData.GridOptions.SubEmailFilter);
    self.nameOrder = ko.observable(initData.GridOptions.NameOrder);
    self.emailOrder = ko.observable(initData.GridOptions.EmailOrder);
    self.leadFilter = ko.observable(initData.GridOptions.LeadFilter);
    self.notificationFilter = ko.observable(initData.GridOptions.NotificationFilter);

    self.currentSubnameFilter = ko.observable(initData.GridOptions.SubnameFilter);
    self.currentSubEmailFilter = ko.observable(initData.GridOptions.SubEmailFilter);
    self.currentLeadFilter = ko.observable(initData.GridOptions.LeadFilter);
    self.currentNotificationFilter = ko.observable(initData.GridOptions.NotificationFilter);

    self.isAppliedSubnameFilter = ko.observable(initData.GridOptions.SubnameFilter != null && initData.GridOptions.SubnameFilter.length > 0);
    self.isAppliedSubEmailFilter = ko.observable(initData.GridOptions.SubEmailFilter != null && initData.GridOptions.SubEmailFilter.length > 0);
    self.isAppliedLeadFilter = ko.observable(initData.GridOptions.LeadFilter != self.checkFilter.any);
    self.isAppliedNotificationFilter = ko.observable(initData.GridOptions.NotificationFilter != self.checkFilter.any);

    self.isVisibleSubnameFilter = ko.observable(false);
    self.isVisibleSubEmailFilter = ko.observable(false);
    self.isVisibleLeadFilter = ko.observable(false);
    self.isVisibleNotificationFilter = ko.observable(false);

    /********** Pagination properties **********/
    self.pageIndex = ko.observable(initData.Pagination.PageIndex);
    self.pageSize = ko.observable(initData.Pagination.PageSize);
    self.availableIndexes = ko.observable(initData.Pagination.AvailableIndexes);
    self.pageIndexList = ko.observableArray(initData.Pagination.PageIndexList);
    self.pageSizeList = ko.observableArray(initData.Pagination.PageSizeList);
    self.totalCount = ko.observable(initData.Pagination.TotalCount);
    self.defaultPageIndex = defaultPageIndex;
    self.defaultPageSize = defaultPageSize;
    self.paginationInfo = ko.computed(function ()
    {
        var endOfInterval = self.pageIndex() * self.pageSize() <= self.totalCount()
            ? self.pageIndex() * self.pageSize()
            : self.totalCount();

        return ((self.pageIndex() - 1) * self.pageSize() + 1) + ' - ' + endOfInterval + ' of ' + self.totalCount();
    });

    /********** Functions for change grid options **********/
    //change sort order
    self.changeNameOrder = function ()
    {
        self.changeOrder(self.nameOrder);
        self.emailOrder(self.sortOrder.unsorted);
        self.applayGridOptions();
    };

    self.changeEmailOrder = function ()
    {
        self.changeOrder(self.emailOrder);
        self.nameOrder(self.sortOrder.unsorted);
        self.applayGridOptions();
    };

    self.changeOrder = function (order)
    {
        if (order() == self.sortOrder.unsorted)
        {
            order(self.sortOrder.ascending);
        }
        else
        {
            if (order() == self.sortOrder.ascending)
            {
                order(self.sortOrder.descending);
            }
            else
            {
                order(self.sortOrder.ascending);
            }
        }
    };

    //toggle filter
    self.toggleSubnameFilter = function ()
    {
        self.toggleFilter(self.isVisibleSubnameFilter);
    };

    self.toggleSubEmailFilter = function ()
    {
        self.toggleFilter(self.isVisibleSubEmailFilter);
    };

    self.toggleLeadFilter = function ()
    {
        self.toggleFilter(self.isVisibleLeadFilter);
    };

    self.toggleNotificationFilter = function ()
    {
        self.toggleFilter(self.isVisibleNotificationFilter);
    };

    self.toggleFilter = function (isVisibleFilter)
    {
        var allFilterIsVisibleFunctions =
        [
            self.isVisibleSubnameFilter,
            self.isVisibleSubEmailFilter,
            self.isVisibleLeadFilter,
            self.isVisibleNotificationFilter
        ];

        // close all filters but current one
        ko.utils.arrayForEach(allFilterIsVisibleFunctions, function (filterIsVisibleFunction)
        {
            if (filterIsVisibleFunction != isVisibleFilter)
            {
                filterIsVisibleFunction(false);
            }
        });

        $(document).off('click', self.closeAllFiltersOnDocumentClick);
        $(document).off('keydown', self.closeAllFiltersOnEscKeyDown);

        isVisibleFilter(!isVisibleFilter());
    };

    //clear filter
    self.clearSubnameFilter = function ()
    {
        self.clearSubstringFilter(self.isAppliedSubnameFilter, self.subnameFilter, self.currentSubnameFilter);
    };

    self.clearSubEmailFilter = function ()
    {
        self.clearSubstringFilter(self.isAppliedSubEmailFilter, self.subEmailFilter, self.currentSubEmailFilter);
    };

    self.clearLeadFilter = function ()
    {
        self.clearCheckFilter(self.isAppliedLeadFilter, self.leadFilter, self.currentLeadFilter);
    };

    self.clearNotificationFilter = function ()
    {
        self.clearCheckFilter(self.isAppliedNotificationFilter, self.notificationFilter, self.currentNotificationFilter);
    };

    self.clearSubstringFilter = function (isAppliedfilterFunction, filter, currentFilter)
    {
        isAppliedfilterFunction(false);
        filter('');
        currentFilter('');
        self.applayGridOptions();
    };

    self.clearCheckFilter = function (isAppliedCheckFilterFunction, filter, currentFilter)
    {
        isAppliedCheckFilterFunction(false);
        filter(self.checkFilter.any);
        currentFilter(self.checkFilter.any);
        self.applayGridOptions();
    };

    //apply filter
    self.subnameFilterOnKeyDown = function (userGrid, event)
    {
        if (event.keyCode === 13)
        {
            var srcElement = event.target || event.srcElement;
            srcElement.blur();
            self.applySubnameFilter();
        }
        return true;
    };

    this.subEmailFilterOnKeyUp = function (userGrid, event)
    {
        if (event.keyCode === 13)
        {
            var srcElement = event.target || event.srcElement;
            srcElement.blur();
            self.applySubEmailFilter();
        }
    };

    self.applySubnameFilter = function ()
    {
        self.applySubstringFilter(self.subnameFilter, self.currentSubnameFilter, self.clearSubnameFilter, self.isAppliedSubnameFilter);
    };

    self.applySubEmailFilter = function ()
    {
        self.applySubstringFilter(self.subEmailFilter, self.currentSubEmailFilter, self.clearSubEmailFilter, self.isAppliedSubEmailFilter);
    };

    self.applyLeadFilter = function ()
    {
        self.applyCheckFilter(self.leadFilter, self.currentLeadFilter, self.clearLeadFilter, self.isAppliedLeadFilter);
    };

    self.applyNotificationFilter = function ()
    {
        self.applyCheckFilter(self.notificationFilter, self.currentNotificationFilter, self.clearNotificationFilter, self.isAppliedNotificationFilter);
    };

    self.applySubstringFilter = function (filter, currentFilter, clearFilterFunction, isAppliedFilterFunction)
    {
        if (filter() != null)
        {
            if (filter() != currentFilter())
            {
                if (filter() == '')
                {
                    clearFilterFunction();
                }
                else
                {
                    isAppliedFilterFunction(true);
                    currentFilter(filter());
                    self.applayGridOptions();
                }
            }
            else
            {
                self.closeAllFilters();
            }
        }
    };

    self.applyCheckFilter = function (filter, currentFilter, clearFilterFunction, isAppliedFilterFunction)
    {
        if (filter() != currentFilter())
        {
            if (filter() == self.checkFilter.any)
            {
                clearFilterFunction();
            }
            else
            {
                isAppliedFilterFunction(true);
                currentFilter(filter());
                self.applayGridOptions();
            }
        }
    };

    //close all filters
    self.closeAllFiltersOnDocumentClick = function (e)
    {
        var srcElement = e.target || e.srcElement;
        if (!$(srcElement).hasClass('filter') && !$(srcElement).parents('.filter').length)
        {
            self.closeAllFilters();
        }
    };

    self.closeAllFiltersOnEscKeyDown = function (e)
    {
        if (e.keyCode == 27)
        {
            self.closeAllFilters();
        }
    };

    self.closeAllFilters = function ()
    {
        self.isVisibleSubnameFilter(false);
        self.isVisibleSubEmailFilter(false);
        self.isVisibleLeadFilter(false);
        self.isVisibleNotificationFilter(false);

        $(document).off('click', self.closeAllFiltersOnDocumentClick);
        $(document).off('keydown', self.closeAllFiltersOnEscKeyDown);
    };

    //apply grid options
    self.applayGridOptions = function ()
    {
        self.closeAllFilters();
        self.pageIndex(defaultPageIndex);
        self.getUserGrid(false);
    };

    /********** Pagination **********/
    self.goToFirstPage = function ()
    {
        if (self.pageIndex() != 1)
        {
            self.goToPage(1);
        }
    };

    self.goToLastPage = function ()
    {
        if (self.pageIndex() != self.pageIndexList().length)
        {
            self.goToPage(self.pageIndexList().length);
        }
    };

    self.goToPreviousPage = function ()
    {
        if (self.pageIndex() != 1)
        {
            self.goToPage(self.pageIndex() - 1);
        }
    };

    self.goToNextPage = function ()
    {
        if (self.pageIndex() != self.pageIndexList().length)
        {
            self.goToPage(self.pageIndex() + 1);
        }
    };

    self.goToPage = function (pageIndex)
    {
        if (pageIndex == self.pageIndex())
        {
            return;
        }

        self.pageIndex(pageIndex);
        self.getUserGrid();
    };

    self.selectIndexPage = function ()
    {
        self.getUserGrid(false);
    };

    self.selectPageSize = function ()
    {
        self.applayGridOptions();
    };

    /********** User grid **********/
    self.getUserGrid = function (notPushState)
    {
        overlay.show();

        // for browsers which do not support history.pushState (like IE9)
        if (!history.pushState)
        {
            window.open(self.gridUrl + self.getGridUrlParameters(), '_self');
            return;
        }

        $.get(self.jsonGridUrl, self.getGridOptionsData())
        .done(function (result)
        {
            if (result.success)
            {
                if (!notPushState)
                {
                    history.pushState(self.getGridOptionsData(), '', self.getGridUrlParameters());
                }
                self.updateUserGrid(result.model);
            }
            overlay.hide();
        })
        .error(function ()
        {
            self.updateUserGrid(initData);
            overlay.hide();
            self.showNotificationModal("Error", "<p>Sorry, an error occurred while processing your request</p>");
        });
    };

    self.updateUserGrid = function (data)
    {
        var pagination = data.Pagination;

        self.pageIndex(pagination.PageIndex);
        self.pageSize(pagination.PageSize);
        self.availableIndexes(pagination.AvailableIndexes);
        self.pageIndexList(pagination.PageIndexList);
        self.pageSizeList(pagination.PageSizeList);
        self.totalCount(pagination.TotalCount);

        self.userList(self.getUserList(data.Users));
    };

    self.updateGridOptions = function (options)
    {
        self.pageIndex(options.PageIndex);
        self.pageSize(options.PageSize);
        self.subnameFilter(options.SubnameFilter);
        self.subEmailFilter(options.SubEmailFilter);
        self.nameOrder(options.NameOrder);
        self.emailOrder(options.EmailOrder);
        self.leadFilter(options.LeadFilter);
        self.notificationFilter(options.NotificationFilter);

        self.currentSubnameFilter(options.SubnameFilter);
        self.currentSubEmailFilter(options.SubEmailFilter);
        self.currentLeadFilter(options.LeadFilter);
        self.currentNotificationFilter(options.NotificationFilter);

        if (options.SubnameFilter == null || options.SubnameFilter == '')
        {
            self.isAppliedSubnameFilter(false);
        }
        else
        {
            self.isAppliedSubnameFilter(true);
        }

        if (options.SubEmailFilter == null || options.SubEmailFilter == '')
        {
            self.isAppliedSubEmailFilter(false);
        }
        else
        {
            self.isAppliedSubEmailFilter(true);
        }

        if (options.LeadFilter == self.checkFilter.any)
        {
            self.isAppliedLeadFilter(false);
        }
        else
        {
            self.isAppliedLeadFilter(true);
        }

        if (options.NotificationFilter == self.checkFilter.any)
        {
            self.isAppliedNotificationFilter(false);
        }
        else
        {
            self.isAppliedNotificationFilter(true);
        }
    };

    self.getGridOptionsData = function ()
    {
        return {
            PageIndex: self.pageIndex(),
            PageSize: self.pageSize(),
            SubnameFilter: self.subnameFilter(),
            SubEmailFilter: self.subEmailFilter(),
            NameOrder: self.nameOrder(),
            EmailOrder: self.emailOrder(),
            LeadFilter: self.leadFilter(),
            NotificationFilter: self.notificationFilter()
        };
    };

    self.getGridUrlParameters = function ()
    {
        var parameters = [];

        if (self.pageIndex() != self.defaultPageIndex)
        {
            parameters.push('pageIndex=' + self.pageIndex());
        }
        if (self.pageSize() != self.defaultPageSize)
        {
            parameters.push('pageSize=' + self.pageSize());
        }
        if (self.subnameFilter() != null && self.subnameFilter().length > 0)
        {
            parameters.push('subnameFilter=' + self.subnameFilter());
        }
        if (self.subEmailFilter() != null && self.subEmailFilter().length > 0)
        {
            parameters.push('subEmailFilter=' + self.subEmailFilter());
        }
        if (self.nameOrder() != self.sortOrder.unsorted)
        {
            parameters.push('nameOrder=' + self.sortOrderArray[self.nameOrder() - 1].key);
        }
        if (self.emailOrder() != self.sortOrder.unsorted)
        {
            parameters.push('emailOrder=' + self.sortOrderArray[self.emailOrder() - 1].key);
        }
        if (self.leadFilter() != self.checkFilter.any)
        {
            parameters.push('leadFilter=' + self.checkFilterArray[self.leadFilter() - 1].key);
        }
        if (self.notificationFilter() != self.checkFilter.any)
        {
            parameters.push('notificationFilter=' + self.checkFilterArray[self.notificationFilter() - 1].key);
        }

        if (parameters.length)
        {
            return '?' + parameters.join('&');
        }

        return window.location.pathname;
    };

    /********** Grid user actions **********/
    self.setLead = function (user)
    {
        var checkbox = $('table tr #leads_' + user.id);
        checkbox.attr("disabled", true);

        var dataUrl = checkbox.attr('data-url');
        var value = user.leads();

        $.get(dataUrl, { value: value }, function (data)
        {
            checkbox.removeAttr("disabled");
            if (!data)
            {
                showNotificationModal("Edit leads", "<p>Your changes were not applied</p>");
                user.leads(!value);
            };
        }, "json")
        .error(function ()
        {
            showNotificationModal("Edit leads", "<p>Your changes were not applied</p>");
            user.leads(!value);
        });
        return true;
    };

    self.setNotifications = function (user)
    {
        var checkbox = $('table tr #notifications_' + user.id);
        checkbox.attr("disabled", true);

        var value = user.notifications();
        var dataUrl = checkbox.attr('data-url');

        $.get(dataUrl, { value: value }, function (data)
        {
            checkbox.removeAttr("disabled");
            if (!data)
            {
                showNotificationModal("Edit notifications", "<p>Your changes were not applied</p>");
                user.notifications(!value);
            }
        }, "json")
        .error(function ()
        {
            showNotificationModal("Edit notifications", "<p>Your changes were not applied</p>");
            user.notifications(!value);
        });
        return true;
    };

    self.resetPassword = function (user)
    {
        var resetButton = $('table tr #resetPassword_' + user.id);
        var url = resetButton.attr("data-url");

        if (url)
        {
            $.get(url, {}, function (data)
            {
                self.setModalTitle("Reset password");
                if (data == 'True')
                {
                    self.setModalText('<p>Reset password was successful.</p>');
                }
                else
                {
                    self.setModalText('<p>Reset password was unsuccessful.</p>');
                }
                self.showModal();
            });
        }
    };

    self.deleteUser = function (url, id)
    {
        $('#deleteConfirmModal').modal('hide');

        if (url)
        {
            $.get(url, {}, function (data)
            {
                self.setModalTitle('Delete');
                if (data.toString().toLowerCase() == 'true')
                {
                    self.setModalText('<p>User is deleted.</p>');
                    self.userList.remove(function (user)
                    {
                        return user.id == id;
                    });
                }
                else
                {
                    self.setModalText('<p>User is not deleted.</p>');
                }
                self.showModal();
            });
        }
    };

    /********** Modal **********/
    self.showDeleteConfirm = function (user)
    {
        var deleteButton = $('table tr #deleteUser_' + user.id);
        var username = user.username;
        var url = deleteButton.attr("data-url");

        $('.delete-user-name').html(username);
        $('#deleteConfirmModal').modal('show');

        $('.delete-confirm').unbind();
        $('.delete-confirm').on('click', function ()
        {
            self.deleteUser(url, user.id);
        });
    };

    self.setModalTitle = function (title)
    {
        $("#notificationModalLabel").empty().html(title);
    };

    self.setModalText = function (text)
    {
        $("#notificationModalBody").empty().html(text);
    };

    self.showModal = function ()
    {
        $("#notificationModal").modal('show');
    };

    self.showNotificationModal = function (title, text)
    {
        self.setModalText(text);
        self.setModalTitle(title);
        self.showModal();
    };
};