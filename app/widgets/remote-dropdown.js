(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('remoteDropdown', RemoteDropdown);

  function RemoteDropdown() {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      template: '<select multiple="" class="ui fluid remote search dropdown"></select>',
      link: function(scope, element, attrs, controller) {
        var columnName = attrs.column;
        angular.element(document).ready(function() {

          $('[column=' + columnName + ']').dropdown();

          setTimeout(function(){
            
            $('[column=' + columnName + ']').parent()
                .dropdown({
                  apiSettings: {
                    onResponse: function(apiResponse) {
                      var response = {
                        results: []
                      };
                      $.each(apiResponse.rows, function(index, item) {
                        response.results.push({ "name": item, "value": item });
                      });
                      console.log('Response' + response);
                      return response;
                    },
                    url: '/api/search/query?sql=SELECT+' + columnName + '+FROM+contract+WHERE+' + columnName + '+like+' + '\'{query}%25\'+GROUP+BY+' + columnName
                  }
                });
            
          }, 1000);


        });

      }
    }
  }

})();