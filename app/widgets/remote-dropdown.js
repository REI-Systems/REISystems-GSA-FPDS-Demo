var aQuery = aQuery || {
            agencyid:'',
            idvpiid: '',
            contractingofficeagencyid: '',
            vendorname: ''
        };

(function() {
  'use strict';

  angular
    .module('app.widgets')
    .directive('remoteDropdown', RemoteDropdown);

  function RemoteDropdown() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
      },
      template: '<select multiple="" class="ui fluid remote search dropdown" ></select>',
      link: function(scope, element, attrs, controller) {
        var columnName = attrs.column;
        var clause = "";
        angular.element(document).ready(function() {


          $('[column=' + columnName + ']').dropdown();

          setTimeout(function(){
            
            $('[column=' + columnName + ']').parent()
                .dropdown({
                  onChange: function(aValue, text){
                    var $this = $($(this)[0]);
                    aQuery[$this.find('select').attr('name')] = aValue;
                    console.log(aQuery)
                  },
                  apiSettings: {
                    beforeSend: function(settings){
                      settings.urlData.query = settings.urlData.query.toUpperCase();

                        if(aQuery.agencyid.length > 0){
                        for (var i = 0; i<aQuery.agencyid.length-1; i++){
                            clause += "agencyid="+aQuery.agencyid[i]+"OR"
                            settings.urlData.query = "agencyid:"
                        }
                        clause += "agencyid="+aQuery.agencyid[aQuery.agencyid.length-1]
                        clause+="+AND+"
                        }

//                        if(aQuery.agencyid.length > 0){
//                            settings.urlData.query = "agencyid:"
//                        }
//                        if(aQuery.agencyid.length > 0){
//                            settings.urlData.query = "agencyid:"
//                        }
//                        if(aQuery.agencyid.length > 0){
//                            settings.urlData.query = "agencyid:"
//                        }
                      return settings;
                    },

                    onResponse: function(apiResponse) {
                      var response = {
                        results: []
                      };
                      $.each(apiResponse.rows, function(index, item) {
                        response.results.push({ "name": item, "value": item });
                      });
                      console.log('Response' + response);
                     // console.log(this.url);
                     // console.log(transform);

                      return response;

                    },
                    url: '/api/search/query?sql=SELECT+' + columnName + '+FROM+contract+WHERE+'+ columnName + '+like+' + '\'{query}%25\''+clause+'GROUP+BY+' + columnName
                  }
                });

          }, 1000);

        });

      }
    }
  }

})();