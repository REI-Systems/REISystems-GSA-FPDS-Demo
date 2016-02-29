var controllers = controllers || {};

controllers.DefaultController = ['$scope', '$stateParams', 'ApiService', function ($scope, $stateParams, ApiService) {

  if (typeof $stateParams.disconnected !== 'undefined') {
    $scope.flash = {
      "type": "positive",
      "message": "You have been successfully disconnected !"
    };
  }

  //activate user account
  if (typeof $stateParams.token !== 'undefined') {

    ApiService.call('activateAccount', '', {}, { token: $stateParams.token }, 'POST').then(
      function (data) {
        $scope.flash = {
          "type": "positive",
          "message": data.message
        };
      },
      function (error) {
        $scope.flash = {
          "type": "negative",
          "message": error.message
        };
      });
  }
    
  // Init main nav dropdowns
  $scope.initMenus = function () {
    $(function () {
      // wait till all resources are available
      
      $('.fixed.menu').addClass("hidden");
      
      // fix menu when passed
      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function () {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function () {
            $('.fixed.menu').transition('fade out');
          }
        })
      ;

      // create sidebar and attach to menu open
      $('.ui.sidebar').sidebar('attach events', '.toc.item');
    });
  };
  $scope.initMenus();

}];