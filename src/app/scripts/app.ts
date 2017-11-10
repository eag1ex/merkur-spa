
//avoid compailer error messages   
declare var angular: any;
declare var _: any;
declare var $: any;
declare interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any;
}
declare interface Window { _: any; }


module app {
  'use strict';
  angular.module('app', [
    // dependant
    'ui.router',
    'ngAnimate',
    'app.validateNumber',
    'ui.bootstrap',
    'app.core.stateChecking',

    //structure
    'app.core',
    'app.layout',

    // states/components
    'app.home',

  ]);
}  