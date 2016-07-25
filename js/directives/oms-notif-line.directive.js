(function () {
    'use strict';

    angular
        .module('starter')
        .directive('omsNotifLine', omsNotifLine);
    omsNotifLine.$inject = ['commonUtil', 'logger', '$http'];
    function omsNotifLine(commonUtil, logger, $http) {
        return {
            // can be used as attribute or element
            restrict: 'AE',
            scope: {
                lineOne: '=',
                lineOneStyle: '=',
                lineTwo: '=',
                lineTwoStyle: '='
            },
            // which markup this directive generates
            templateUrl: 'js/directives/oms-notif-line.html',
            replace: true,
            link: function (scope, iElement, iAttrs) {
            }
        };
    };
})();
