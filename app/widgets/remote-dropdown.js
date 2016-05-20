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

                      console.log(settings.url);

                        if(aQuery.agencyid.length == 0 && aQuery.idvpiid.length ==0 && aQuery.contractingofficeagencyid.length ==0 && aQuery.vendorname.length ==0) {
                        clause += '';
                        }
                        if(aQuery.agencyid.length > 0){
                            if(columnName == 'agencyid'){
                            clause +=  ''
                            }
                            else {
                        clause += "+AND+"
                        for (var i = 0; i<aQuery.agencyid.length-1; i++){
                            clause += "agencyid+='"+aQuery.agencyid[i]+"'+OR+"
                        }
                        clause += "agencyid+='"+aQuery.agencyid[aQuery.agencyid.length-1]+"'"
                        }
                        }
                        if(aQuery.idvpiid.length > 0){
                            if(columnName == 'idvpiid'){
                            clause +=  ''
                            }
                            else {
                        clause += "+AND+"
                            for (var i = 0; i<aQuery.idvpiid.length-1; i++){
                              clause += "idvpiid+='"+aQuery.idvpiid[i]+"'+OR+"
                              }
                              clause += "idvpiid+='"+aQuery.idvpiid[aQuery.idvpiid.length-1]+"'"
                              }
                              }
   
                settings.url = settings.url + clause + '+GROUP+BY+' + columnName
                clause = '';
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
                    url: '/api/search/query?sql=SELECT+' + columnName + '+FROM+contract+WHERE+'+ columnName + '+like+' + '\'{query}%25\''
                  }
                });

          }, 1000);

        });

      }
    }
  }

})();