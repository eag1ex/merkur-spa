
module app.core {
  'use strict';
  angular.module('app.core', []);

  angular
    .module('app.core')
    .config(configure)
    .run(appRun)
    .constant('_', window._)


  /* @ngInject */
  function appRun($rootScope, $timeout, $state, stateChecking, $location) {

    $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {

      // controll page validation and rediraction
      stateChecking.run(e, toState, $state, $location);

    });

    //lodash globaly
    $rootScope._ = window._;
    $rootScope.angularLoader = 0;
    $rootScope.$on("$stateChangeSuccess", () => {
      console.info('Angular Loaded');
    });
  }

  /* @ngInject */
  function configure($stateProvider, $locationProvider, $urlRouterProvider, $qProvider, $httpProvider) {

    $qProvider.errorOnUnhandledRejections(false);
    $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
    $httpProvider.defaults.headers.post['Content-Type'] = 'multipart/form-data; charset=utf-8';

    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/home');

    var states: any[] = getStates();
    states.forEach(function (state) {
      console.log('state> ', state.state)
      $stateProvider.state(state.state, state.config);
    });
  }
  function getStates(): any[] {

    return [
      {
        state: 'home',
        config: {
          url: '/home',
          template: '<home class="col-sm-12 col-md-8 col-lg-8"></home>',
          title: 'Home',
          settings: {
            nav: 1
          },
        }
      }
    ];
  }
}