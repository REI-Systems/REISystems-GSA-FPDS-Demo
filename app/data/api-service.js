(function() {
  'use strict';

  angular
    .module('app.data')
    .service('apiService', apiService);

  apiService.$inject = ['$http', '$q', '$log'];

  function apiService($http, $q, $log) {
    var APIs = {
      "userLogin": "/user/login",
      "userCreate": "/user/create",
      "userUpdate": "/user/update/",
      "userIsLoggedIn": "/user/isLoggedIn",
      "userLogOut": "/user/logout",
      "userSendActivation": '/user/sendEmailToken',
      "activateAccount": "/user/activateAccount",
      "resetPassword": "/user/resetPassword",
      "search": "/api/search/query"
    };

    this.APIs = APIs;

    /**
     * common function to perform an API CALL
     * 
     * @param String ApiName
     * @param String ApiSuffix
     * @param Object JSON oParams only for GET method
     * @param Object JSON oData for others method then GET
     * @param String method (GET|POST|PUT...)
     * @returns {$q@call;defer.promise}
     */
    this.call = function(ApiName, ApiSuffix, oParams, oData, method) {
      var deferred = $q.defer();
      $http({
        'method': method,
        'url': APIs[ApiName] + ApiSuffix,
        'params': oParams,
        'data': oData
      })
        .success(function(data) {
          deferred.resolve(data);
        }).error(function(msg, code) {
          deferred.reject(msg);
          $log.error(msg, code);
        });

      return deferred.promise;
    };

    /**
     * common function to perform multiple API CALLS
     * 
     * @param Array object aApiParams
     * @returns {$q@call;defer.promise}
     */
    this.calls = function(aApiParams) {
      var deferred = $q.defer();
      var urlCalls = [];

      angular.forEach(aApiParams, function(oApiParam) {
        urlCalls.push(
          $http({
            'method': oApiParam.method,
            'url': APIs[oApiParam.name] + oApiParam.suffix,
            'params': oApiParam.oParams,
            'data': oApiParam.oData
          })
        );
      });

      $q.all(urlCalls)
        .then(
        function(results) {
          deferred.resolve(results);
        },
        function(errors) {
          deferred.reject(errors);
          $log.error(errors);
        },
        function(updates) {
          deferred.update(updates);
        }
        );

      return deferred.promise;
    };
  }

})();