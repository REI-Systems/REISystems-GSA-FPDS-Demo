var aQuery = aQuery || {
            agencyid:'',
            idvpiid: '',
            contractingofficeagencyid: '',
            vendorname: '',
            fiscal_year: '',
            contractactiontype: '',
            localareasetaside: '',
            maj_agency_cat: '',
            psc_cat: ''
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
      scope: {},
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
                    // console.log('onChange')
                    // console.log(aQuery)
                  },
                    debug:true,
                  onRemove: function(value, text, $removedChoice){
                      var $this = $($(this)[0]);
                      console.log($this)
                      console.log(value)
                      console.log(this)
                      // console.log($this.find('select').attr('name'))
                      // console.log('OnRemove')
                      // console.log('Before: ', aQuery[$this.find('select').attr('name')])
                      aQuery[$this.find('select').attr('name')].splice(aQuery[$this.find('select').attr('name')].indexOf(text), 1);
                      // console.log('After: ', aQuery[$this.find('select').attr('name')])

                      // $this.find('select').dropdown('remove selected', value);
                      // $this.dropdown('set selected', aQuery[$this.find('select').attr('name')]);
                      // $this.dropdown('refresh');
                      var options = '';
                      angular.forEach(aQuery[$this.find('select').attr('name')], function(item){
                        options += "<option value='"+item+"' class='additions'>"+item+"</option>";
                      });
                      $this.find('select').html(options);

                      $this.find('select').dropdown('refresh');

                      setTimeout(function(){
                          $this.find('select').dropdown('set selected', aQuery[$this.find('select').attr('name')])
                      }, 1);

                      //trigger table update
                      // var scope = angular.element($('.ui.grid.container')).scope();
                      // scope.$apply(function(){
                      //     scope.searchDataset();
                      // });
                  },
                  apiSettings: {
                    beforeSend: function(settings){

                        console.log('Before Send')

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
                        if(aQuery.contractingofficeagencyid.length > 0){
                            if(columnName == 'contractingofficeagencyid'){
                            clause +=  ''
                            }
                            else {
                            clause += "+AND+"
                            for (var i = 0; i<aQuery.contractingofficeagencyid.length-1; i++){
                            clause += "contractingofficeagencyid+='"+aQuery.contractingofficeagencyid[i]+"'+OR+"
                            }
                            clause += "contractingofficeagencyid+='"+aQuery.contractingofficeagencyid[aQuery.contractingofficeagencyid.length-1]+"'"
                            }
                            }
                        if(aQuery.vendorname.length > 0){
                            if(columnName == 'vendorname'){
                            clause +=  ''
                            }
                            else {
                            clause += "+AND+"
                            for (var i = 0; i<aQuery.vendorname.length-1; i++){
                            clause += "vendorname+='"+aQuery.vendorname[i]+"'+OR+"
                            }
                            clause += "vendorname+='"+aQuery.vendorname[aQuery.vendorname.length-1]+"'"
                            }
                            }
                        if(aQuery.fiscal_year.length > 0){
                            if(columnName == 'fiscal_year'){
                                clause +=  ''
                            }
                            else {
                                clause += "+AND+"
                                for (var i = 0; i<aQuery.fiscal_year.length-1; i++){
                                    clause += "fiscal_year+='"+aQuery.fiscal_year[i]+"'+OR+"
                                }
                                clause += "fiscal_year+='"+aQuery.fiscal_year[aQuery.fiscal_year.length-1]+"'"
                            }
                            }
                        if(aQuery.contractactiontype.length > 0){
                            if(columnName == 'contractactiontype'){
                            clause +=  ''
                            }
                            else {
                        clause += "+AND+"
                        for (var i = 0; i<aQuery.contractactiontype.length-1; i++){
                            clause += "contractactiontype+='"+aQuery.contractactiontype[i]+"'+OR+"
                        }
                        clause += "contractactiontype+='"+aQuery.contractactiontype[aQuery.contractactiontype.length-1]+"'"
                        }
                        }
                        if(aQuery.localareasetaside.length > 0){
                            if(columnName == 'localareasetaside'){
                            clause +=  ''
                            }
                            else {
                        clause += "+AND+"
                            for (var i = 0; i<aQuery.localareasetaside.length-1; i++){
                              clause += "localareasetaside+='"+aQuery.localareasetaside[i]+"'+OR+"
                              }
                              clause += "localareasetaside+='"+aQuery.localareasetaside[aQuery.localareasetaside.length-1]+"'"
                              }
                              }
                        if(aQuery.maj_agency_cat.length > 0){
                            if(columnName == 'maj_agency_cat'){
                            clause +=  ''
                            }
                            else {
                            clause += "+AND+"
                            for (var i = 0; i<aQuery.maj_agency_cat.length-1; i++){
                            clause += "maj_agency_cat+='"+aQuery.maj_agency_cat[i]+"'+OR+"
                            }
                            clause += "maj_agency_cat+='"+aQuery.maj_agency_cat[aQuery.maj_agency_cat.length-1]+"'"
                            }
                            }
                        if(aQuery.psc_cat.length > 0){
                            if(columnName == 'psc_cat'){
                            clause +=  ''
                            }
                            else {
                            clause += "+AND+"
                            for (var i = 0; i<aQuery.psc_cat.length-1; i++){
                            clause += "psc_cat+='"+aQuery.psc_cat[i]+"'+OR+"
                            }
                            clause += "psc_cat+='"+aQuery.psc_cat[aQuery.psc_cat.length-1]+"'"
                            }
                            }

                settings.url = settings.url + clause + '+GROUP+BY+' + columnName + '+ORDER+BY+' +columnName
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