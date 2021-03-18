function initializeOwnerGrid(initialData, ownerType)
{
    // we have to set 'OwnerType' directly because enums are serialized into integer, not string as required
    initialData.OwnerType = ownerType;
    window.viewModel = new OwnerGrid(initialData);
    ko.applyBindings(viewModel);
}

var Owner = function (data)
{
    this.id = data.Id;
    this.name = data.Name;
    this.webSiteUrl = data.WebSiteUrl;
};

// inherits 'Grid'
var OwnerGrid = function (data)
{
    Grid.apply(this, arguments);
    var self = this;

    this.ownerType = data.OwnerType;
    this.getList = function (ownerGrid)
    {
        var list = [];
        for (var i = 0; i < ownerGrid.List.length; i++)
        {
            var owner = new Owner(ownerGrid.List[i]);
            list.push(owner);
        }
        return list;
    };
    this.list = ko.observableArray(self.getList(data));

    this.getUrlParameters = function ()
    {
        var urlParameters = [];
        urlParameters.push('type=' + self.ownerType);
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

    // gets data for ajax request
    this.getDataForGrid = function ()
    {
        var result =
        {
            type: self.ownerType,
            pageNumber: self.paging.pageNumber(),
            pageSize: self.paging.pageSize()
        };
        return result;
    };

    /* urls */
    this.gridUrl = data.GridUrl;
    this.jsonGridUrl = data.JsonGridUrl;

    return self;
};