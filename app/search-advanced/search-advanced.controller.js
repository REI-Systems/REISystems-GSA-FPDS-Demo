(function() {
  'use strict';

  angular
    .module('app.searchadvanced')
    .controller('SearchAdvanced', SearchAdvanced);

  SearchAdvanced.$inject = [];

  function SearchAdvanced() {
    var vm = this;
    
    vm.filters = [
      {
        label: 'Agency',
        type: {
          directive: 'remote-dropdown',
          source: 'agencyid'
        },
        selected: true,
        droppable: true,
        group: 1,
        groupName: "Group 1",
        position: 1
      },
      {
        label: 'Contract Type',
        type: {
          directive: 'remote-dropdown',
          source: 'contractactiontype'
        },
        selected: true,
        droppable: true,
        group: 1,
        groupName: "Group 1",
        position: 2
      },
      {
        label: 'Local Area',
        type: {
          directive: 'remote-dropdown',
          source: 'localareasetaside'
        },
        selected: true,
        droppable: true,
        group: 2,
        groupName: "Group 2",
        position: 3
      }
    ];

    var indexedGroups = [];
    
    vm.allFilters = function(){
      indexedGroups = [];
      return vm.filters;
    }

    vm.filterByGroup = function(filter) {
      var groupIsNew = indexedGroups.indexOf(filter.group) == -1;
      if (groupIsNew) {
        indexedGroups.push(filter.group);
      }
      return groupIsNew;
    }

  }

})();