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
      });

  }]);

  //Controllers
  app.controller('mainController', ['$scope', function($scope){
    
  }]);

  app.controller('validationController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
    var Validations = $resource('api/validations/:validationId', {validationId:'@id'});

    if($stateParams.id!="new"){
      Validations.query({validationId:$stateParams.id||''}, function(result){
        if(result[0].redirect){
          window.location = result[0].redirect;
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
      var id = $stateParams.id=="new"?"":$stateParams.id;
      Validations.save({validationId:id}, $scope.validations[0], function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else {
          //notify the user that the validation was successfully saved
        }
        //add notifications & error handling here
      });  //currently we're only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.delete = function(){
      console.log('delete me');
    };
  }]);

  app.controller('validationstepController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
    var ValidationStep = $resource('api/validations/:validationId/step/:validationstepId', {validationId:'@id', validationstepId:'@sid'});
    var Step = $resource('api/steps/:stepId', {stepId: '@stepId'});

    Step.query({stepId:'types'}, function(result){
      $scope.stepTypes = result;
    });  //this creates a GET query to api/steps/types

    ValidationStep.query({validationId:$stateParams.id, validationstepId:$stateParams.sid||''}, function(result){
      if(result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.steps = result;
      }
    });


    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.delete = function(id){
      console.log('delete me');
    };

    $scope.save = function(id){
      console.log('saving');
      ValidationStep.save({validationId: $stateParams.id, validationstepId:id}, $scope.getStepById(id), function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else {
          //notify the user that the validation was successfully saved
        }
        //add notifications & error handling here
      });  //currently we're only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.getStepById = function(id){
      for(var i=0;i<$scope.steps.length;i++){
        if($scope.steps[i]._id == id){
          return $scope.steps[i];
        }
      };
    }
  }]);

  app.controller('userController', ['$scope', '$resource', function($scope, $resource){
    //var User = $resource('api/users');

    //User.query();
  }]);

})();
