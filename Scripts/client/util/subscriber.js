mslc.define('client/util/subscriber', ['client/util/function', 'client/util/number'], function(fun, num) {
    'use strict';
    function Subscriber() {

        //#region Private

        var subscriberId,
            subscribers = {};

        //#endregion

        //#region Public

        function subscribe(callback) {
            var id = subscriberId;
            subscriberId++;
            if (typeof callback != "function") {
                return null;
            }

            subscribers[id] = callback;
            return id;
        }

        function unsubscribe(id) {
            delete subscribers[id];
        }

        function notify(value) {
            for (var key in subscribers) {
                if (subscribers.hasOwnProperty(key)) {
                    fun.invoke(subscribers[key], value);
                }
            }
        }

        function clear() {
            for (var key in subscribers) {
                if (subscribers.hasOwnProperty(key)) {
                    delete subscribers[key];
                }
            }
        }

        //#endregion

        //#region Interface

        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        this.notify = notify;
        this.clear = clear;

        //#endregion

        //#region Init

        function init() {
            subscriberId = num.random(100, 1000);
        }

        init();

        //#endregion

        return this;
    }

    return Subscriber;
})