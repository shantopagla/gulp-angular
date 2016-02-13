(function() {
  'use strict';

  angular
    .module('angulp1')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
