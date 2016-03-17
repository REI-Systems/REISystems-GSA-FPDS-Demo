(function() {
  'use strict';

  angular
    .module('app.account')
    .provider('userAuthorization', userAuthorization);

  function userAuthorization() {
    return {
      $get: ['userSession', 'apiService', function(userSession, apiService) {
        return {
          loginUser: function(credentials) {
            return apiService.call('userLogin', '', '', { username: credentials.username, password: credentials.password }, 'POST');
          },
          isUserAuthenticated: function(callBackFnSuccess, callBackFnError, callBackFnFinally) {
            return apiService.call('userIsLoggedIn', '', '', {}, 'POST')
              .then(function(data) {  //  , status, headers, config

                //session valid
                if (data.loggedIn) {
                  userSession.setSession(data.user);

                  if (typeof callBackFnSuccess === 'function') {
                    callBackFnSuccess();
                  }
                }
                else //session invalid
                {
                  userSession.destroySession();

                  if (typeof callBackFnError === 'function') {
                    callBackFnError();
                  }
                }
              }, function() {    //  data, status, headers, config
                userSession.destroySession();
              })
              .finally(function() {
                if (typeof callBackFnFinally === 'function') {
                  callBackFnFinally();
                }
              });
          },
          logoutUser: function(callBackFnSuccess, callBackFnError) {
            return apiService.call('userLogOut', '', '', {}, 'POST')
              .then(function(data) {  //  , status, headers, config
                if (data.success) {
                  userSession.destroySession();

                  if (typeof callBackFnSuccess === 'function') {
                    callBackFnSuccess(data);
                  }
                }
              },
              function(error) {
                if (typeof callBackFnError === 'function') {
                  callBackFnError(error);
                }
              });
          },
          sendEmailToken: function(oParam) {
            return apiService.call('userSendActivation', '', '', { email: oParam.email, type: oParam.type }, 'POST');
          }
        };
      }]
    };
  }

})();