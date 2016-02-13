(function() {
  'use strict';

  angular
    .module('angulp1')
    .directive('dogTreatsData', dogTreats);

  /** @ngInject */
  function dogTreats() {
    var directive = {
      restrict: 'E',
      scope: {
        extraValues: '='
      },
      templateUrl: 'app/components/dogTreats/dogTreats.directive.html',
      //template: '<table></table>',
      link: linkFunc,
      controller: DogTreatsController,
      controllerAs: 'vm'
    };
    return directive;

    function linkFunc(scope, el, attr, vm) {
      var watcher;
      
      vm.gridOptions = {
        enableSorting: true,
        columnDefs: [
          { field: 'first_name', enableColumnMenu: false },
          { field: 'last_name', enableColumnMenu: false },
          { field: 'gender', enableColumnMenu: false },
          { field: 'company_name', enableColumnMenu: false },
          { field: 'job_title', enableColumnMenu: false },
          { field: 'email', enableColumnMenu: false },
          { field: 'id', displayName:'ID', enableColumnMenu: false },
          { field: 'viewed_profile', visible: false },
          { field: 'viewed_item', visible: false },
          { field: 'purchased_item', visible: false },
          { field: 'signed_up', visible: false }
          ]
      };

      el.addClass('dog-treats-data');

      angular.forEach(scope.extraValues, function() {
        //typist.type(value).pause().delete();
      });

      watcher = scope.$watch('vm.customerdata', function(value) {
        if (value){
            vm.gridOptions.data= vm.customerdata;

            vm.chartData={
              dates:[],
              colors:[],
              purchased:{date:null}
            };

            angular.forEach(vm.customerdata, function(evt) {
              // build chart data
              if (evt.signed_up && evt.signed_up.length){
                //aggregate sign-up date
              }
            });
            
        }
      });

      scope.$on('$destroy', function () {
        watcher();
      });

    }
    /** @ngInject */
    function DogTreatsController($log, mockarooData) {
      var vm = this;

      activate();

      function activate() {
        vm.loading=true;
        return getCustomerData().then(function() {
          $log.info('Activated DogTreatsRUs Customerdata Directive');
          vm.loading=false;
        });
      }

      function getCustomerData() {
        return mockarooData.getCustomerData(100).then(function(data) {
          vm.customerdata = data;
          return vm.customerdata;
        });
      }
      function aggregateCustomerData() {
        $log.info('Add Customer Data clicked')
        return mockarooData.getCustomerData(1).then(function(data) {
          if (data && data.length){
            angular.extend(vm.customerdata, data);
          }
          return vm.customerdata;
        });
      }
    }

  }

})();
