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
                        }
                        clause += "agencyid="+aQuery.agencyid[aQuery.agencyid.length-1]
                        clause+="+AND+"
                        }
                        if(aQuery.idvpiid.length > 0){
                            for (var i = 0; i<aQuery.idvpiid.length-1; i++){
                              clause += "idvpiid="+aQuery.idvpiid[i]+"OR"
                              }
                              clause += "idvpiid="+aQuery.agencyid[aQuery.idvpiid.length-1]
                              clause+="+AND+"
                              }
                        if(aQuery.contractingofficeagencyid.length > 0){
                            for (var i = 0; i<aQuery.contractingofficeagencyid.length-1; i++){
                              clause += "idvpiid="+aQuery.contractingofficeagencyid[i]+"OR"
                              }
                              clause += "idvpiid="+aQuery.contractingofficeagencyid[aQuery.contractingofficeagencyid.length-1]
                              clause+="+AND+"
                              }
                        if(aQuery.vendorname.length > 0){
                            for (var i = 0; i<aQuery.idvpiid.length-1; i++){
                               clause += "idvpiid="+aQuery.idvpiid[i]+"OR"
                               }
                               clause += "idvpiid="+aQuery.agencyid[aQuery.idvpiid.length-1]
                               }
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