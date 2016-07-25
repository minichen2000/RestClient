(function () {
    'use strict';

    var ws;
    var ws_state = 0; //0: not connected, 1: connected, 2: trying to connect
    var heartbeatLaunched = false;


    onmessage = function (evt) {
        var cmd = evt.data;
        //console.log("cmd:" + JSON.stringify(cmd));
        if (cmd.cmd == "connect") {
            connect(cmd.addr, cmd.heartbeat);
        } else if (cmd.cmd == "sendJSON") {
            sendJSON(cmd.obj);
        } else if (cmd.cmd == "sendMessage") {
            sendMessage(cmd.str);
        }
    }


    /**
     * @name connect
     * @desc Connect to server websocket.
     * @param {String} addr websocket address (like: "ws://localhost/echo").
     * @param {String} heartbeat Heartbeat message interval in ms.
     * @returns {Boolean}
     * @memberOf Factories.ServerNotificationService
     */
    function connect(addr, heartbeat) {
        if (connectOnce(addr, heartbeat)) {
            return true;
        } else {
            setTimeout(function () {
                connect(addr, heartbeat);
            }, 3000);
            return false;
        }
    }
    function connectOnce(addr, heartbeat) {
        try {
            console.log("Try to connect to websocket: " + addr);
            ws_state = 2;
            ws = new WebSocket(addr);
            console.log("Connected: " + addr);

            ws.onopen = function () {
                console.log("ws onopen!");
                ws_state = 1;
            };


            ws.onerror = function (event) {
                console.log("onerror: " + event);

                ws_state = 0;
                ws.close();
            };

            ws.onclose = function () {
                console.log("ws onclose.");

                ws_state = 2;
                setTimeout(function () {
                    console.log("Reconnect to websocket.");
                    connect(addr, heartbeat);
                }, 3000);
            };


            ws.onmessage = function (event) {
                //console.log("ws.onmessage: " + event.data);
                //var data = JSON.parse(event.data);
                postMessage(event.data);


            };


            if (!heartbeatLaunched) {
                heartbeatLaunched = true;
                setInterval(function () {
                    if (ws_state == 1) sendMessage("heartbeat: " + (new Date().toLocaleTimeString()));
                }, heartbeat);
            }

            return true;
        } catch (e) {
            console.error("Exception: " + e.message);
            return false;
        }
    }

    function sendJSON(obj) {
        if (ws_state != 1) {
            return false;
        }
        ws.send(JSON.stringify(obj));
        return true;
    }
    function sendMessage(str) {
        if (ws_state != 1) {
            return false;
        }
        ws.send(str);
        return true;
    }
})();