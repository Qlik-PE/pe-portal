(function() {
  var app = angular.module("peportal", ["ui.router", "ngResource", "ngNotificationsBar", "ngSanitize"]);

  app.config(["$stateProvider","$urlRouterProvider", "notificationsConfigProvider", function($stateProvider, $urlRouterProvider, notificationsConfigProvider) {
    $urlRouterProvider.otherwise("/");

    notificationsConfigProvider.setAutoHide(true);

    notificationsConfigProvider.setHideDelay(1500);

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
        url: "/issues",
        templateUrl: "/views/issues/list.html",
        controller: "issueController"
      })
      .state("issues.detail", {
        url: "/:issueId",
        templateUrl: "/views/issues/detail.html",
        controller: "issueController"
      })
      .state("adminsettings", {
        url: "/admin",
        templateUrl: "/views/admin/index.html",
        controller: "adminController"
      });

  }]);

  //Services
  app.service('userPermissions', ['$resource', function($resource){
    var System = $resource("system/:path", {path: "@path"});
    this.permissions = {};
    var that = this;
    this.canCreate = function(entity){
      return this.permissions[entity] && this.permissions[entity].create && this.permissions[entity].create==true
    }
    this.canRead = function(entity){
      console.log(entity);
      return this.permissions[entity] && this.permissions[entity].read && this.permissions[entity].read==true
    }
    this.canUpdate = function(entity){
      return this.permissions[entity] && this.permissions[entity].update && this.permissions[entity].update==true
    }
    this.canDelete = function(entity){
      return this.permissions[entity] && this.permissions[entity].delete && this.permissions[entity].delete==true
    }
    this.canSeeAll = function(entity){
      return this.permissions[entity] && this.permissions[entity].allOwners && this.permissions[entity].allOwners==true
    }
    this.refresh = function(){
      System.get({path:'userpermissions'}, function(result){
        that.permissions = result;
      });
    }
    this.refresh();
  }]);


  //Controllers
  app.controller('mainController', ['$scope', function($scope){
    
  }]);

  app.controller('authController', ["$scope", "$resource", "$state", "$stateParams", "userPermissions", function($scope, $resource, $state, $stateParams, userPermissions){

    $scope.partnername = "";
    $scope.partner;
    $scope.partners = [];
    $scope.showSuggestions = false;

    $scope.checkPartner = function(){
        if($scope.partnername.length>1){
          //in this controller we're using a jQuery GET instead of an angular $resource
          //this is because I could not get the regex to parse properly with $resource
          $.get('system/partners', {name: {$regex:$scope.partnername, $options:"gi"}})
          .success(function(data){
            if(data.length>0){
              $scope.$apply(function(){
                $scope.partners = data;
                $scope.showSuggestions = true;
              });
            }
          })
        }
    };

    $scope.hideSuggestions = function(){
      //$scope.$apply(function(){
        $scope.partners = [];
        $scope.showSuggestions = false;
      //});
    };

    $scope.selectPartner = function(partner){
      $scope.partner = partner._id;
      $scope.partners = [];
      $scope.showSuggestions = false;
    };

  }]);

  app.controller("validationController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", function($scope, $resource, $state, $stateParams, userPermissions, notifications){
    var Validations = $resource("api/validations/:validationId", {validationId:"@id"});
    var Steps = $resource("api/steps/:stepId", {stepId:"@stepId"});
    var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});

    $scope.permissions = userPermissions;

    console.log($state.current.name);

    if($state.current.name !="validations.new"){
      Validations.query({validationId:$stateParams.Id||""}, function(result){
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else if(result.errCode){
          notifications.showError({message: result.errText})
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
      //first we need to get the list of steps for the validation
      //then for each step get the issues and delete them
      //then we delete the step and finally delete the validation
      Steps.query({validationid:id}, function(stepresult){
        if(stepresult[0] && stepresult[0].redirect){
          window.location = stepresult[0].redirect;
        }
        else if(stepresult.errCode){
          notifications.showError({message: stepresult.errText})
        }
        else{
          if(stepresult.length>0){
            for (var i=0;i<stepresult.length;i++){
              var stepId = stepresult[i]._id;       //this variable is used to avoid probelms where i is changed before callbacks are executed
              var isLast = i==stepresult.length-1;  //this variable is used to avoid probelms where i is changed before callbacks are executed
              Issues.delete({stepId: stepId}, function(issueresult){
                if(issueresult.errCode){
                  notifications.showError({message: issueresult.errText})
                }
                else{
                  Steps.delete({stepId:stepId}, function(result){
                    if(result.errCode){
                      notifications.showError({message: result.errText})
                    }
                    else if(isLast){
                      Validations.delete({validationId: id}, function(result){
                        if(result.errCode){
                          notifications.showError({message: result.errText})
                        }
                        else{
                          for(var j=0;j<$scope.validations.length;j++){
                            if($scope.validations[j]._id == id){
                              $scope.validations.splice(j,1);
                            }
                          }
                          notifications.showSuccess({message: "Successfully Deleted"});
                          window.location = "#validations";
                        }
                      });
                    }
                  });
                }
              });
            }
          }
          else{
            Validations.delete({validationId: id}, function(result){
              if(result.errCode){
                notifications.showError({message: result.errText})
              }
              else{
                for(var j=0;j<$scope.validations.length;j++){
                  if($scope.validations[j]._id == id){
                    $scope.validations.splice(j,1);
                  }
                }
                notifications.showSuccess({message: "Successfully Deleted"});
                window.location = "#validations";
              }
            });
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
        else if($state.current.name =="validations.new"){
          console.log('saved new');
          window.location = "/#validations/"+result._id;
          notifications.showSuccess({message: "Successfully Saved"});
          //notify the user that the validation was successfully saved
        }
        else if (result.errCode) {
          notifications.showError({message: result.errText});
        }
        else{
          notifications.showSuccess({message: "Successfully Saved"});
        }
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.uploadScreenshot = function(){
      // var file = $("#screenshotUpload")[0].files[0];
      // r = new FileReader();
      // r.onloadend = function(e){
      //   var data = new FormData();
      //   data.append("file", e.target.result);
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

  app.controller("stepController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", function($scope, $resource, $state, $stateParams, userPermissions, notifications){
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
    var StepTypes = $resource("api/steptypes/:typeId", {typeId: "@typeId"});
    var StepStatus = $resource("api/stepstatus/:statusId", {statusId: "@statusId"});
    var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});

    $scope.permissions = userPermissions;

    StepTypes.query({}, function(result){
      $scope.stepTypes = result;
    });  //this creates a GET query to api/steps/types

    StepStatus.query({}, function(result){
      $scope.stepStatus = result;
    });  //this creates a GET query to api/steps/statuses

    if($stateParams.Id && $stateParams.Id!="new"){  //We have a validation to work with
      Step.query({stepId:$stateParams.stepId||"", validationid:$stateParams.Id||""}, function(result){
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.steps = result;
        }
      });
    }
    else if ($state.current.name =="validations.new") {
      //do nothing as we have no steps yet
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
      //First we need to delete all issues related to the step
      Issues.delete({step:id}, function(result){
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else if(result.errCode){
          notifications.showError({message: result.errText})
        }
        else{
          Step.delete({stepId:id}, function(result){
            for(var i=0;i<$scope.steps.length;i++){
              if($scope.steps[i]._id == id){
                $scope.steps.splice(i,1);
              }
              notifications.showSuccess({message: "Successfully Deleted"});
              if($state.current.name.indexOf("detail")!=-1){ //we only redirect if the current view is a detail view
                window.location = "#validations/"+$stateParams.Id;
              }
            }
          });
        }
      });
    };

    $scope.save = function(id){
      console.log("saving");
      Step.save({stepId:id, validationid: $stateParams.Id}, $scope.getStepById(id), function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else if (result.errCode) {
          notifications.showError({
            message: result.errText,
            hideDelay: 3000,
            hide: true
          });
        }
        else {
          //notify the user that the validation was successfully saved
          notifications.showSuccess({message: "Successfully Saved"});
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
        if(result.redirect){
          window.location = result.redirect;
        }
        else if (result.errCode) {
          notifications.showError({
            message: result.errText,
            hideDelay: 3000,
            hide: true
          });
        }
        else {
          //notify the user that the validation was successfully saved
          notifications.showSuccess({message: "Successfully Saved"});
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
        }
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

  app.controller("issueController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", function($scope, $resource, $state, $stateParams, userPermissions){
    var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
    var IssueStatus = $resource("api/issuestatus/:statusId", {statusId: "@statusId"});
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
    var Validation = $resource("api/validations/:validationId", {validationId: "@validationId"});

    $scope.permissions = userPermissions;

    IssueStatus.query({}, function(result){
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

  app.controller("userController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", function($scope, $resource, $state, $stateParams, userPermissions, notifications){
    var User = $resource("api/users/:userId", {userId: "@userId"});
    var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});

    $scope.permissions = userPermissions;

    UserRoles.query({}, function(result){
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
      User.delete({userId:id}, function(result){
        for(var i=0;i<$scope.users.length;i++){
          if($scope.users[i]._id == id){
            $scope.users.splice(i,1);
          }
        }
      });
    };

    $scope.save = function(user){
      console.log("saving");
      User.save({userId:user._id}, user, function(result){
        if(result.redirect){
          window.location = result.redirect;
        }
        else if(result.errCode){
          //notify the user of the error
          notifications.showError({message: result.errText});
        }
        else{
          //notify the user that the validation was successfully saved
          notifications.showSuccess({message: "Successfully Saved"});
        }
        //add notifications & error handling here
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };
  }]);

  app.controller("dashboardController", ["$scope", "$resource", "$state", "$stateParams","userPermissions", "notifications",  function($scope, $resource, $state, $stateParams, userPermissions, notifications){
    var Validation = $resource("api/validations/:Id", {validationId: "@Id"});
    var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
    var IssueStatus = $resource("api/issuestatus/:statusId", {statusId: "@statusId"});
    var User = $resource("api/users/:userId", {userId: "@userId"});
    var UserRoles = $resource("api/userroles/:roleId", {userId: "@roleId"});

    $scope.permissions = userPermissions;

    Validation.query({Id:"count"}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.validationCount = result[0];
      }
    });

    UserRoles.query({}, function(result){
      $scope.userRoles = result;
      User.query({userId:"count", role: getUserRoleId("user")}, function(result){   //  /api/users/count
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.pendingUsers = result[0];
        }
      }); //this fetches user that aren"t authorised (or in other words "user" users)
    });


    IssueStatus.query({}, function(result){
      $scope.issueStatus = result;
      Issue.query({issueId:"count", status: getIssueStatusId("Open")}, function(result){   //  /api/users/count
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.pendingIssues = result[0];
        }
      }); //this fetches user that aren"t authorised (or in other words "user" users)

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

  app.controller("adminController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", function($scope, $resource, $state, $stateParams, userPermissions){
    var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});
    var System = $resource("system/:path", {path: "@path"});
    
    $scope.permissions = userPermissions;
    $scope.collections = [
      "validations",
      "steps",
      "issues",
      "users",
      "userroles",
      "steptypes",
      "stepstatus",
      "issuestatus"
    ];

    UserRoles.query({}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.roles = result;
      }
    });

    $scope.activeRole = 0;

    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.setRole = function(index){
      $scope.activeRole = index;
    }

    $scope.saveRole = function(){
      console.log($scope.roles[$scope.activeRole]);
      UserRoles.save({roleId:$scope.roles[$scope.activeRole]._id}, $scope.roles[$scope.activeRole], function(result){
        console.log('Success');
        $scope.permissions.refresh();
      });
    }
  }]);


})();
