/// <reference path="../jquery/jquery-1.8.2-vsdoc.js" />
/// <reference path="../jquery/jquery.validate-vsdoc.js" />
/// <reference path="../jquery/jquery.validate.unobtrusive.js" />
/// <reference path="~/Scripts/custom/requiredCheckBoxList.js" />
/// <reference path="common.js" />

function addItem(sender, parentSelector, itemSelector, deleteLinkClassName, deleteItemHandler, itemName) {
    var currentItemSelector = $(sender).parents(parentSelector).find(itemSelector);
    var itemsCount = currentItemSelector.length;
    if (!itemsCount) {
        return;
    }
    if (1 == itemsCount) {
        // show 'deleteItemLink'
        $(currentItemSelector).find(deleteLinkClassName).show();
    }

    // copy html
    var newItem = document.createElement('div');
    newItem.innerHTML = $(currentItemSelector).first()[0].outerHTML;

    // set appropriate index
    var index = itemsCount;
    changeIndex(newItem, itemName, index);

    // remove validation errors
    removeValidationErrors(newItem);

    // set default values
    $(newItem).find('input:text').removeAttr('value');
    $(newItem).find('select option[selected=selected]').removeAttr('selected');
    $(newItem).find("input[type=hidden]").remove();

    // append to DOM
    $($(currentItemSelector).last()).after(newItem.innerHTML);

    newItem = $(sender).parents(parentSelector).find(itemSelector).last();
    // attach handlers
    $(newItem).find(deleteLinkClassName).on('click', deleteItemHandler);

    // add to jquery validation context
    addToValidationContext(newItem);
}

function addPhone() {
    addItem(this, '.phones', '.phone', '.delete-phone', deletePhone, 'Phones');
}

function addEmail() {
    addItem(this, '.emails', '.email', '.delete-email', deleteEmail, 'Emails');
}

function deletePhone() {
    deleteItem(this, '.phones', '.phone', '.delete-phone', 'Phones');
}

function deleteEmail() {
    deleteItem(this, '.emails', '.email', '.delete-email', 'Emails');
}

$(function ()
{
    $('.add-phone').on('click', addPhone);
    $('.add-email').on('click', addEmail);

    $('.phones .delete-phone').on('click', deletePhone);
    $('.emails .delete-email').on('click', deleteEmail);

    // populates states after country has been selected
    $("#FullAddress [id*='SelectedCountryID']").on("change", function ()
    {
        selectCountry($(this).find("option:selected"), "#FullAddress", "[id*='SelectedStateID']", "[id*='SelectedCityID']");
    });

    // populates cities after state has been selected
    $("#FullAddress [id*='SelectedStateID']").on("change", function ()
    {
        selectState($(this).find("option:selected"), "#FullAddress", "[id*='SelectedCityID']");
    });

    $(".brand-editor [id*='BrandSelected']").on("change", function ()
    {
        selectBrand($(this), ".publication-part", ".publication-editor");
    });

    initRequiredCheckboxListValidation();

    if (!$("#brands-area").find("input:checkbox:checked").length)
    {
        $("#publications-area").hide();
    }

    var stateSelector = $("#FullAddress [id*='SelectedStateID']");
    var citySelector = $("#FullAddress [id*='SelectedCityID']");
    if (stateSelector.find("option").length <= 1) { stateSelector.attr("disabled", true); }
    if (citySelector.find("option").length <= 1) { citySelector.attr("disabled", true); }
});

function selectCountry(sender, parentSelector, stateSelector, citySelector) {
    var countryCode = $(sender).val();
    var dataUrl = $(sender).parent().attr("data-url");
    var div = $(sender).parents(parentSelector);
    clearStateList(div, stateSelector);
    clearCityList(div, citySelector);
    if (countryCode != "" && countryCode != null)
    {
        $.get(dataUrl, { countryCode: countryCode }, function (data) { populateStatesFromJson(data, div, stateSelector); }, "json");
    }
}

function populateStatesFromJson(states, div, stateSelector) {
    var list = $(div).find(stateSelector);
    var length = states.length;
    for (var i = 0; i < length; i++)
    {
        list.append("<option value='" + states[i].Id + "'>" + states[i].Name + "</option>");
    }
    $(stateSelector).removeAttr("disabled");
}

function selectState(sender, parentSelector, citySelector)
{
    var stateCode = $(sender).val();
    var dataUrl = $(sender).parent().attr("data-url");
    var div = $(sender).parents(parentSelector);
    clearCityList(div, citySelector);
    if (stateCode != "" && stateCode != null)
    {
        $.get(dataUrl, { stateCode: stateCode }, function (data) { populateCitiesFromJson(data, div, citySelector); }, "json");
    }
}

function populateCitiesFromJson(cities, div, citySelector)
{
    var list = $(div).find(citySelector);
    var length = cities.length;
    for (var i = 0; i < length; i++)
    {
        list.append("<option value='" + cities[i].Id + "'>" + cities[i].Name + "</option>");
    }
    $(citySelector).removeAttr("disabled");
}

function clearStateList(div, stateSelector)
{
    $(stateSelector).attr("disabled", true);
    var list = $(div).find(stateSelector + " option");
    var title = list[0];
    $(div).find(stateSelector).html(title);
}

function clearCityList(div, citySelector)
{
    $(citySelector).attr("disabled", true);
    var list = $(div).find(citySelector + " option");
    var title = list[0];
    $(div).find(citySelector).html(title);
}

function selectBrand(sender, parentSelector, publicationSelector) {
    var checked = $(sender).prop("checked");
    var parent = $(sender).parent();
    var dataUrl = $(sender).attr("data-url");
    var selectedBrand = parent.find("label").attr("for");
    var selectedBrandId = parent.find("input[id*='_Brand_Id']").attr("value");
    var div = $(sender).parents(parentSelector);
    if (selectedBrand != "" && selectedBrand != null && checked == true) {
        $(sender).attr("disabled", true);
        $.get(dataUrl, { brand: selectedBrandId }, function (data) { populatePublicationsFromJson(data, sender, div, publicationSelector, selectedBrand); }, "json");
    }
    else {
        removeBrandPublications(div, publicationSelector, selectedBrand);
    }
}

function populatePublicationsFromJson(publications, sender, div, publicationSelector, brandType)
{
    $(sender).removeAttr("disabled");
    var list = $(div).find(publicationSelector);
    var publicationsHtml = "<div brand-type='" + brandType + "'>";
    var brandIndex = $(sender).attr("brand-index");
    for (var i = 0; i < publications.length; i++) {
        var id = "Publications_" + brandIndex + "__Publications_" + i + "__";
        var name = "Publications[" + brandIndex + "].Publications[" + i + "]";

        publicationsHtml += "<div class='controls'><label class='checkbox'>" +
                 "<input data-val='true' id='" + id + "Selected' name='" + name + ".Selected' type='checkbox' value='true'>" +
                 "<label for=''>" + publications[i].Name + "</label>" +
                 "<input id='" + id + "Value' name='" + name + ".Value' type='hidden' value='" + publications[i].Id + "'>" +
                 "<input name='" + name + ".Selected' type='hidden' value='false'></label></div>";
    }
    publicationsHtml += "</div>";
    list.append(publicationsHtml);
    
    list.find('input[type=checkbox]').on('change', function ()
    {
        $.validator.methods.requiredcheckboxlist($(this).val(), this);
    });
    if ($("#brands-area").find("input:checkbox:checked").length == 1)
    {
        tooglePublications();
    }
}

function removeBrandPublications(div, publicationSelector, brandType)
{
    var list = $(div).find(publicationSelector);
    var publications = list.find("div[brand-type='" + brandType + "']");
    publications.remove();
    
    if (!$("#brands-area").find("input:checkbox:checked").length)
    {
        tooglePublications();
    }
}

function clearPublicationList(div, publicationSelector) {
    var list = $(div).find(publicationSelector + " option");
    var title = list[0];
    $(div).find(publicationSelector).html(title);
}

function tooglePublications()
{
    $('#publications-area').toggle('slow', function ()
    {
        if ($('#publications-area').is(':visible'))
        {
            addToValidationContext('#publications-area');
        }
        else
        {
            removeFromValidationContext('#publications-area');
        }
    });
}