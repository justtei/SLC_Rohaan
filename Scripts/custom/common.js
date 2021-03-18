/// <reference path="../jquery/jquery-1.8.2-vsdoc.js" />
/// <reference path="../jquery/jquery-ui-1.9.1.custom.min.js" />
/// <reference path="../jquery/jquery.validate-vsdoc.js" />
/// <reference path="../jquery/jquery.validate.unobtrusive.js" />

function removeValidationErrors(selector) {
    $(selector).find('.input-validation-error').each(function () {
        $(this).removeClass('input-validation-error');
    });
    $(selector).find('.field-validation-error').each(function () {
        $(this).removeClass('field-validation-error');
        $(this).html('');
        $(this).add('field-validation-valid');
    });
}

// changes index in attributes 'id', 'name', 'data-valmsg-for' of some elements in order to be properly collected by model binder
// e.g. 'FloorPlans[3].Name' to 'FloorPlans[1].Name'
function changeIndex(selector, elementName, index) {
    $(selector).find('[name*=' + elementName + '], [data-valmsg-for*=' + elementName + ']').each(function () {
        // change name
        var name = $(this).attr('name');
        if (name) {
            var match = new RegExp(elementName + '\\[\\d\\]').exec(name);
            name = name.replace(match, elementName + '[' + index + ']');
            $(this).attr('name', name);
        }

        // change id
        var id = $(this).attr('id');
        if (id) {
            match = new RegExp(elementName + '_\\d').exec(id);
            id = id.replace(match, elementName + '_' + index);
            $(this).attr('id', id);
        }

        // change 'data-valmsg-for'
        var dataValmsgFor = $(this).attr('data-valmsg-for');
        if (dataValmsgFor) {
            match = new RegExp(elementName + '\\[\\d\\]').exec(dataValmsgFor);
            dataValmsgFor = dataValmsgFor.replace(match, elementName + '[' + index + ']');
            $(this).attr('data-valmsg-for', dataValmsgFor);
        }
    });
}

function deleteItem(deleteLink, collectionId, itemClassName, deleteLinkClassName, itemName) {
    var collection = $(deleteLink).parents(collectionId);
    var itemsCount = collection.find(itemClassName).length;
    if (1 == itemsCount) {
        return;
    }

    var itemToDelete = $(deleteLink).parents(itemClassName);
    var itemToDeleteName = $(itemToDelete).find('[name*=' + itemName + ']').attr('name');
    var itemToDeleteIndex = new RegExp(itemName + '\\[\\d(?=\\])').exec(itemToDeleteName).toString().match(/\d/);
    itemToDelete.remove();

    if (2 == itemsCount) {
        collection.find(itemClassName).find(deleteLinkClassName).hide();
    }

    // update indexes
    for (var i = itemToDeleteIndex; i < itemsCount - 1; i++) {
        changeIndex(collection.find(itemClassName)[i], itemName, i);
    }
}

// removes validation from all elements in selector
function removeFromValidationContext(selector) {
    var names = [];
    $(selector).find('[data-val=true]').each(function () {
        names.push(this.name);
    });
    var rules = $(selector).parents('form').validate().settings.rules;
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        delete rules[name];
    }
}

// adds validation to all elements in selector
function addToValidationContext(selector) {
    // adds rules to 'allRules'
    $.validator.unobtrusive.parse(selector);
    var names = [];
    $(selector).find('[data-val=true]').each(function () {
        names.push(this.name);
    });
    var form = $(selector).parents('form');
    var currentRules = form.validate().settings.rules;
    var allRules = form.data('unobtrusiveValidation').options.rules;
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (!currentRules[name] && allRules[name]) {
            currentRules[name] = allRules[name];
        }
    }
}