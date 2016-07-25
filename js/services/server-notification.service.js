(function () {
    'use strict';

    angular
        .module('starter')
        .factory('serverNotificationService', serverNotificationService);

    serverNotificationService.$inject = ['logger', '$rootScope', '$window', '$interval', 'commonUtil'];

    /**
     * @namespace Logger
     * @desc Application wide logger
     * @memberOf Factories
     */
    function serverNotificationService(logger, $rootScope, $window, $interval, commonUtil) {

        /*
        listener: {filter:function(),fun:function()}
        */
        var ws_listeners = [];
        var worker = new Worker("./js/services/server-notification-worker.js");
        var event_buffer = [];
        var scrollBusy = false;
        var lastScrollMS = 0;
        var scrollIdleFactorMS = 500;
        logger.log("worker created.");


        worker.onmessage = function (evt) {
            logger.log((new Date()).toString()+'\n'+evt.data);

            for (var i = 0; i < ws_listeners.length; i++) {
                ws_listeners[i].fun(evt.data);
            }
        }

        return {
            addListener: addListener,
            removeListener: removeListener,
            connect: connect,
            sendJSON: sendJSON,
            sendMessage: sendMessage
        };

        function addListener(listener) {
            ws_listeners.push(listener);
            logger.log("After addListener: " + listener.name + ", ws_listeners.length: " + ws_listeners.length);
        }
        function removeListener(listener) {
            for (var i = 0; i < ws_listeners.length; i++) {
                if (ws_listeners[i] == listener) {
                    ws_listeners.splice(i, 1);
                    logger.log("After removeListener: " + listener.name + ", ws_listeners.length: " + ws_listeners.length);
                    return;
                }
            }
        }
        ////////////

        /**
         * @name connect
         * @desc Connect to server websocket.
         * @param {String} addr websocket address (like: "ws://localhost/echo").
         * @param {String} heartbeat Heartbeat message interval in ms.
         * @returns {Boolean}
         * @memberOf Factories.ServerNotificationService
         */
        function connect(_addr, _heartbeat) {
            logger.debug("_addr:"+_addr);
            worker.postMessage({ cmd: 'connect', addr: _addr, heartbeat: _heartbeat });
        };

        function sendJSON(_obj) {
            worker.postMessage({ cmd: 'sendJSON', obj: _obj });
        }
        function sendMessage(_str) {
            worker.postMessage({ cmd: 'sendMessage', str: _str });
        }

    }
})();