mslc.define('client/util/ajax', ['lib/jQuery'], function($) {
    'use strict';

    function formRequest(type, url, data, done, fail, always) {
        var requestSettings = {
            type: type,
            url: url,
            data: data,
            traditional: true,
            contentType: 'application/json, charset=utf-8'
        },
        request = $.ajax(requestSettings);

        if (typeof done === "function") {
            request.done(done);
        }

        if (typeof fail === "function") {
            request.fail(fail);
        }

        if (typeof always === "function") {
            request.done(always);
        }

        return request;
    }

    function get(url, data, done, fail, always) {
        return formRequest('GET', url, data, done, fail, always);
    }

    function post(url, data, done, fail, always) {
        return formRequest('POST', url, data, done, fail, always);
    }

    function update(url, data, done, fail, always) {
        return formRequest('UPDATE', url, data, done, fail, always);
    }

    function del(url, data, done, fail, always) {
        return formRequest('DELETE', url, data, done, fail, always);
    }

    return {
        get: get
        , post: post
        , update: update
        , del: del
        , request: formRequest
    };
});