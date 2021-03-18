function initializeCallTrackingGrid(initialData)
{
    window.viewModel = new CallTrackingGrid(initialData);
    ko.applyBindings(viewModel);
    $('#validateCallTrackingPhoneButton a').on('click', validateCallTrackingPhones);
}

var CallTrackingPhone = function (data)
{
    this.communityId = data.CommunityId;
    this.communityName = data.CommunityName;
    this.phoneType = data.PhoneType;
    this.phone = data.Phone;
    this.provisionPhone = data.ProvisionPhone;
    this.isWhisper = data.IsWhisper;
    this.isCallReview = data.IsCallReview;
    this.startDate = getDateString(data.StartDate);
    this.endDate = getDateString(data.EndDate);
    this.status = data.Status;
    this.disconnectDate = getDateString(data.DisconnectDate);
    this.expiresDate = getDateString(data.ExpiresDate);
};

// inherits 'Grid'
var CallTrackingGrid = function (data)
{
    Grid.apply(this, arguments);
    var self = this;

    this.getList = function (callTrackingGrid)
    {
        var list = [];
        for (var i = 0; i < callTrackingGrid.List.length; i++)
        {
            var callTrackingPhone = new CallTrackingPhone(callTrackingGrid.List[i]);
            list.push(callTrackingPhone);
        }
        return list;
    };

    this.list = ko.observableArray(self.getList(data));

    /* urls */
    this.gridUrl = data.GridUrl;
    this.jsonGridUrl = data.JsonGridUrl;
};

function validateCallTrackingPhones(e)
{
    // show overlay only after left mouse click
    if (e.which == 1)
    {
        $('#overlay').show();
    }
    // in order not to prevent default action we must return true
    return true;
}