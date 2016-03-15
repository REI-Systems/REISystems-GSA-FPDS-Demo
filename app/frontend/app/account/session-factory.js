(function() {
  'use strict';

  angular
    .module('app.account')
    .factory('userSession', userSession);

  function userSession() {
    var session = {
      "user": null,
      "isAuth": false
    };

    return {
      setSession: function(oUser) {
        session.user = oUser;
        session.isAuth = true;
      },
      destroySession: function() {
        session.user = null;
        session.isAuth = false;
      },
      getSession: function() {
        return session;
      },
      isUserAuthenticated: function() {
        return session.isAuth;
      }
    };
  }

})();