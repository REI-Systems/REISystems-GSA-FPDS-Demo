var providers = {};

providers.AuthProvider = [function () {
    return {
        $get: ['SessionFactory', 'ApiService', function (SessionFactory, ApiService) {
            return {
                loginUser: function (credentials) {
                    return ApiService.call('userLogin', '', '', {username: credentials.username, password: credentials.password}, 'POST');
                },
//                isUserAuthenticated: function ($http, $rootScope) {
                isUserAuthenticated: function (callBackFnSuccess, callBackFnError) {
                    return ApiService.call('userIsLoggedIn', '', '', {}, 'POST')
                        .then(function (data) {  //  , status, headers, config

                            //session valid
                            if (data.loggedIn) {
//                                $rootScope.authenticated = {
//                                    "user": data.user,
//                                    "success": true
//                                }
                                SessionFactory.setSession(data.user);

                                if(typeof callBackFnSuccess === 'function') {
                                    callBackFnSuccess();
                                }
                            }
                            else //session invalid
                            {
//                                $rootScope.authenticated = {
//                                    "user": null,
//                                    "success": false
//                                };
                                SessionFactory.destroySession();

                                if(typeof callBackFnError === 'function') {
                                    callBackFnError();
                                }
                            }
                        }, function () {    //  data, status, headers, config
//                            $rootScope.authenticated = {
//                                "user": null,
//                                "success": false
//                            };
                            SessionFactory.destroySession();
                        });
                },
//                logoutUser: function ($http, $rootScope, $location) {
                logoutUser: function ($location) {
                    return ApiService.call('userLogOut', '', '', {}, 'POST')
                        .then(function (data) {  //  , status, headers, config
                            if (data.success) {
//                                $rootScope.authenticated = {
//                                    "user": null,
//                                    "success": false
//                                };

                                SessionFactory.destroySession();
                                
                                $location.path('/');
                            }
                        });
                }
            };
        }]
    };
}];