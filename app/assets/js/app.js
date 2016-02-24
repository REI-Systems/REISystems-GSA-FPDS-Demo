var fpds = angular.module('FPDS', [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngResource',
    'ngCookies',
    'ngMessages',
    'ngSanitize',
    'ngTouch',
    'angularSpinner',
    'jqwidgets'
]).
config(['$routeProvider', 'usSpinnerConfigProvider', function ($routeProvider, usSpinnerConfigProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'DefaultController',
            templateUrl: 'templates/partials/default/_index.html'
        })
        .when('/login',
        {
            controller: 'LoginController',
            templateUrl: 'templates/partials/user/_login.html'
        })
        .when('/register',
        {
            controller: 'FormController',
            templateUrl: 'templates/partials/user/_form.html'
        })
        .when('/user/edit/:id',
        {
            controller: 'FormController',
            templateUrl: 'templates/partials/user/_form.html'
        })
        .when('/forgot-password',
        {
            controller: 'RequestEmailController',
            templateUrl: 'templates/partials/user/_forgotPassword.html'
        })
        .when('/resend-email',
        {
            controller: 'RequestEmailController',
            templateUrl: 'templates/partials/user/_resendEmail.html'
        })
        .when('/reset-password',
        {
            controller: 'ResetPasswordController',
            templateUrl: 'templates/partials/user/_resetPassword.html'
        })
        .when('/search',
        {
            controller: 'SearchController',
            templateUrl: 'templates/partials/search/_index.html'
        })
        .when('/newsearch',
        {
          controller: 'NewSearchController',
          templateUrl: 'templates/partials/newsearch/_index.html'  
        })
        .otherwise({redirectTo: '/'});

        //customizing spinner
        usSpinnerConfigProvider.setDefaults({color: 'black', radius:30, width:12, length: 25});
}]);

//assign all defined factories to this module 'factory'
fpds.factory(factories);

//assign all defined providers to this module 'provider'
fpds.provider(providers);

//assign all defined services to this module 'service'
fpds.service(services);

//assign all defined factories to this module 'factory'
fpds.filter(filters);

//assign all defined directives to this app module 'directive'
fpds.directive(directives);

//assign all defined controller to this module controller
fpds.controller(controllers);