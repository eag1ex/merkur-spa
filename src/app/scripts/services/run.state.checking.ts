module app.core.stateChecking {
    'use strict';

    export class StateChecking {

        /**
         * we have moved the functionaliti from the on .run to its seperate module, its more clear 
         * of what is happening here.
         * we validate so only existing users with valid token can enter the particular states.
         * existing users is they approved the TC and saved at least first form step will ultimatly be 
         * retidested from welcom to application page.
         */

        /* @ngInject */
        constructor() {

        }

        run(e, toState, state, location) {
       
            /*
            // if not registered,only allow on welcome page
            if (!this.dataservice.GLOBALS.token && toState.name !== "welcome") {
                e.preventDefault();
                state.go('welcome');
                console.info('you are not registered')
            }*/

        }
    }

    angular
        .module('app.core.stateChecking', []);

    angular
        .module('app.core.stateChecking')
        /* @ngInject */
        .service('stateChecking', StateChecking)
}