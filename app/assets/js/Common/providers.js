var providers = {};

providers.AuthProvider = [function () {
    return {
        $get: ['SessionFactory', 'ApiService', function (SessionFactory, ApiService) {
            return {
                loginUser: function (credentials) {
                    return ApiService.call('userLogin', '', '', {username: credentials.username, password: credentials.password}, 'POST');
                },
                isUserAuthenticated: function (callBackFnSuccess, callBackFnError, callBackFnFinally) {
                    return ApiService.call('userIsLoggedIn', '', '', {}, 'POST')
                        .then(function (data) {  //  , status, headers, config

                            //session valid
                            if (data.loggedIn) {
                                SessionFactory.setSession(data.user);

                                if(typeof callBackFnSuccess === 'function') {
                                    callBackFnSuccess();
                                }
                            }
                            else //session invalid
                            {
                                SessionFactory.destroySession();

                                if(typeof callBackFnError === 'function') {
                                    callBackFnError();
                                }
                            }
                        }, function () {    //  data, status, headers, config
                            SessionFactory.destroySession();
                        })
                        .finally(function () {
                            if(typeof callBackFnFinally === 'function') {
                                callBackFnFinally();
                            }
                        });
                },
                logoutUser: function (callBackFnSuccess, callBackFnError) {
                    return ApiService.call('userLogOut', '', '', {}, 'POST')
                        .then(function (data) {  //  , status, headers, config
                            if (data.success) {
                                SessionFactory.destroySession();
    
                                if(typeof callBackFnSuccess === 'function') {
                                    callBackFnSuccess(data);
                                }
                            }
                        },
                        function(error){
                            if(typeof callBackFnError === 'function') {
                                callBackFnError(error);
                            }
                        });
                }
            };
        }]
    };
}];