var controllers = controllers || {};

controllers.MainController = ['$stateParams', function ($stateParams) {
  
  // View Model
  var vm = this;
  
  vm.message = $stateParams.message;
  
}];