'use strict';
namespace app.home {

  export class MainController {


    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      public $document: any,
      public $timeout: any,
      public $q: any
    ) { };


  }

  class MainComponent {
    constructor() { }
    restrict = 'E';
    controllerAs = 'vm';
    templateUrl = 'dist/js/app.home.html';
    controller = MainController;
  }

  angular
    .module('app.home', []);

  angular
    .module('app.home').component('home', new MainComponent());
}
