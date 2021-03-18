$(function () {
    $("#searchBar #SelectedState_Code").on("change", function () {
        $(this).find("option:selected").each(function () {
            selectState(this, "#searchBar", "[id*='SelectedCity']");
        });
    });
    $("#searchBar #SelectedCountry_Code").on("change", function () {
        $(this).find("option:selected").each(function () {
            selectCountry(this, "#searchBar", "[id*='SelectedState']");
        });
    });
});

function selectState(sender, parentSelector, citySelector) {
    var stateId = $(sender).val();
    var dataUrl = $(sender).parent().attr("data-url");
    var div = $(sender).parents(parentSelector);
    clearCityList(div, citySelector);
    if (stateId != "" && stateId != null) {
        $.get(dataUrl, { stateId: stateId }, function (data) { populateCitiesFromJson(data, div, citySelector); }, "json");
    }
}

function selectCountry(sender, parentSelector, stateSelector) {
    var countryId = $(sender).val();
    var dataUrl = $(sender).parent().attr("data-url");
    var div = $(sender).parents(parentSelector);
    clearStateList(div, stateSelector);
    if (countryId != "" && countryId != null) {
        $.get(dataUrl, { countryId: countryId }, function (data) { populateStatesFromJson(data, div, stateSelector); }, "json");
    }
}

function populateCitiesFromJson(cities, div, citySelector) {
    var list = $(div).find(citySelector);
    var length = cities.length;
    for (var i = 0; i < length; i++) {
        list.append("<option value='" + cities[i].Id + "'>" + cities[i].Name + "</option>");
    }
}

function populateStatesFromJson(states, div, stateSelector) {
    var list = $(div).find(stateSelector);
    var length = states.length;
    for (var i = 0; i < length; i++) {
        list.append("<option value='" + states[i].Id + "'>" + states[i].Name + "</option>");
    }
}

function clearCityList(div, citySelector) {
    var list = $(div).find(citySelector + " option");
    var title = list[0];
    $(div).find(citySelector).html(title);
}

function clearStateList(div, stateSelector) {
    var list = $(div).find(stateSelector + " option");
    var title = list[0];
    $(div).find(stateSelector).html(title);
    var citySelector = "[id*='City_Id']";
    clearCityList(div, citySelector);
}