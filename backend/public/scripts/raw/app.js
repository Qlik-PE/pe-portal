(function() {
  var app = angular.module('peportal', ['ui.router', 'ngResource']);

  app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider

      // route for the home page
      .state('home', {
        url: '/',
        templateUrl : '/views/home.html',
        controller  : 'mainController'
      })
      // route for the certs page
      .state('validations', {
        url: '/validations',
        templateUrl : '/views/validations.html',
        controller  : 'validationController'
      })
      // route for the login and signup page
      .state('loginsignup', {
        url: '/loginsignup',
        templateUrl : '/views/loginsignup.html',
        controller  : 'userController'
      })
      // route for the login page.
      //used if a session has expired of someone tries to navigate to a page that requires authentication
      .state('login', {
        url: '/login',
        templateUrl : '/views/login.html',
        controller  : 'userController'
      })
      // route for viewing 'my' validations
      .state('myvalidations', {
        url: '/myvalidations',
        templateUrl: '/views/validations/list.html',
        controller: 'validationController'
      })
      // route for viewing a specific validation
      .state('validation', {
        url: '/myvalidations/:id',
        templateUrl: '/views/validations/detail.html',
        controller: 'validationController'
      })
      // route for viewing a specific step
      .state('validationstep',{
        url: '/myvalidations/:vid/step/:sid',
        templateUrl: '/views/validationstep/detail.html',
        controller: 'validationstepController'
      })
      .state('issues', {
        url: '/issues/:vid/step/:sid/issue',
        templateUrl: '/views/issues/list.html',
        controller: 'issueController'
      });

  }]);

  //Controllers
  include "./controllers/main.js"
  include "./controllers/validations.js"
  include "./controllers/validation-step.js"
  include "./controllers/user.js"
})();
