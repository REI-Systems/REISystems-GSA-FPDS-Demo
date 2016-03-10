(function() {

  angular.module('app').directive('remoteDropdown', RemoteDropdown);

  function RemoteDropdown() {
    return {
      restrict: 'E',
      replace: true,
      scope: {},
      templateUrl: 'templates/remote-dropdown.html',
      link: function(scope, element, attrs, controller) {
        var columnName = attrs.column;
        console.log(columnName);
        angular.element(document).ready(function() {
          $('[column='+columnName+']')
            .dropdown({
              saveRemoteData: false,
              apiSettings: {
                onResponse: function(apiResponse) {
                  var response = {
                    results: []
                  };
                  $.each(apiResponse.rows, function(index, item) {
                    response.results.push({ "name": item, "value": item });
                  });
                  return response;
                },
                url: '/api/search/query?sql=SELECT+' + columnName + '+FROM+contract+WHERE+' + columnName + '+like+' + '\'{query}%25\'+GROUP+BY+' + columnName
              }
            });
        });

      }
    }
  }

})();