'use strict';
namespace app.home {

  export class MainController {


    /* @ngInject */
    constructor(
      public $scope: any,
      public $element: any,
      public $document: any,
      public $timeout: any,
      public $q: any,
      public $uibModal: any
    ) {


    };

    openFrom() {
      this.openModal()
    }

    openModal() {

      this.$uibModal.open({
        animation: true,
        templateUrl: 'dist/js/modal.form.html',

        controller: function () {

          console.log('modal controller');

        },
        controllerAs: 'vm',

      }).result.then((result) => {

      }, function (reason) {
        console.log('modal failed!', reason)
      });

    }

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
