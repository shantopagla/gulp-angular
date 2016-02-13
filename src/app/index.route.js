(function() {
  'use strict';

  angular
    .module('angulp1')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('about', {
        url: '/about',
        templateUrl: 'app/about/about.html',
        controller: 'AboutController',
        controllerAs: 'about'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/contact/contact.html',
        controller: 'ContactController',
        controllerAs: 'main'
      })
      .state('dogtreats', {
        url: '/dogtreats',
        templateUrl: 'app/dogtreats/dogtreats.html',
        controller: 'dogTreatsController',
        controllerAs: 'dogtreats'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
