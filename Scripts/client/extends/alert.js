mslc.define('client/extends/alert', ['lib/jQuery'], function($) {
    return {
        extend: function() {
            $('body').on('click', '[data-dismiss="alert"]', function() {
                $(this).parent('.alert').remove();
            });
        }
    };
});
