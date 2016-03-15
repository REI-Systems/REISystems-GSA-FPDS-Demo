(function() {
  'use strict';

  angular
    .module('app.search')
    .directive('advancedSearch', advancedSearch);

  advancedSearch.$inject = ['apiService'];

  function advancedSearch(apiService) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'search/search-advanced.html',
      link: function(scope, element, attrs, controller) {

        scope.searchDataset = function() {

          $('.ui.accordion').accordion('close', 0);

          var sqlClause = '';

          angular.forEach(scope.searchFilterForm, function(field, key) {

            if (key[0] === '$') return;

            if (field.$name === "dollarsobligated") {
              field.$setViewValue($("#slider-range").slider("values"));
            }

            if (field.$name === "signeddate") {
              var fromMilliseconds = new Date($("#from").datepicker("getDate"));
              var toMilliseconds = new Date($("#to").datepicker("getDate"));

              //Remove last 3 zeros to match DB format
              var fromMillisecondsFormat = Number((fromMilliseconds.getTime().toString()).slice(0, -3));
              var toMillisecondsFormat = Number((toMilliseconds.getTime().toString()).slice(0, -3));

              field.$setViewValue([fromMillisecondsFormat, toMillisecondsFormat]);
              console.log(field);
            }

            if (!field.$pristine && field.$modelValue !== '') {

              var str = '';

              if (Array.isArray(field.$modelValue) && field.$modelValue.length !== 0) {

                field.$modelValue.forEach(function(value, index, array) {

                  if (field.$name === "dollarsobligated") {
                    if (str === '') {
                      str += key + '>=' + value + " AND ";
                    } else {
                      str += key + '<=' + value;
                    }
                  } else if (field.$name === "signeddate") {
                    if (str === '' && value !== 0 && index === 0) {
                      str += key + '>=' + value;
                    } else if (str !== '' && value !== 0) {
                      str += " AND " + key + '<=' + value;
                    } else if (str === '' && value !== 0 && index === 1) {
                      str += key + '<=' + value;
                    }
                  } else if (str === '') {
                    str += key + "='" + value + "'";
                  } else {
                    str += " OR " + key + "='" + value + "'";
                  }

                });

                if (str) {
                  str = '(' + str + ')';
                }


              } else if (!Array.isArray(field.$modelValue)) {
                str = key + "='" + field.$modelValue + "'";
              }

              if (str) {
                sqlClause += (sqlClause !== '') ? ' AND ' + str : 'WHERE ' + str;
              }

            }
          });

          scope.vm.updateTableResults(sqlClause);

        };

        angular.element(document).ready(function() {

          $('.ui.accordion').accordion();
          $('.ui.dropdown').dropdown();

          //DatePicker
          $("#from").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            changeYear: true,
            onClose: function(selectedDate) {
              $("#to").datepicker("option", "minDate", selectedDate);
            }
          });
          $("#to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            changeYear: true,
            onClose: function(selectedDate) {
              $("#from").datepicker("option", "maxDate", selectedDate);
            }
          });


          // Slider
          Number.prototype.formatMoney = function(c, d, t) {
            var n = this,
              c = isNaN(c = Math.abs(c)) ? 2 : c,
              d = d == undefined ? "." : d,
              t = t == undefined ? "," : t,
              s = n < 0 ? "-" : "",
              i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
              j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
          };

          var sliderMin = 0;
          var sliderMax = 100000;

          $("#slider-range").slider({
            range: true,
            //step: 10000,
            min: sliderMin,
            max: sliderMax,
            values: [sliderMin, sliderMax],
            slide: function(event, ui) {
              $("#dollarsobligated").val("$" + (ui.values[0]).formatMoney(0, '.', ',') + " to $" + (ui.values[1]).formatMoney(0, '.', ','));
            }
          });

          $("#dollarsobligated").val("$" + $("#slider-range").slider("values", 0) + " to $" + $("#slider-range").slider("values", 1));

          apiService.call('search', '', { 'sql': 'SELECT contractactiontype,agencyid,signeddate,contractingofficeagencyid,maj_agency_cat,dollarsobligated,principalnaicscode,psc_cat,vendorname,zipcode,placeofperformancecountrycode,pop_state_code,localareasetaside,fiscal_year,effectivedate,unique_transaction_id,solicitationid,dunsnumber,descriptionofcontractrequirement FROM contract ORDER BY dollarsobligated DESC LIMIT 1' }, {}, 'GET').then(function(data) {

            sliderMax = Math.round(data.rows[0][5]);

            $("#slider-range").slider("option", "max", sliderMax);
            $("#slider-range").slider("option", "values", [0, sliderMax]);

            $("#dollarsobligated").val("$" + ($("#slider-range").slider("values", 0)).formatMoney(0, '.', ',') + " to $" + ($("#slider-range").slider("values", 1)).formatMoney(0, '.', ','));

          });

        });

      }
    };
  }

})();