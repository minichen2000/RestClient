(function () {
    'use strict';

    angular
        .module('starter')
        .directive('omsOtnRestForm', omsOtnRestForm);
    omsOtnRestForm.$inject = ['commonUtil', 'logger', '$http'];
    function omsOtnRestForm(commonUtil, logger, $http) {
        return {
            // can be used as attribute or element
            restrict: 'AE',
            scope: {
                formOtnProtocal: '=',
                formOtnIp: '=',
                formOtnPort: '=',
                formOmsUrlPrefix: '='
            },
            // which markup this directive generates
            templateUrl: 'js/directives/oms-otn-rest-form.html',
            replace: true,
            link: function (scope, iElement, iAttrs) {
                scope.baseUrl=scope.formOtnProtocal+'://'+scope.formOtnIp+':'+scope.formOtnPort+scope.formOmsUrlPrefix;
                scope.path=null;
                scope.result="";
                scope.postBody="";
                scope.postBodyOptions={mode: 'code'};
                scope.resultOptions={mode: 'code'};
                scope.result={result: '', resultOptions: {mode: 'code'}};
                scope.onLoad = function (instance) {
                    instance.expandAll();
                };

                function onRequest(method){
                    var url_=scope.baseUrl+scope.path;
                    logger.debug("url:["+method+']: '+url_);
                    $http({
                        method: 'post',
                        url: './op',
                        params: {
                            'method': method,
                            'url': url_,
                            'contentType': 'application/json'
                        },
                        data: JSON.stringify(scope.postBody ? scope.postBody : "")
                    })
                        .then(function(rsp){
                            var rlt=JSON.stringify(rsp, null, 2);
                            logger.debug("rsp:"+rlt);
                            scope.result.result=rsp.data;
                        })
                        .catch(function(rsp){
                            var rlt=JSON.stringify(rsp, null, 2);
                            logger.error("rsp:"+rlt);
                            scope.result.result=rsp;
                        });
                }
                scope.onGet=function(){
                    onRequest('get');
                }
                scope.onPost=function(){
                    onRequest('post');
                }
                scope.onDelete=function(){
                    onRequest('delete');
                }
            }
        };
    };
})();
