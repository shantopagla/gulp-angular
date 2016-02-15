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
      var watcher, watcher2;

      el.addClass('dog-treats-data');

      angular.forEach(scope.extraValues, function() {
        //typist.type(value).pause().delete();
      });

      watcher = scope.$watch(function(){
          //what to watch
          return (vm.customerdata);
        }, function(dataVal) {
          //what to do when 
          if (dataVal && dataVal.length){
            vm.gridOptions.data = vm.customerdata;
            vm.chartData = vm.buildChartData();
            vm.stats = vm.statsData();
          }
      });
      watcher2 = scope.$watch(function(){
          //what to watch
          return (vm.filtertext);
        }, function(dataVal) {
          //what to do when 
          if (dataVal && dataVal.length){
            vm.gridOptions.data = vm.tableGridData();
          } else vm.gridOptions.data = vm.customerdata;
      });

      scope.$on('$destroy', function () {
        watcher();
        watcher2();
      });

    }
    /** @ngInject */
    function DogTreatsController($log, mockarooData) {
      var vm = this;
      vm.gridOptions = {
        enableSorting: true,
        columnDefs: [
          { field: 'first_name', enableColumnMenu: false, enableFiltering:true},
          { field: 'last_name',  enableColumnMenu: false },
          { field: 'gender',  enableColumnMenu: false },
          { field: 'company_name',  enableColumnMenu: false },
          { field: 'job_title',  enableColumnMenu: false },
          { field: 'email',  enableColumnMenu: false },
          { field: 'id', displayName:'ID', enableColumnMenu: false },
          { field: 'viewed_profile', visible: false },
          { field: 'viewed_item', visible: false },
          { field: 'purchased_item', visible: false },
          { field: 'signed_up', visible: false }
          ],
          useExternalFiltering: true,
          filterOptions : {
              filterText: "",
              useExternalFiltering: true
          }
      };

      activate();

      function activate() {
        vm.loading=true;
        return getCustomerData().then(function() {
          $log.info('Activated DogTreatsRUs Customerdata Directive');
          vm.loading=false;
          vm.statsData();
        });
      }

      vm.tableGridData = function(){
        $log.info('Customer Table/Grid data loading');
        var filteredData = [];
        if (vm.filtertext && vm.filtertext.length>0){
          // this section returns the filtered table data used by the Grid
          _.each(vm.customerdata, function(cust){
            if(cust.first_name.toUpperCase().indexOf(vm.filtertext.toUpperCase()) != -1) 
              filteredData.push(cust);
          })
        } else filteredData= vm.customerdata;

        return filteredData;
        //return vm.customerdata;
      }

      vm.statsData = function(){
        $log.info('Customer Stats fired');
        if (vm.customerdata && vm.customerdata.length){
            vm.stats =  {
              total : vm.customerdata?vm.customerdata.length:0,
              females: _.where(vm.customerdata, {gender: "Female"}),
              males: _.where(vm.customerdata, {gender: "Male"}),
              viewed_profile : _.pluck(vm.customerdata, 'viewed_profile'),
              viewed_item : _.pluck(vm.customerdata, 'viewed_item'),
              purchased_item : _.pluck(vm.customerdata, 'purchased_item'),
              signed_up : _.pluck(vm.customerdata, 'signed_up'),
              conv_signup: vm.customerdata?_.filter(vm.customerdata, function(d){return ((d.signed_up && (undefined!==d.signed_up.date)&&(d.purchased_item && (undefined!==d.purchased_item.date))))}):0,
              conv_profile: function(){ return conversionsFromSignup('signup')},
              conv_item: function(){ return conversionsFromSignup('signup')}
            }
            // taking out the null values
            vm.stats.viewed_profile = _.filter(vm.stats.viewed_profile, function(d){return (d && (undefined!==d.date))});
            vm.stats.viewed_item = _.filter(vm.stats.viewed_item, function(d){ return (d && (undefined!==d.date))});
            vm.stats.purchased_item = _.filter(vm.stats.purchased_item, function(d){ return (d && (undefined!==d.date))});
            vm.stats.signed_up = _.filter(vm.stats.signed_up, function(d){ return (d && (undefined!==d.date))});

        }
        function conversionsFromSignup(type){
          if (vm.chartData){
            var purchasedItems = _.filter(vm.chartData.purchased_item, function(d){
              return (d && (undefined!==d.date))
            });
/*
            switch type {
              case 'signup': function(purchasedItems){
                return purchasedItems?purchasedItems.length:0
              };
              case 'profile': function(purchasedItems){

              };
              case 'item': function(purchasedItems){

              };
            }
*/
          }
          return 0;
        }
        return vm.stats;
      }

      vm.buildChartData = function(){

        $log.info('Chart Data Build Activated')
        vm.chartData = {
          viewed_profile : _.pluck(vm.customerdata, 'viewed_profile'),
          viewed_item : _.pluck(vm.customerdata, 'viewed_item'),
          purchased_item : _.pluck(vm.customerdata, 'purchased_item'),
          signed_up : _.pluck(vm.customerdata, 'signed_up')
        }
        // taking out the null values
        vm.chartData.viewed_profile = _.filter(vm.chartData.viewed_profile, function(d){return (d && (undefined!==d.date))});
        vm.chartData.viewed_item = _.filter(vm.chartData.viewed_item, function(d){ return (d && (undefined!==d.date))});
        vm.chartData.purchased_item = _.filter(vm.chartData.purchased_item, function(d){ return (d && (undefined!==d.date))});
        vm.chartData.signed_up = _.filter(vm.chartData.signed_up, function(d){ return (d && (undefined!==d.date))});

        vm.chartData = {
          viewed_profile : _.pluck(vm.chartData.viewed_profile, 'date'),
          viewed_item : _.pluck(vm.chartData.viewed_item, 'date'),
          purchased_item : _.pluck(vm.chartData.purchased_item, 'date'),
          signed_up : _.pluck(vm.chartData.signed_up, 'date')
        }
        /*
        vm.chartData = {
          viewed_profile : _.each(vm.chartData.viewed_profile, function(d){return moment(d.date, 'MM/DD/YYYY')}),
          viewed_item : _.pluck(vm.chartData.viewed_item, 'MM/DD/YYYY'),
          purchased_item : _.pluck(vm.chartData.purchased_item, 'MM/DD/YYYY'),
          signed_up : _.pluck(vm.chartData.signed_up, 'MM/DD/YYYY')
        }
        */
        return vm.chartData;
      }

      vm.aggregateCustomerData = function() {
        //adds a row from remote GET request using the service
        $log.info('Add Customer Data clicked')
        return mockarooData.getCustomerData(1).then(function(data) {
          if (data && data.length){
            vm.customerdata.push(data[0]); // data is an array of object(s)
            vm.buildChartData();
            vm.statsData();
          }
          return vm.customerdata;
        });
      }

      function getCustomerData() {
        return mockarooData.getCustomerData(5).then(function(data) {
          vm.customerdata = data;
          return vm.customerdata;
        });
      }
    }

  }

})();