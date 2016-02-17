(function() {
  'use strict';

  angular
    .module('angulp1')
    .controller('dogTreatsController', dogTreatsController);

  /** @ngInject */
  function dogTreatsController($log) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1455309723770;
    
    activate();

    function activate() {
      $log.info('dogTreatsController activated')
     /*
      mockarooData.getCustomerData().then(function(data){
         console.log(data);

      });
      */
    }
  }
})();
