$(function()
{
    $('.get-brochure').on('click', showBrochureLeadForm);
    $('.get-info').on('click', showInfoLeadForm);
    $('.lead-form').on('submit', submitLeadForm);
    customDatePicker(document.body);
});