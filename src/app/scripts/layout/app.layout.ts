module app.layout {
  'use strict';

  export class LayoutController {


    /* @ngInject */
    constructor(public $rootScope: any, private $timeout: any, public $scope: any) {

    
    }
  }
  angular
    .module('app.layout', []);

  angular
    .module('app.layout')
    .controller('layoutController', LayoutController);
}
