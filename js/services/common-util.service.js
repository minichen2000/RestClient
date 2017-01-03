(function () {
  'use strict';

  angular
    .module('starter')
    .factory('commonUtil', commonUtil);

  commonUtil.$inject = ['logger', '$q', '$timeout', '$interval', '$location'];


  function commonUtil(logger, $q, $timeout, $interval, $location) {

      var service = {
          generateWSUrl: generateWSUrl,
          formatNowDateTime: formatNowDateTime,
          formatDateTime: formatDateTime,
          formatDate: formatDate
      };
    return service;

    function generateWSUrl() {
      var absUrl = $location.absUrl();
      //logger.log("$location.absUrl()=" + absUrl);
      //logger.log("$location.url()=" + $location.url());
      var rlt = absUrl.slice(absUrl.indexOf(':'), absUrl.lastIndexOf($location.url()));
      rlt=rlt.replace(/\/#/g, '');
      if(rlt.lastIndexOf('/')==rlt.length-1){
        rlt=rlt.substring(0, rlt.length-1);
      }
      return "ws" + rlt + "/notification";
    }
      function formatDateTime(date) {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var seconds = date.getSeconds();
          var milliseconds = date.getMilliseconds();
          return ''+year+'/'+month+'/'+day+' '+hours+':'+minutes+':'+seconds+':'+milliseconds;
      }
      function formatDate(date) {
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var day = date.getDate();
          return ''+year+'/'+month+'/'+day;
      }
      function formatNowDateTime() {
          var date=new Date();
          return formatDateTime(date);
      }
  }


})();
