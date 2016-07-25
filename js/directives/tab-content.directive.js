(function () {
    'use strict';

    angular
        .module('doc')
        .directive('tabContent', tabContent);
    tabContent.$inject = [];
    function tabContent() {
        return {
            // can be used as attribute or element
            restrict: 'AE',
            scope: {
                groupData: '='
            },
            // which markup this directive generates
            templateUrl: 'js/directives/tab-content.html',
            replace: true,
            link: function (scope, iElement, iAttrs) {
                scope.jsonString=function(data){
                    return JSON.stringify(data, null, 2);
                }

                scope.makeJsonFixedPartString=function(data){
                    var orig=scope.jsonString(data);
                    var s=orig.substring(0, orig.length-2);
                    s+=',\n\n';
                    return s;
                }
                scope.makeJsonFixedPartCopyString=function(data){
                    var orig=scope.jsonString(data);
                    var s=orig.substring(0, orig.length-2);
                    s+=',\n\n\n\n\n\n}';
                    return s;
                }
                scope.makeJsonCustomizedPartString=function(data){
                    var orig=scope.jsonString(data);
                    var s=orig.substring(2, orig.length-1);
                    return s;
                }
            }
        };
    };
})();
