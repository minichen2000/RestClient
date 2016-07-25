(function () {
    'use strict';

    angular
        .module('doc')
        .directive('littleAccordionBt', littleAccordionBt);
    littleAccordionBt.$inject = [];
    function littleAccordionBt() {
        return {
            // can be used as attribute or element
            restrict: 'AE',
            scope: {
                additionalClass: '=',
                accordionNotOn: '='
            },
            // which markup this directive generates
            templateUrl: 'js/directives/little-accordion-bt.html',
            replace: true
        };
    };
})();
