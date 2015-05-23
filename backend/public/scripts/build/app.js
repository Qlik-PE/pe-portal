(function() {
  var app = angular.module("peportal", ["ui.router", "ngResource"]);

  app.config(["$stateProvider","$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider

      // route for the home page
      .state("home", {
        url: "/",
        templateUrl : "/views/home.html",
        controller  : "mainController"
      })
      // route for the users dashboard page
      .state("dashboard", {
        url: "/dashboard",
        templateUrl : "/views/dashboard.html",
        controller  : "dashboardController"
      })
      // route for the login and signup page
      .state("loginsignup", {
        url: "/loginsignup",
        templateUrl : "/views/loginsignup.html",
        controller  : "authController"
      })
      // route for the login page.
      //used if a session has expired of someone tries to navigate to a page that requires authentication
      .state("login", {
        url: "/login",
        templateUrl : "/views/login.html",
        controller  : "authController"
      })
      // route to manage users
      .state("users", {
        url: "/users",
        templateUrl : "/views/users/list.html",
        controller  : "userController"
      })
      // route to public validations page
      .state("publicvalidations", {
        url: "/public/validations",
        templateUrl: "/views/public/validations/list.html",
        controller: "senseController"
      })
      // route for viewing validations
      .state("validations", {
        url: "/validations",
        templateUrl: "/views/validations/list.html",
        controller: "validationController"
      })
      // route for viewing a specific validation
      .state("validations.detail", {
        url: "/:Id",
        views: {
          "@":{
            templateUrl: "/views/validations/detail.html",
            controller: "validationController"
          }
        }

      })
      // route for viewing a specific validation
      .state("validations.new", {
        url: "/new",
        views: {
          "@":{
            templateUrl: "/views/validations/detail.html",
            controller: "validationController"
          }
        }

      })
      // route for viewing a specific step
      .state("step",{
        url: "/step/:stepId",
        templateUrl: "/views/steps/detail.html",
        controller: "stepController"
      })
      .state("step.issues",{
        url: "/",
        views:{
          "@":{
            templateUrl: "/views/steps/detail.html",
            controller: "stepController",
          }
        }
      })
      .state("issues", {
        url: "/issues/:issueId",
        templateUrl: "/views/issues/detail.html",
        controller: "issueController"
      })
      .state("adminsettings", {
        url: "/admin",
        templateUrl: "/views/admin/index.html",
        controller: "adminController"
      });

  }]);

  //Controllers
  app.controller('mainController', ['$scope', function($scope){
    
  }]);

  app.controller('authController', ['$scope', function($scope){

  }]);

  app.controller('validationController', ['$scope', '$resource', '$state', '$stateParams', function($scope, $resource, $state, $stateParams){
    var Validations = $resource('api/validations/:validationId', {validationId:'@id'});
    var ValidationImages = $resource('api/validations/:validationId/image', {validationId: '@id'});

    console.log($state.current.name);

    if($state.current.name !="validations.new"){
      Validations.query({validationId:$stateParams.Id||''}, function(result){
        if(result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.validations = result;
          $scope.imageUploadPath = "/api/validations/"+$stateParams.Id+"/image";
        }
      })
    }

    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.delete = function(id){
      Validations.delete({validationId:id}, function(result){
        for(var i=0;i<$scope.validations.length;i++){
          if($scope.validations[i]._id == id){
            $scope.validations.splice(i,1);
          }
        }
      });
    };

    $scope.save = function(){
      var id = $stateParams.Id=="new"?"":$stateParams.Id;
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

    $scope.uploadScreenshot = function(){
      // var file = $("#screenshotUpload")[0].files[0];
      // r = new FileReader();
      // r.onloadend = function(e){
      //   var data = new FormData();
      //   data.append('file', e.target.result);
      //   //send you binary data via $http or $resource or do anything else with it
        //ValidationImages.save({validationId:$stateParams.id}, $("#file")[0].files[0], function(result){
        $("#uploadForm")[0].submit(function(event, result){
          event.preventDefault();
          if($scope.validation[0].screenshots){
            $scope.validation[0].screenshots.push(result._id);
          }
          else{
            $scope.validation[0].screenshots = [result._id];
          }
        });
      //}
      //r.readAsBinaryString(file);
    }

    $scope.getPath = function(id){
      return "/api/images/"+id;
    }

  }]);

  app.controller("stepController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});

    Step.query({stepId:"types"}, function(result){
      $scope.stepTypes = result;
    });  //this creates a GET query to api/steps/types

    Step.query({stepId:"status"}, function(result){
      $scope.stepStatus = result;
    });  //this creates a GET query to api/steps/statuses

    if($stateParams.Id){  //We have a validation to work with
      Step.query({stepId:$stateParams.stepId||"", validationid:$stateParams.Id||""}, function(result){
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.steps = result;
        }
      });
    }
    else{ //We should be working with an individual step
      Step.query({stepId: $stateParams.stepId}, function(result){
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.steps = result;
        }
      })
    }

    $scope.activeTab = $state.current.name == "step.issues" ? 1 : 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.delete = function(id){
      Step.delete({stepId:id}, function(result){
        for(var i=0;i<$scope.steps.length;i++){
          if($scope.steps[i]._id == id){
            $scope.steps.splice(i,1);
          }
        }
      });
    };

    $scope.save = function(id){
      console.log("saving");
      Step.save({stepId:id, validationid: $stateParams.Id}, $scope.getStepById(id), function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else {
          //notify the user that the validation was successfully saved
        }
        //add notifications & error handling here
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.new = function(){
      var data = {};
      data.name = $scope.newStepName;
      data.content = $scope.newStepContent;
      data.type = $scope.newStepType;
      data.status = $scope.newStepStatus;
      data.validationid = $stateParams.Id;
      Step.save(data, function(result){
        //need to add error handling
        if($scope.steps){
          $scope.steps.push(result);
        }
        else{
          $scope.steps = [result];
        }
        $scope.newStepName = null;
        $scope.newStepContent = null;
        $scope.newStepType = null;
        $scope.newStepStatus = null;
      });
    }

    $scope.getStepById = function(id){
      for(var i=0;i<$scope.steps.length;i++){
        if($scope.steps[i]._id == id){
          return $scope.steps[i];
        }
      };
    }
  }]);

  app.controller("issueController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
    var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
    var Validation = $resource("api/validations/:validationId", {validationId: "@validationId"});

    Issue.query({issueId:"status"}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.issueStatus = result;
      }
    });  //this creates a GET query to api/issues/statuses

    if($state.current.name!="issues.new"){
      if($stateParams.stepId){  //We have a validation to work with
        Issue.query({issueId:$stateParams.issueId||"", step:$stateParams.stepId||""}, function(result){
          if(result[0] && result[0].redirect){
            window.location = result[0].redirect;
          }
          else{
            $scope.issues = result;
          }
        });
      }
      else{ //We should be working with an individual issue
        Issue.query({issueId: $stateParams.issueId}, function(result){
          if(result[0] && result[0].redirect){
            window.location = result[0].redirect;
          }
          else{
            $scope.issues = result;
            //first get the step, then the validation
            Step.query({stepId: $scope.issues[0].step}, function(step){
              $scope.step = step[0].name;
              Validation.query({validationId: step[0].validationid}, function(validation){
                $scope.validation = validation[0].title;
              });
            })
          }
        })
      }

    }
    else{
      //get a list of validations
    }



    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.delete = function(id){
      Issue.delete({issueId:id}, function(result){
        for(var i=0;i<$scope.issues.length;i++){
          if($scope.issues[i]._id == id){
            $scope.issues.splice(i,1);
          }
        }
      });
    };

    $scope.save = function(id){
      console.log("saving");
      Issue.save({issueId:id, step: $stateParams.stepId}, $scope.getIssueById(id), function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else {
          //notify the user that the validation was successfully saved
        }
        //add notifications & error handling here
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.new = function(){
      var data = {};
      data.name = $scope.newIssueName;
      data.content = $scope.newIssueContent;
      data.status = $scope.newIssueStatus;
      data.step = $stateParams.stepId;
      Issue.save(data, function(result){
        //need to add error handling
        if($scope.issues){
          $scope.issues.push(result);
        }
        else{
          $scope.issues = [result];
        }
        $scope.newIssueName = null;
        $scope.newIssueContent = null;
        $scope.newIssueType = null;
        $scope.newIssueStatus = null;
      });
    }

    $scope.getIssueById = function(id){
      for(var i=0;i<$scope.issues.length;i++){
        if($scope.issues[i]._id == id){
          return $scope.issues[i];
        }
      };
    }
  }]);

  app.controller("userController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
    var User = $resource("api/users/:userId", {userId: "@userId"});

    User.query({userId:"roles"}, function(result){
      $scope.userRoles = result;
    });  //this creates a GET query to api/users/roles


    User.query({userId: $stateParams.userId}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.users = result;
      }
    })

    $scope.delete = function(id){
      console.log("delete me");
    };

    $scope.save = function(user){
      console.log("saving");
      User.save({userId:user._id}, user, function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else {
          //notify the user that the validation was successfully saved
        }
        //add notifications & error handling here
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };
  }]);

  app.controller("dashboardController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
    var Validation = $resource("api/validations/:Id", {validationId: "@Id"});
    var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
    var User = $resource("api/users/:userId", {userId: "@userId"});


    Validation.query({Id:"count"}, function(result){
      $scope.validationCount = result[0];
    });

    User.query({userId:"roles"}, function(result){
      $scope.userRoles = result;
      User.query({userId:'count', role: getUserRoleId('user')}, function(result){   //  /api/users/count
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.pendingUsers = result[0];
        }
      }); //this fetches user that aren't authorised (or in other words 'user' users)
    });


    Issue.query({issueId:"status"}, function(result){
      $scope.issueStatus = result;
      Issue.query({issueId:'count', status: getIssueStatusId('Open')}, function(result){   //  /api/users/count
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.pendingIssues = result[0];
        }
      }); //this fetches user that aren't authorised (or in other words 'user' users)

    });

    function getUserRoleId(name){
      for(var i=0;i<$scope.userRoles.length;i++){
        if($scope.userRoles[i].name == name){
          return $scope.userRoles[i]._id;
        }
      }
    }

    function getIssueStatusId(name){
      for(var i=0;i<$scope.issueStatus.length;i++){
        if($scope.issueStatus[i].name == name){
          return $scope.issueStatus[i]._id;
        }
      }
    }

  }]);

  app.controller('adminController', ['$scope', function($scope){
    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }
  }]);


})();
