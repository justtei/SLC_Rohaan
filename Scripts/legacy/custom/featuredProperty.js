function initializeFeaturedProperty(featuredProperty, searchType)
{
    // we have to set 'searchType' directly because enums are serialized into integers, not strings as required
    featuredProperty.SearchModel.SearchType = searchType;
    
    var featuredPropertyViewModel = new FeaturedProperties(featuredProperty);
    featuredPropertyViewModel.pushPropertyData(featuredProperty);
    ko.applyBindings(featuredPropertyViewModel, document.getElementById("srp_rightrail"));
}

var FeaturedProperties = function (data)
{
    var self = this;
    this.ROTATE_TIME = 5000;
    this.currentProperty = new FeaturedProperty(data);
    this.cachedFeaturedProperties = ko.observableArray();

    this.getPropertyIndexInCache = function (indexNumber)
    {
        for (var i = 0; i < self.cachedFeaturedProperties().length; i++)
        {
            if (self.cachedFeaturedProperties()[i].IndexNumber === indexNumber)
            {
                return i;
            }
        }
        return -1;
    };

    this.pushPropertyData = function (propertyData)
    {
        var propertyIndexInCache = self.getPropertyIndexInCache(propertyData.IndexNumber);
        if (propertyIndexInCache < 0)
        {
            self.cachedFeaturedProperties.push(propertyData);
        }
    };

    this.previousProperty = function ()
    {
        rotate(true);
        prev();
    };

    this.nextProperty = function ()
    {
        rotate(true);
        next();
    };

    this.timeout = null;
    this.isPlay = ko.observable(true);
    this.rotateIcon = ko.computed(function ()
    {
        return self.isPlay() ? '/Content/imageGallery/smPause.png' : '/Content/imageGallery/smPlay.png';
    });
    this.rotateProperty = function ()
    {
        self.isPlay(!self.isPlay());
        rotate();
    };

    function next()
    {
        var nextIndexNumber = self.currentProperty.indexNumber() + 1;
        if (nextIndexNumber > self.currentProperty.totalCount())
        {
            nextIndexNumber = 1;
        }
        getProperty(nextIndexNumber);
    }

    function prev()
    {
        var previousIndexNumber = self.currentProperty.indexNumber() - 1;
        if (previousIndexNumber < 1)
        {
            previousIndexNumber = self.currentProperty.totalCount();
        }
        getProperty(previousIndexNumber);
    }

    function getProperty(indexNumber)
    {
        if (self.currentProperty.inUpdate == true)
        {
            return;
        }
        self.currentProperty.inUpdate = true;

        var overlay;
        var propertyIndexInCache = self.getPropertyIndexInCache(indexNumber);
        if (propertyIndexInCache >= 0)
        {
            var cachedPropertyData = self.cachedFeaturedProperties()[propertyIndexInCache];
            self.currentProperty.updateProperty(cachedPropertyData);
            self.currentProperty.inUpdate = false;
            rotate();
        }
        else
        {
            overlay = $('#featuredPropertyOverlay');
            overlay.show();
            $.get(self.currentProperty.getPropertyUrl,
            {
                SearchType: self.currentProperty.searchType,
                CountryCode: self.currentProperty.searchCountryCode,
                StateCode: self.currentProperty.searchStateCode,
                CityName: self.currentProperty.searchCityName,
                indexNumber: indexNumber
            }).done(function (result)
            {
                var featurePropertyData = result.featuredProperty;
                self.pushPropertyData(featurePropertyData);
                self.currentProperty.updateProperty(featurePropertyData);
            }).fail(function ()
            {
                rotate(true);
            }).always(function ()
            {
                self.currentProperty.inUpdate = false;
                rotate();
                overlay.hide();
            });
        }
    };

    function rotate(stop)
    {
        if (stop)
        {
            self.isPlay(false);
        }
        if (self.isPlay())
        {
            self.timeout = window.setTimeout(next, self.ROTATE_TIME);
        }
        else
        {
            window.clearTimeout(self.timeout);
        }
    }
    
    rotate();
};

var FeaturedProperty = function (data)
{
    var self = this;

    this.name = ko.observable(data.Name);
    this.phone = ko.observable(data.Phone);
    this.indexNumber = ko.observable(data.IndexNumber);
    this.totalCount = ko.observable(data.TotalCount);
    this.displayOrder = ko.observable(data.DisplayOrder);
    this.searchType = data.SearchModel.SearchType;
    this.searchCountryCode = data.SearchModel.CountryCode;
    this.searchStateCode = data.SearchModel.StateCode;
    this.searchCityName = data.SearchModel.CityName;
    this.detailsUrl = ko.observable(data.DetailsUrl);
    this.getPropertyUrl = data.GetPropertyUrl;
    this.image = ko.observable(data.Image);
    this.inUpdate = false;

    this.updateProperty = function (property)
    {
        self.name(property.Name);
        self.phone(property.Phone);
        self.indexNumber(property.IndexNumber);
        self.totalCount(property.TotalCount);
        self.displayOrder(property.DisplayOrder);
        self.detailsUrl(property.DetailsUrl);
        self.image(property.Image);
    };
};