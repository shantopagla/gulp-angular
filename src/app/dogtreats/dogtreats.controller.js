(function() {
  'use strict';

  angular
    .module('angulp1')
    .controller('dogTreatsController', dogTreatsController);

  /** @ngInject */
  function dogTreatsController() {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1455309723770;
    vm.customerdata=[];
    
    activate();

    function activate() {
     /*
      mockarooData.getCustomerData().then(function(data){
         console.log(data);

      });
      */
    }
  }
})();
