(function() {
  'use strict';

  angular
    .module('app.data')
    .service('searchService', searchService);

  searchService.$inject = ['apiService'];

  function searchService(apiService) {
    var facetQuery = 'SELECT FIELDNAME, COUNT(FIELDNAME) as count FROM contract GROUP BY FIELDNAME';
    var query = 'SELECT * FROM contract ';

    this.facetQuery = facetQuery;
    this.query = query;

    /**
     * 
     * @param String fieldName
     * @returns {$q@call;defer.promise}
     */
    this.getFieldFacet = function(fieldName) {
      return apiService.call('search', '', { 'sql': facetQuery.replace(new RegExp('FIELDNAME', 'g'), fieldName) }, {}, 'GET');
    };

    /**
     * 
     * @param Array aFieldNames
     * @returns {$q@call;defer.promise}
     */
    this.getFieldsFacet = function(aFieldNames) {
      var aApiParams = [];
      angular.forEach(aFieldNames, function(fieldName) {
        aApiParams.push({
          'method': 'GET',
          'name': 'search',
          'oParams': {
            'sql': facetQuery.replace(new RegExp('FIELDNAME', 'g'), fieldName)
          },
          'oData': {},
          'suffix': ''
        });
      });

      return apiService.calls(aApiParams);
    };

    /**
     * 
     * @param String sql
     * @returns {$q@call;defer.promise}
     */
    this.sqlSearch = function(sql) {
      return apiService.call('search', '', { 'sql': 'SELECT ' + sql + ' FROM contract ' }, {}, 'GET');
    };

    this.sqlSearchAdvanced = function(columns, filter) {
            return apiService.call('search', '', { 'sql': 'SELECT ' + columns + ' FROM contract ' + filter }, {}, 'GET');
          };
  }

})();