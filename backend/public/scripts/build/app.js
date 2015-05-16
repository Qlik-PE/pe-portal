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
      });

  }]);

  //Controllers
  app.controller('mainController', ['$scope', function($scope){
    
  }]);

  app.controller('validationController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
    var Validations = $resource('api/validations/:validationId', {validationId:'@id'});

    if($stateParams.id!="new"){
      Validations.query({validationId:$stateParams.id||''}, function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else{
          $scope.validations = result;
        }
      })
    }

    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.delete = function(id){
      console.log('delete me');
    };

    $scope.save = function(){
      Validations.save($scope.validations[0], function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else {
          $scope.validations = result;
        }
        //add notifications & error handling here
      });  //currently we're only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };
  }]);

  app.controller('userController', ['$scope', '$resource', function($scope, $resource){
    //var User = $resource('api/users');

    //User.query();
  }]);

})();
