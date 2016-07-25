(function () {
    'use strict';

    angular
        .module('doc')
        .directive('littleCopyBt', littleCopyBt);
    littleCopyBt.$inject = [];
    function littleCopyBt() {
        return {
            // can be used as attribute or element
            restrict: 'AE',
            scope: {
                additionalClass: '=',
                dataToCopy: '='
            },
            // which markup this directive generates
            templateUrl: 'js/directives/little-copy-bt.html',
            replace: true,
            link: function (scope, iElement, iAttrs) {
                //scope.additionalClass={scope.additionalClass: scope.additionalClass}
                scope.getData=function(){
                    return scope.dataToCopy;
                }
            }
        };
    };
})();
