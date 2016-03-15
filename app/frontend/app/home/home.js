(function() {
  'use strict';

  angular
    .module('app.home')
    .controller('Home', Home);

  Home.$inject = ['$state'];

  function Home($state) {
    var vm = this;
  }

})();

