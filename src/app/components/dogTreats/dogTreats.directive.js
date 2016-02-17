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
      //Business Logic should go in the Link function as it is first in the $digest tree
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
        watcher(); watcher2();
      });

    }
    /** @ngInject */
    function DogTreatsController($log, mockarooData, underscore) {
      var vm = this; var _ = underscore;
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
              conv_signup: vm.customerdata?_.filter(vm.customerdata, function(d){return ((d.signed_up && (d.signed_up.date)&&(d.purchased_item && (d.purchased_item.date))))}):0,
              conv_profile: vm.customerdata?_.filter(vm.customerdata, function(d){return ((d.signed_up && (d.signed_up.date)&&(d.purchased_item && (d.purchased_item.date))&&(d.viewed_profile && (d.viewed_profile.date))))}):0,
              conv_item: vm.customerdata?_.filter(vm.customerdata, function(d){return ((d.signed_up && (d.signed_up.date)&&(d.purchased_item && (d.purchased_item.date))&&(d.viewed_item && (d.viewed_item.date))))}):0
            }
            // taking out the null values
            vm.stats.viewed_profile = _.filter(vm.stats.viewed_profile, function(d){return (d && d.date)});
            vm.stats.viewed_item = _.filter(vm.stats.viewed_item, function(d){ return (d && d.date)});
            vm.stats.purchased_item = _.filter(vm.stats.purchased_item, function(d){ return (d && d.date)});
            vm.stats.signed_up = _.filter(vm.stats.signed_up, function(d){ return (d && d.date)});
        }
        return vm.stats;
      }

      vm.buildChartData = function(){

        $log.info('Chart Data Build Activated');

        var chartData = _.pluck(vm.customerdata, 'purchased_item');
        var data = [], cData=[], byColorData={undefined:[]}, dateUtc, colorData={undefined:[]};

        // taking out the null values
        chartData = _.filter(chartData, function(d){ return (d && d.date)});

        _.each(chartData, function(d){
          dateUtc = moment(d.date, 'MM/DD/YYYY').valueOf();
          data.push(dateUtc); //for 'all data'
          if (d.color){ //for 'by color' data
            if (!byColorData[d.color])byColorData[d.color]=[];
            if (!colorData[d.color]) colorData[d.color]=[];
            byColorData[d.color].push(dateUtc)
          }
          else byColorData[undefined].push(dateUtc)
        })
        //by color data builder... TODO: REFACTOR!!!
        /*
          byColorData:{'colorName':[]}
        */
        _.each(byColorData, function(colorItems, index){
          byColorData[index] = _.groupBy(byColorData[index], function(dat){ return dat; });
          byColorData[index] = _.sortBy(byColorData[index], function(dat){ return dat[0]; });
        })
        // All Colors with Dates Data
        _.each(byColorData, function(dat, key){
          _.each(dat, function(d, index){
            if (!colorData[key][index]) colorData[key][index]=[];
            colorData[key][index]=[parseInt(d),d.length]
          });
        });
        vm.chartConversionByColorData = [];
        _.each(colorData, function(colorItem, key){
          vm.chartConversionByColorData.push({
            key: key,
            values: colorItem
          })
        })
        // END All Colors with Dates Data
        
        // All Dates Data
        data = _.groupBy(data, function(dat){ return dat; });
        _.each(data, function(dat, index){
          cData.push([parseInt(index),dat.length])
        });
        cData = _.sortBy(cData, function(dat){ return dat[0]; });
        // end All Dates data

        vm.chartConversionData = [{
          key: "Purchased: ",
          values: cData
        }];
        return chartData;
      }

      vm.aggregateCustomerData = function() {
        //adds a row from remote GET request using the service
        $log.info('Add Customer Data clicked')
        return mockarooData.getCustomerData(1).then(function(data) {
          if (data && data.length){
            vm.customerdata.push(data[0]); // data is an array of object(s)
            vm.statsData();
            vm.buildChartData();
          }
          return vm.customerdata;
        });
      }
      vm.chartOptions =  {
          chart: {
              type: 'lineChart',
              height: 350,
              width: 550,
              margin : {
                  top: 20,
                  right: 20,
                  bottom: 65,
                  left: 50
              },
              x: function(d){return d[0];},
              y: function(d){return d[1]},
              showValues: true,
              valueFormat: function(d){
                  return (d);
              },
              duration: 500,
              xAxis: {
                  //axisLabel: 'Date Purchased',
                  tickFormat: function(d) {
                      return d3.time.format('%x')(new Date(d))
                  },
                  rotateLabels: 30,
                  showMaxMin: false
              },
              yAxis: {
                  axisLabel: 'Quantity Purchased',
                  axisLabelDistance: -10,
                  tickFormat: function(d){
                      return (d);
                  }
              }
          }
      };


      function getCustomerData() {
        return mockarooData.getCustomerData(5000).then(function(data) {
          vm.customerdata = data;
          return vm.customerdata;
        });
      }
    }

  }

})();