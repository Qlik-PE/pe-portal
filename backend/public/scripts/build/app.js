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

  app.service('resultHandler', ["notifications", function(notifications){
    this.process = function(result, action){   //deals with the result in a generic way. Return true if the result is a success otherwise returns false
      if(result.redirect || (result[0] && result[0].redirect)){
        window.location = result.redirect || result[0].redirect;
        return false;
      }
      else if (result.errCode || (result[0] && result[0].errCode)) {
        notifications.showError({
          message: result.errText || result[0].errText,
          hideDelay: 3000,
          hide: true
        });
        return false;
      }
      else {
        //if an action has been passed notify the user of it's success
        if(action){
          notifications.showSuccess({message: action + " Successful"});
        }
        return true;
      }
    }
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

  app.controller("validationController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
    var Validations = $resource("api/validations/:validationId", {validationId:"@id"});
    var Steps = $resource("api/steps/:stepId", {stepId:"@stepId"});
    var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});
    var TechnologyTypes = $resource("api/technologytypes/:techtypeId", {techtypeId: "@techtypeId"});

    $scope.permissions = userPermissions;

    console.log($state.current.name);

    if($state.current.name !="validations.new"){
      Validations.query({validationId:$stateParams.Id||""}, function(result){
        if(resultHandler.process(result)){
          $scope.validations = result;
          $scope.imageUploadPath = "/api/validations/"+$stateParams.Id+"/image";
        }
      });
    }

    TechnologyTypes.query({}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.technologytypes = result;
      }
    });

    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.setSteps = function(){
      Steps.query({validationid:$stateParams.Id}, function(stepresult){
        if(resultHandler.process(stepresult)){
          if(stepresult.length > 0){
            resultHandler.process({errCode:true, errText: "Validation already has steps."});
          }
          else{
            for(var i=0;i<$scope.validations[0].technology_type.steps.length;i++){
              var s = $scope.validations[0].technology_type.steps[i];
              s.validationid = $stateParams.Id;
              s.status = "5559a3937730da518d2dc00f";
              Steps.save({}, s, function(result){
                if(i==$scope.validations[0].technology_type.steps.length){
                  resultHandler.process(result, "Steps set ");
                  $scope.save();
                  window.location="#validations/"+$stateParams.Id;
                }
              });
            }
          }
        }
      });
    }

    $scope.delete = function(id){
      //first we need to get the list of steps for the validation
      //then for each step get the issues and delete them
      //then we delete the step and finally delete the validation
      Steps.query({validationid:id}, function(stepresult){
        if(resultHandler.process(stepresult)){
          if(stepresult.length>0){
            for (var i=0;i<stepresult.length;i++){
              var stepId = stepresult[i]._id;       //this variable is used to avoid probelms where i is changed before callbacks are executed
              var isLast = i==stepresult.length-1;  //this variable is used to avoid probelms where i is changed before callbacks are executed
              Issues.delete({stepId: stepId}, function(issueresult){
                if(resultHandler.process(issueresult)){
                  Steps.delete({stepId:stepId}, function(result){
                    if(resultHandler.process(result)){
                      Validations.delete({validationId: id}, function(result){
                        if(resultHandler.process(result, "Delete")){
                          for(var j=0;j<$scope.validations.length;j++){
                            if($scope.validations[j]._id == id){
                              $scope.validations.splice(j,1);
                            }
                          }
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
              if(resultHandler.process(result, "Delete")){
                for(var j=0;j<$scope.validations.length;j++){
                  if($scope.validations[j]._id == id){
                    $scope.validations.splice(j,1);
                  }
                }
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
        if(resultHandler.process(result, "Save")){
          if($state.current.name =="validations.new"){
            window.location = "/#validations/"+result._id;
          }
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

  app.controller("stepController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
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
        if(resultHandler.process(result)){
          $scope.steps = result;
        }
      });
    }
    else if ($state.current.name =="validations.new") {
      //do nothing as we have no steps yet
    }
    else{ //We should be working with an individual step
      Step.query({stepId: $stateParams.stepId}, function(result){
        if(resultHandler.process(result)){
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
        if(resultHandler.process(result)){
          Step.delete({stepId:id}, function(result){
            if(resultHandler.process(result)){
              for(var i=0;i<$scope.steps.length;i++){
                if($scope.steps[i]._id == id){
                  $scope.steps.splice(i,1);
                }
                if($state.current.name.indexOf("detail")!=-1){ //we only redirect if the current view is a detail view
                  window.location = "#validations/"+$stateParams.Id;
                }
              }
            }
          });
        }
      });
    };

    $scope.save = function(id){
      console.log("saving");
      Step.save({stepId:id, validationid: $stateParams.Id}, $scope.getStepById(id), function(result){
        resultHandler.process(result, "Save");
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
        if(resultHandler.process(result, "Create")){
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

  app.controller("issueController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, resultHandler){
    var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
    var IssueStatus = $resource("api/issuestatus/:statusId", {statusId: "@statusId"});
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
    var Validation = $resource("api/validations/:validationId", {validationId: "@validationId"});

    $scope.permissions = userPermissions;

    IssueStatus.query({}, function(result){
      if(resultHandler.process(result)){
        $scope.issueStatus = result;
      }
    });  //this creates a GET query to api/issues/statuses

    if($state.current.name!="issues.new"){
      if($stateParams.stepId){  //We have a validation to work with
        Issue.query({issueId:$stateParams.issueId||"", step:$stateParams.stepId||""}, function(result){
          if(resultHandler.process(result)){
            $scope.issues = result;
          }
        });
      }
      else{ //We should be working with an individual issue
        Issue.query({issueId: $stateParams.issueId}, function(result){
          if(resultHandler.process(result)){
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
        if(resultHandler.process(result, "Delete")){
          for(var i=0;i<$scope.issues.length;i++){
            if($scope.issues[i]._id == id){
              $scope.issues.splice(i,1);
            }
          }
        }
      });
    };

    $scope.save = function(id){
      console.log("saving");
      Issue.save({issueId:id, step: $stateParams.stepId}, $scope.getIssueById(id), function(result){
        resultHandler.process(result, "Save");
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
        if(resultHandler.process(result, "Create")){
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
        }
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
        if(resultHandler.process(result, "Delete")){
          for(var i=0;i<$scope.users.length;i++){
            if($scope.users[i]._id == id){
              $scope.users.splice(i,1);
            }
          }
        }
      });
    };

    $scope.save = function(user){
      console.log("saving");
      User.save({userId:user._id}, user, function(result){
        resultHandler.process(result, "Save");      
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

  app.controller("adminController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, resultHandler){
    var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});
    var TechnologyTypes = $resource("api/technologytypes/:techtypeId", {techtypeId: "@techtypeId"});
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
      "issuestatus",
      "technologytypes"
    ];

    UserRoles.query({}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.roles = result;
        $scope.setRole(0);
      }
    });

    TechnologyTypes.query({}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.technologytypes = result;
      }
    });

    $scope.newTechType = null;

    $scope.activeRole = 0;

    $scope.activeTechType = 0;

    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    };

    $scope.setRole = function(index){
      $scope.activeRole = index;
      $scope.copyRoleName = $scope.roles[$scope.activeRole].name;
    };

    $scope.setTechType = function(index){
      $scope.activeTechType = index;
    };

    $scope.saveRole = function(){
      console.log($scope.roles[$scope.activeRole]);
      UserRoles.save({roleId:$scope.roles[$scope.activeRole]._id}, $scope.roles[$scope.activeRole], function(result){
        resultHandler.process(result, "Save");
      });
    };

    $scope.newRole = function(newrolename){
      var that = this;
      UserRoles.save({}, {name: newrolename}, function(result){
        if(resultHandler.process(result, "Create")){
          $scope.roles.push(result);
          that.newrolename = "";
          $scope.setRole($scope.roles.length -1);
        }
      });
    };

    $scope.copyRole = function(copyrolename){
      var roleToCopy = $scope.roles[$scope.activeRole];
      if(copyrolename==roleToCopy.name){
        copyrolename += " - copy";
      }
      UserRoles.save({}, {name: copyrolename, permissions: roleToCopy.permissions}, function(result){
        if(resultHandler.process(result, "Copy")){
          $scope.roles.push(result);
          $scope.setRole($scope.roles.length -1);
        }
      });
    };

    $scope.newTechType = function(newtechtype){
      var that = this;
      TechnologyTypes.save({},{name: newtechtype}, function(result){
        if(resultHandler.process(result, "Update")){
          $scope.technologytypes.push(result);
          that.newtechtype = "";
          $scope.setTechType($scope.technologytypes.length);
        }
      });
    };

    $scope.newStep = function(stepContent){
      var that = this;
      $scope.technologytypes[$scope.activeTechType].steps.push({
          name: stepContent,
          index: $scope.technologytypes[$scope.activeTechType].steps.length
      });
      TechnologyTypes.save({techtypeId: $scope.technologytypes[$scope.activeTechType]._id }, $scope.technologytypes[$scope.activeTechType], function(result){
         if(resultHandler.process(result, "Update")){
           that.newstepcontent = "";
         }
      });
    };

    $scope.delete = function(index){
      var roleToDelete = $scope.roles[$scope.activeRole];
      UserRoles.delete({roleId: roleToDelete._id}, function(result){
        if(resultHandler.process(result, "Delete")){
          for(var j=0;j<$scope.roles.length;j++){
            if($scope.roles[j]._id == roleToDelete._id){
              $scope.roles.splice(j,1);
              if($scope.activeRole > 0){
                $scope.activeRole--;
                $scope.setRole($scope.activeRole);
              }
            }
          }
        }
      });
    };
  }]);


})();
