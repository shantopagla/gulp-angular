(function() {
  'use strict';

  angular
    .module('angulp1')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController(moment, $location) {
      var vm = this;
      var currentRoute = $location.path().substring(1) || 'home';
      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();

      vm.navClass = function(page) {
          return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
      };
    }
  }

})();
