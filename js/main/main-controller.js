/**
 * Created by Chen on 2016/4/20.
 */
(function () {
    'use strict';

    angular
        .module('starter')
        .controller('MainController', MainController);

    MainController.$inject = ['$http', '$scope', 'commonUtil', 'logger', '$interval', '$timeout', 'serverNotificationService'];
    function MainController($http, $scope, commonUtil, logger, $interval, $timeout, serverNotificationService) {
        var vm = this;
        vm.requestProcessing=false;
        vm.notifications=[];
        vm.autoScroll=true;
        vm.onLoad = function (instance) {
            //instance.expandAll();
        };

        vm.baseUrl='http://localhost:9000/adapter';
        vm.path="/nes";
        vm.result=null;
        vm.postBody=null;
        vm.postBodyOptions={mode: 'code'};
        vm.resultOptions={mode: 'code'};


        vm.wsAddress="ws://localhost:19000";
        vm.wsAddressHistory=new HashMap();

        vm.ws_state=2;

        function addContentToHistory(content, history){
            history.set(content, content);
        }


        vm.postBodyModeSwith=function(){
            vm.postBodyOptions.mode=vm.postBodyOptions.mode=='code' ? 'tree' : 'code';
        };

        vm.resultModeSwith=function(){
            vm.resultOptions.mode=vm.resultOptions.mode=='code' ? 'tree' : 'code';
        };

        function onRequest(method_){
            vm.requestProcessing=true;
            var url_=vm.baseUrl+vm.path;
            logger.debug("url:["+method_+']: '+url_);
            $http({
                method: method_,
                url: url_,
                data: JSON.stringify(vm.postBody ? vm.postBody : "")
            })
                .then(function(rsp){
                    var rlt=JSON.stringify(rsp, null, 2);
                    //logger.debug("rsp:"+rlt);
                    vm.result=rsp.data;
                    vm.requestProcessing=false;
                })
                .catch(function(rsp){
                    var rlt=JSON.stringify(rsp, null, 2);
                    //logger.error("rsp:"+rlt);
                    vm.result=rsp;
                    vm.requestProcessing=false;
                });
        }
        vm.onGet=function(){
            onRequest('get');
        };
        vm.onPost=function(){
            onRequest('post');
        };
        vm.onPut=function(){
            onRequest('put');
        };
        vm.onPatch=function(){
            onRequest('patch');
        };
        vm.onDelete=function(){
            onRequest('delete');
        };

        vm.onWsAddressHistorySelected=function(address){
            vm.wsAddress=address;
        };
        vm.onNotificationConnect=function(){
            serverNotificationService.connect(vm.wsAddress, "5000");
            logger.debug("vm.wsAddressHistory:\n"+JSON.stringify(vm.wsAddressHistory.keys(), null,2));
        };
        vm.onNotificationDisconnect=function(){
            serverNotificationService.close();
        };

        vm.clearNotifications=function(){
            vm.notifications.length=0;
        };

        function tryToAutoScroll(){
            if(vm.autoScroll){
                setTimeout(function(){
                    document.getElementById("notifArea").scrollTop = document.getElementById("notifArea").scrollHeight;
                }, 20);
            }
        }
        vm.swithAutoScroll=function(){
            vm.autoScroll=!vm.autoScroll;
            tryToAutoScroll();
        };





        var listenerFun = function(evtData) {
            $scope.$apply(function() {

                if(typeof evtData=="string"){
                    evtData=JSON.parse(evtData);
                }

                logger.debug("notification msg:\n"+JSON.stringify(evtData, null,2));
                if(undefined!=evtData.ws_state){
                    vm.ws_state=evtData.ws_state;
                    if(3==vm.ws_state){
                        vm.notifications.push({
                            line1: '['+commonUtil.formatNowDateTime()+']  WebSocket try to connect.'
                        });
                    }else if(1==vm.ws_state){
                        vm.notifications.push({
                            line1: '['+commonUtil.formatNowDateTime()+']  WebSocket connected.'
                        });
                        addContentToHistory(vm.wsAddress, vm.wsAddressHistory);
                    }else if(0==vm.ws_state){
                        vm.notifications.push({
                            line0: '['+commonUtil.formatNowDateTime()+']  WebSocket error.'
                        });
                    }else if(2==vm.ws_state){
                        vm.notifications.push({
                            line0: '['+commonUtil.formatNowDateTime()+']  WebSocket closed.'
                        });
                    }
                }else{
                    vm.notifications.push({
                        line1: '['+commonUtil.formatNowDateTime()+']',
                        line2: JSON.stringify(evtData, null,2)
                    });
                }

            });
            tryToAutoScroll();

        };


        serverNotificationService.addListener({ name: 'main', fun: listenerFun });
    }
})();

