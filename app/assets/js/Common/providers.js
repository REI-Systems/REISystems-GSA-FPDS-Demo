var providers = {};

providers.AuthProvider = [function () {
    return {
        $get: function () {
            return {
                loginUser: function ($http, credentials) {
                    return $http.post('/user/login', {username: credentials.username, password: credentials.password});
                },
                isUserAuthenticated: function ($http, $rootScope) {
                    return $http.post('/user/isLoggedIn', {})
                        .success(function (data) {  //  , status, headers, config

                            //session valid
                            if (data.loggedIn) {
                                $rootScope.authenticated = {
                                    "user": data.user,
                                    "success": true,
                                    "role": data.user.role
                                }
                            }
                            else //session invalid
                            {
                                $rootScope.authenticated = {
                                    "user": null,
                                    "success": false,
                                    "role": null
                                };
                            }
                        })
                        .error(function () {    //  data, status, headers, config
                            $rootScope.authenticated = {
                                "user": null,
                                "success": false,
                                "role": null
                            };

                        });
                },
                logoutUser: function ($http, $rootScope, $location) {
                    return $http.post('/user/logout', {})
                        .success(function (data) {  //  , status, headers, config
                            if (data.success) {
                                $rootScope.authenticated = {
                                    "user": null,
                                    "success": false,
                                    "role": null
                                };
                                
                                $location.path('/');
                                }
                        });
                }
            };
        }
    };
}];