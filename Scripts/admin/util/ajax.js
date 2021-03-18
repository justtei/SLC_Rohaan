mslc.define('admin/util/ajax', ['lib/jQuery', 'lib/ko'], function($, ko) {
    'use strict';

    function get(url, data, doneClbck, failClbck, alwaysClbck) {
        return $.ajax({
            type: 'GET',
            url: url,
            data: data
        })
             .done(doneClbck)
             .fail(failClbck)
             .always(alwaysClbck);
    }

    function post(url, data, doneClbck, failClbck, alwaysClbck) {
        var sendData = ko.toJSON(data);
        sendData = sendData.replace(/:(\d+)([,\}])/g, ':"$1"$2'); // wraps all numbers to quotation marks

        return $.ajax({
            type: 'POST',
            url: url,
            data: sendData,
            traditional: true,
            contentType: 'application/json, charset=utf-8'
        })
             .done(doneClbck)
             .fail(failClbck)
             .always(alwaysClbck);
    }

    return {
        get: get,
        post: post
    };
});