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
        controller  : "dashboardController",
        data:{
          crumb: "Dashboard",
          link: "#dashboard"
        }
      })
      // route for the login and signup page
      .state("loginsignup", {
        url: "/loginsignup",
        templateUrl : "/views/loginsignup.html",
        controller  : "authController",
        data:{
          crumb: "Login & Signup",
          link: "#loginsignup"
        }
      })
      // route for the login page.
      //used if a session has expired of someone tries to navigate to a page that requires authentication
      .state("login", {
        url: "/login",
        templateUrl : "/views/login.html",
        controller  : "authController",
        data:{
          crumb: "Login",
          link: "#login"
        }
      })
      // route for forgot password page.
      .state("forgot", {
        url: "/forgot",
        templateUrl : "/views/forgot.html",
        controller  : "authController",
        data:{
          crumb: "Forgot Password",
          link: "#forgot"
        }
      })
      // route for once a 'forgot password' email has been sent.
      .state("forgotsent", {
        url: "/forgotsent?email",
        templateUrl : "/views/forgot.html",
        controller  : "authController",
        data:{
          crumb: "Forgot Password",
          link: "#forgot"
        }
      })
      // route for resetting a password.
      .state("reset", {
        url: "/resetpassword?token",
        templateUrl : "/views/passwordreset.html",
        controller  : "authController",
        data:{
          crumb: "Reset Password",
          link: "#reset"
        }
      })
      // route to manage users
      .state("users", {
        url: "/users",
        templateUrl : "/views/users/list.html",
        controller  : "userController",
        data:{
          crumb: "Users",
          link: "#users"
        }
      })
      // route to public validations page
      .state("publicvalidations", {
        url: "/public/validations",
        templateUrl: "/views/public/validations/index.html",
        controller: "senseController",
        data:{
          crumb: "Validations",
          link: "#publicvalidations"
        }
      })
      // route for viewing validations
      .state("validations", {
        url: "/validations",
        templateUrl: "/views/validations/list.html",
        controller: "validationController",
        data:{
          crumb: "Validations",
          link: "#validations"
        }
      })
      // route for viewing a specific validation
      .state("validations.detail", {
        url: "/:Id",
        views: {
          "@":{
            templateUrl: "/views/validations/detail.html",
            controller: "validationController"
          }
        },
        data:{
          crumb: "New Validation",
          link: "#validations/new"
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
        },
        data:{
          crumb: "New Validation",
          link: "#validations.new"
        }

      })
      // route for viewing a specific step
      .state("step",{
        url: "/step/:stepId",
        templateUrl: "/views/steps/detail.html",
        controller: "stepController",
        data:{
          crumb: "Validations",
          link: "#validations"
        }
      })
      .state("step.issues",{
        url: "/",
        views:{
          "@":{
            templateUrl: "/views/steps/detail.html",
            controller: "stepController",
          }
        },
        data:{
          crumb: "Validations",
          link: "#validations"
        }
      })
      .state("issuesold", {
        url: "/issues",
        templateUrl: "/views/issues/list.html",
        controller: "issueController",
        data:{
          crumb: "Issues",
          link: "#issues"
        }
      })
      .state("issues", {
        url: "/issues/:issueId",
        templateUrl: "/views/issues/detail.html",
        controller: "issueController",
        data:{
          crumb: "Validations",
          link: "#validations"
        }
      })
      .state("adminsettings", {
        url: "/admin",
        templateUrl: "/views/admin/index.html",
        controller: "adminController",
        data:{
          crumb: "Admin Settings",
          link: "#adminsettings"
        }
      });

  }]);
  //Services
  app.service("userPermissions", ["$resource", "resultHandler", function($resource, resultHandler){
    var System = $resource("system/:path", {path: "@path"});
    this.permissions = {};
    this.menu = {};
    var that = this;
    this.canCreate = function(entity){
      return this.permissions[entity] && this.permissions[entity].create && this.permissions[entity].create==true
    }
    this.canRead = function(entity){
      return this.permissions[entity] && this.permissions[entity].read && this.permissions[entity].read==true
    }
    this.canUpdate = function(entity){
      return this.permissions[entity] && this.permissions[entity].update && this.permissions[entity].update==true
    }
    this.canDelete = function(entity){
      return this.permissions[entity] && this.permissions[entity].delete && this.permissions[entity].delete==true
    }
    this.canReport = function(entity){
      return this.permissions[entity] && this.permissions[entity].report && this.permissions[entity].report==true
    }
    this.canSeeAll = function(entity){
      return this.permissions[entity] && this.permissions[entity].allOwners && this.permissions[entity].allOwners==true
    }
    this.refresh = function(){
      System.get({path:"userpermissions"}, function(result){
        if(resultHandler.process(result)){
          that.permissions = result.user.role.permissions;
          that.role = result.user.role.name;
          that.menu = result.menu;
        }
      });
    }
    this.refresh();
  }]);

  app.service("resultHandler", ["notifications", function(notifications){
    this.process = function(result, action){   //deals with the result in a generic way. Return true if the result is a success otherwise returns false
      if(result.redirect){
        window.location = result.redirect;
        return false;
      }
      else if (result.errCode) {
        notifications.showError({
          message: result.errText,
          hideDelay: 10000,
          hide: true
        });
        return false;
      }
      else {
        //if an action has been passed notify the user of it"s success
        if(action){
          notifications.showSuccess({message: action + " Successful"});
        }
        return true;
      }
    }
  }]);


  //Directives
  app.directive('gallery', function(){
    return {
      restrict: "E",
      replace: true,
      scope: {
        images: "="
      },
      link: function($scope, element, attr){
        $scope.activeImage;
        $scope.isModal = false;
        $scope.showModal = function(index){
          $scope.activeImage = index;
          $scope.setSize();
          $scope.isModal = true;
        };
        $scope.setSize = function(){
          var width = $scope.images[$scope.activeImage].width, height = $scope.images[$scope.activeImage].height;
          if(height > width && height > 600){
            var ratio = height / width;
            height = 600;
            width = 600 / ratio;
          }
          else if(width > height && width > 960){
            var ratio = width / height;
            width = 960;
            height = 960 / ratio;
          }
          $(".modal-image").css({
            "height": (height+20) + "px",
            "width": (width+20) + "px"
          });
          $(".modal-image img").css({
            "height": (height) + "px",
            "width": (width) + "px"
          });
        }
        $scope.prev = function(){
          if($scope.activeImage==0){
            $scope.activeImage=$scope.images.length-1;
          }
          else{
            $scope.activeImage--;
          }
          $scope.setSize();
        };
        $scope.next = function(){
          if($scope.activeImage==$scope.images.length-1){
            $scope.activeImage=0;
          }
          else{
            $scope.activeImage++;
          }
          $scope.setSize();
        };
        $scope.close = function(){
          $scope.activeImage=null;
          $scope.isModal = false;
        }
      },
      templateUrl: "/views/gallery.html"
    }
  });

  app.directive('report', ["$resource", "resultHandler", function($resource, resultHandler){
    return {
      restrict: "E",
      replace: true,
      scope: {

      },
      link: function($scope, element, attr){
        $scope.entity;
        $scope.report;

        $scope.$on("showReportDialog", function(event, params){
          $scope.entity = params.entity;
          $scope.id = params.id;
          var Reports = $resource("/api/"+params.entity+"/reports");
          var Entity = $resource("/api/"+params.entity+"/:entityId", {entityId:"@entityId"});
          Reports.get({}, function(result){
            if(resultHandler.process(result)){
              $scope.reports = result.data;
            }
          });
          Entity.get({entityId: params.id}, function(result){
            if(resultHandler.process(result)){
              $scope.info = result.data[0];
            }
          });
          $scope.isModal = true;
        });
        $scope.info, $scope.reports;
        $scope.getReportTemplate = function(entity, report){
          return '/views/reports/'+entity+'/'+report;
        };
        $scope.print = function(entity, id) {
          var html = $(".report-print").html();
          //$.get('/print/'+$scope.report+'/'+entity+'/'+id)
          $.post('/print', {data: html})
          .success(function(data){
            window.open(data.file);
          })
        }
        $scope.isModal = false;
        $scope.close = function(){
          $scope.activeImage=null;
          $scope.isModal = false;
        }
      },
      templateUrl: "/views/report.html"
    }
  }]);

  app.directive('breadcrumbs', ['$state', '$interpolate', function ($state, $interpolate) {
    return {
      restrict: "E",
      replace: true,
      scope:{

      },
      templateUrl: function(element, attr){
        return 'views/breadcrumbs.html'
      },
      link: function(scope){
        scope.breadcrumbs;
        scope.$on('$stateChangeSuccess', function() {
          scope.activeItem = $state.current.name.split(".")[0];
          scope.breadcrumbs = [];
          var state = $state.$current;
          if(state.self.name != "home"){
            while(state.self.name != ""){
              console.log(state);
              scope.breadcrumbs.push({
                text: state.data.crumb,
                link: state.data.link
              });
              state = state.parent;
            }
            scope.breadcrumbs.push({text: "Home", link: "/"});
          }
          scope.breadcrumbs.reverse();
        });
        scope.$on('spliceCrumb', function(event, crumb){
          scope.breadcrumbs.splice(-1, 1, crumb);
        });
        scope.$on('pushCrumb', function(event, crumb){
          scope.breadcrumbs.push(crumb);
        });
      }
    }
  }]);

  app.directive('header', ['userPermissions', '$state', '$interpolate', function (userPermissions, $state, $interpolate) {
    return {
      restrict: "E",
      replace: true,
      scope:{

      },
      templateUrl: "/views/header.html",
      link: function(scope){
        scope.userPermissions = userPermissions;
      }
    }
  }]);


  //Controllers
  app.controller("mainController", ["$scope", function($scope){
    
  }]);

  app.controller("authController", ["$scope", "$resource", "$state", "$stateParams", "resultHandler", "userPermissions", function($scope, $resource, $state, $stateParams, resultHandler, userPermissions){
    var SignUp = $resource("/auth/signup");
    var Login = $resource("/auth/login");
    var Forgot = $resource("/auth/forgot");
    var UnknownUser = $resource("/auth/reset/:token", {token:"@token"});

    $scope.userPermissions = userPermissions;

    $scope.partnername = "";
    $scope.partner;
    $scope.partners = [];
    $scope.showSuggestions = false;
    $scope.currentState = $state.current.name;
    $scope.$on('$stateChangeSuccess', function() {
      $scope.currentState = $state.current.name;
      console.log($scope.currentState);
    });

    if($scope.currentState=="reset"){
      $scope.resetToken = $stateParams.token;
      UnknownUser.get({token: $scope.resetToken}, function(result){
        if(resultHandler.process(result)){
          $scope.userid = result.id;
        }
      });
    }

    $scope.checkPartner = function(){
        if($scope.partnername.length>1){
          //in this controller we"re using a jQuery GET instead of an angular $resource
          //this is because I could not get the regex to parse properly with $resource
          $.get("system/partners", {name: {$regex:$scope.partnername, $options:"gi"}})
          .success(function(result){
            if(resultHandler.process(result)){
              if(result.data.length>0){
                $scope.$apply(function(){
                  $scope.partners = result.data;
                  $scope.showSuggestions = true;
                });
              }
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
      $scope.partnername = partner.name;
      $scope.partners = [];
      $scope.showSuggestions = false;
    };

    $scope.signup = function(){
      var user = {
        partner: $scope.partner,
        partnername: $scope.partnername,
        name: $scope.name,
        email: $scope.email,
        password: $scope.password
      };
      SignUp.save({}, user, function(result){
        if(resultHandler.process(result, "Registration")){
          window.location = "#login";
        }
      });
    };

    $scope.login = function(){
      Login.save({
        email: $scope.loginemail,
        password: $scope.loginpassword
      }, function(result){
        if(resultHandler.process(result)){
          userPermissions.refresh();
          window.location = "#dashboard";
        }
      });
    };


    $scope.forgot = function(){
      Forgot.save({email: $scope.email}, function(result){
        if(resultHandler.process(result)){

        }
      });
    };

    $scope.resetPassword = function(){
      UnknownUser.save({id: $scope.userid, password: $scope.password}, function(result){
        if(resultHandler.process(result, "Password reset")){

        }
      });
    };

  }]);

  app.controller("validationController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
    var Validations = $resource("api/validations/:validationId", {validationId:"@id"});
    var Steps = $resource("api/steps/:stepId", {stepId:"@stepId"});
    var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});
    var TechnologyTypes = $resource("api/technologytypes/:techtypeId", {techtypeId: "@techtypeId"});

    $scope.permissions = userPermissions;
    $scope.validationId = $stateParams.Id;
    if($stateParams.Id !="new"){
      Validations.get({validationId:$stateParams.Id||""}, function(result){
        if(resultHandler.process(result)){
          $scope.validations = result.data.length>0?result.data:[{}];
          $scope.imageUploadPath = "/api/validations/"+$stateParams.Id+"/image";
          if($state.current.name == "validations.detail"){
            $scope.$root.$broadcast('spliceCrumb', {
              text: $scope.validations[0].title,
              link: "/validations/"+$scope.validations[0]._id
            });
          }
        }
      });
    }

    $scope.$watchCollection("validations[0]" ,function(n, o){
      if($scope.saveTimeout){
        clearTimeout($scope.saveTimeout);
      }
      $scope.saveTimeout = setTimeout(function(){
        if(n){
          $scope.save(n._id||"");
        }
      }, 600);
    });

    TechnologyTypes.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.technologytypes = result.data;
      }
    });

    $scope.activeTab = 0;

    $scope.setTab = function(index){
      $scope.activeTab = index;
    }

    $scope.setSteps = function(){
      Steps.get({validationid:$stateParams.Id}, function(stepresult){
        if(resultHandler.process(stepresult)){
          if(stepresult.data.length > 0){
            resultHandler.process({errCode:true, errText: "Validation already has steps."});
          }
          else{
            $scope.$broadcast("techTypeChanged",$scope.validations[0].technology_type._id );
            $scope.save($scope.validations[0]._id);
            $scope.setTab(1);
          }
        }
      });
    }

    $scope.delete = function(id){
      //first we need to get the list of steps for the validation
      //then for each step get the issues and delete them
      //then we delete the step and finally delete the validation
      Steps.get({validationid:id}, function(stepresult){
        if(resultHandler.process(stepresult)){
          if(stepresult.data.length>0){
            function deleteIssuesAndStep(stepIndex){
              var stepId = stepresult.data[stepIndex]._id;
              Issues.delete({stepId: stepId}, function(issueresult){
                if(resultHandler.process(issueresult)){
                  //delete the step
                  Steps.delete({stepId:stepId}, function(result){
                    if(resultHandler.process(result)){
                      if(stepIndex==stepresult.data.length-1){
                        //delete the validation
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
                      else{
                        //delete the next step and issues
                        stepIndex++;
                        deleteIssuesAndStep(stepIndex);
                      }
                    }
                  });
                }
              });
            }

            deleteIssuesAndStep(0);
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

    $scope.save = function(id){
      //var id = $stateParams.Id=="new"?"":$stateParams.Id;
      Validations.save({validationId:id}, $scope.validations[0], function(result){
        if(resultHandler.process(result, "Save")){
          if($stateParams.Id == "new"){
            window.location = "/#validations/"+result._id;
          }
        }
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.validate = function(){
      var id = $stateParams.Id=="new"?"":$stateParams.Id;
      $scope.validations[0].status = "Validated";
      Validations.save({validationId:id}, $scope.validations[0], function(result){
        if(resultHandler.process(result, "Save")){
          if($state.current.name =="validations.new"){
            window.location = "/#validations/"+result._id;
          }
        }
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.unvalidate = function(){
      var id = $stateParams.Id=="new"?"":$stateParams.Id;
      $scope.validations[0].status = "Pending";
      Validations.save({validationId:id}, $scope.validations[0], function(result){
        if(resultHandler.process(result, "Save")){
          if($state.current.name =="validations.new"){
            window.location = "/#validations/"+result._id;
          }
        }
      });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
    };

    $scope.disableEditing = function(){
      var canUpdate = $scope.permissions.canUpdate('validations');
      var isNew = $stateParams.Id == 'new';
      return ((!canUpdate && !isNew) || isNew);
    };

    $scope.report = function(id, entity){
      $scope.$root.$broadcast("showReportDialog", {id:id, entity: entity});
    };

  }]);

  app.controller("stepController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
    var Validation = $resource("api/validations/");
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
    var StepTemplate = $resource("api/templatesteps/:stepId", {stepId: "@stepId"});
    var StepTypes = $resource("api/steptypes/:typeId", {typeId: "@typeId"});
    var StepStatus = $resource("api/stepstatus/:statusId", {statusId: "@statusId"});
    var StatusHistory = $resource("api/statushistory/:historyId", {historyId: "@historyId"});
    var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});
    var Screenshots = $resource("api/attachments/:attachmentId", {attachmentId:"@attachmentId"});
    var SaveScreenshots = $resource("attachments/:attachmentId", {attachmentId:"@attachmentId"});

    $scope.permissions = userPermissions;
    $scope.screenshots = [];
    $scope.step;
    $scope.validation;
    $scope.saveTimeout;

    StepTypes.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.stepTypes = result.data;
      }
    });

    StepStatus.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.stepStatus = result.data;
      }
    });

    if($stateParams.Id && $stateParams.Id!="new"){  //We have a validation to work with
      Step.get({stepId:$stateParams.stepId||"", validationid:$stateParams.Id||""}, function(result){
        if(resultHandler.process(result)){
          $scope.steps = result.data;
          $scope.$watch("steps" ,function(n, o){
            for(var i=0;i<o.length;i++){
              if(o[i].status._id != n[i].status._id){
                StatusHistory.save({},{
                  entityId: $scope.steps[0]._id,
                  oldStatus: o[i].status.name,
                  newStatus: n[i].status.name
                }, function(result){
                  resultHandler.process(result);
                });
              }
            }
          }, true);
        }
      });
    }
    else if ($state.current.name =="validations.detail" && $stateParams.Id=="new") {
      //do nothing as we have no steps yet
    }
    else{ //We should be working with an individual step
      Step.get({stepId: $stateParams.stepId}, function(result){
        if(resultHandler.process(result)){
          $scope.steps = result.data;
          //set the breadcrumb
          Validation.get({_id: $scope.steps[0].validationid}, function(result){
            if(resultHandler.process(result)){
              if($state.current.name == "step"){
                $scope.$root.$broadcast('pushCrumb', {
                  text: result.data[0].title,
                  link: "/validations/"+result.data[0]._id
                });
                $scope.$root.$broadcast('pushCrumb', {
                  text: $scope.steps[0].name,
                  link: "/steps/"+$scope.steps[0]._id
                });
              }
              else if ($state.current.name == "step.issues") {
                $scope.$root.$broadcast('spliceCrumb', {
                  text: result.data[0].title,
                  link: "/validations/"+result.data[0]._id
                });
                $scope.$root.$broadcast('pushCrumb', {
                  text: $scope.steps[0].name,
                  link: "/steps/"+$scope.steps[0]._id
                });
              }
            }
          });
          StatusHistory.get({entityId: $scope.steps[0]._id}, function(result){
            if(resultHandler.process(result)){
              $scope.stepStatusHistory = result.data;
            }
          });
          $scope.$watchCollection("steps[0]" ,function(n, o){
            //because this is fired for any change we'll implement a timeout to prevent saving too many times while a user is typing
            if($scope.saveTimeout){
              clearTimeout($scope.saveTimeout);
            }
            $scope.saveTimeout = setTimeout(function(){
              $scope.save($scope.steps[0]._id);
              if(o.status != n.status){
                //we need to add a record to the status history table
                StatusHistory.save({},{
                  entityId: $scope.steps[0]._id,
                  oldStatus: o.status.name,
                  newStatus: n.status.name
                }, function(result){
                  if(resultHandler.process(result)){
                    if($scope.stepStatusHistory){
                      $scope.stepStatusHistory.splice(0,0,result);
                    }
                    else{
                      $scope.stepStatusHistory = [result];
                    }
                  }
                });
              }
            }, 600);

          });
        }
      })
    }

    $scope.$on("techTypeChanged", function(event, techTypeId){
      StepTemplate.get({techtypeId: techTypeId}, function(result){
        if(resultHandler.process(result)){
          for(var i=0;i<result.data.length;i++){
            var s = result.data[i];
            s._id = null;
            s.techtypeId = null;
            s.validationid = $stateParams.Id;
            s.status = "5559a3937730da518d2dc00f";
            Step.save({}, s, function(stepresult){
              if(i==result.data.length){
                resultHandler.process(stepresult, "Setting steps ");
                $scope.steps = result.data;
              }
            });
          }
        }
      });
    });


    $scope.setTab = function(index){
      $scope.activeTab = index;
      if(index==2 && $scope.screenshots.length == 0){
        //now fetch the screenshots for the current step
        Screenshots.get({entityId: $scope.steps[0]._id}, function(result){
          if(resultHandler.process(result)){
            $scope.screenshots = result.data;
          }
        });
      }
    }

    if($state.current.name == "step.issues"){
      $scope.setTab(1);
    }
    else{
      $scope.setTab(0);
    }

    $scope.delete = function(id){
      //First we need to delete all issues related to the step
      Issues.delete({step:id}, function(result){
        if(resultHandler.process(result)){
          Step.delete({stepId:id}, function(result){
            if(resultHandler.process(result, "Delete")){
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
    };

    $scope.getStepById = function(id){
      for(var i=0;i<$scope.steps.length;i++){
        if($scope.steps[i]._id == id){
          return $scope.steps[i];
        }
      };
    };

    $(document).on('submit', "#newScreenshotForm", function(event){
      event.preventDefault();
      $.ajax({
        url:'/attachments',
        data: $(this).serialize(),
        success: function(data){
          console.log(data);
        }
      });
    });

    $scope.uploadScreenshot = function(a, b, c){
      var file = $("#file")[0].files[0];
      var r = new FileReader();
      r.onloadend = function(event){
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var image = r.result;

        var thumbnail = new Image();
        thumbnail.onload = function() {
          var width = thumbnail.width;
          var height = thumbnail.height;
          context.drawImage(thumbnail, 0, 0, thumbnail.width * (200/thumbnail.height), 200);
          var data = {
            entityId: $scope.steps[0]._id,
            image: image,
            thumbnail: canvas.toDataURL(),
            width: width,
            height: height
          };
          Screenshots.save(data, function(result){
            if(resultHandler.process(result, "Image Upload")){

            }
          });
        };
        thumbnail.src = r.result;
      }
      r.readAsDataURL(file);
    };

    $scope.getScreenshot = function(content){
      return "data:image/png;base64,"+btoa(content.data);
      var buffer = _arrayBufferToBase64(content.data);
      return buffer;
    };

    $scope.getScreenshotPath = function(id){
      return "/attachments/"+id;
    };

    $scope.openLightboxModal = function (index) {
      Lightbox.openModal($scope.screenshots, index);
    };

    $scope.$on('issueCreated', function(event, params){
      if($scope.steps[0]){
        if($scope.steps[0].issues){
          $scope.steps[0].issues.push(params.issueId);
        }
        else{
          $scope.steps[0].issues = [params.issueId];
        }
        Step.save({stepId: params.stepId}, $scope.steps[0], function(result){
          resultHandler.process(result);
        });
      }
      else{
        Step.get({stepId: params.stepId}, function(result){
          if(resultHandler.process(result)){
            if(result.data[0]){
              if(result.data[0].issues){
                result.data[0].issues.push(params.issueId);
              }
              else{
                result.data[0].issues = [params.issueId];
              }
              Step.save({stepId: params.stepId}, result.data[0], function(result){
                resultHandler.process(result);
              });
            }
          }
        })
      }
    });

    $scope.$on('issueDeleted', function(event, params){
      // for(var i=0;i<$scope.issues.length;i++){
      //   if($scope.issues[i]._id == id){
      //     $scope.issues.splice(i,1);
      //   }
      // }
      if($scope.steps[0]){
        for(var i=0;i<$scope.steps[0].issues.length;i++){
          if($scope.steps[0].issues[i]._id == id){
            $scope.steps[0].issues.splice(i,1);
          }
        }
        Step.save({stepId: params.stepId}, $scope.steps[0], function(result){
          resultHandler.process(result);
        });
      }
      else{
        Step.get({stepId: params.stepId}, function(result){
          if(resultHandler.process(result)){
            if(result.data[0]){
              for(var i=0;i<$scope.steps[0].issues.length;i++){
                if($scope.steps[0].issues[i]._id == id){
                  $scope.steps[0].issues.splice(i,1);
                }
              }
              Step.save({stepId: params.stepId}, result.data[0], function(result){
                resultHandler.process(result);
              });
            }
          }
        })
      }
    });

    function _arrayBufferToBase64( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return binary ;
    }
  }]);

  app.controller("issueController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, resultHandler){
    var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
    var IssueStatus = $resource("api/issuestatus/:statusId", {statusId: "@statusId"});
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
    var Validation = $resource("api/validations/:validationId", {validationId: "@validationId"});

    $scope.permissions = userPermissions;

    IssueStatus.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.issueStatus = result.data;
      }
    });  //this creates a GET query to api/issues/statuses

    if($state.current.name!="issues.new"){
      if($stateParams.stepId){  //We have a step to work with
        Issue.get({issueId:$stateParams.issueId||"", step:$stateParams.stepId||""}, function(result){
          if(resultHandler.process(result)){
            $scope.issues = result.data;
          }
        });
      }
      else{ //We should be working with an individual issue
        Issue.get({issueId: $stateParams.issueId}, function(result){
          if(resultHandler.process(result)){
            $scope.issues = result.data;
            //first get the step, then the validation
            Step.get({stepId: $scope.issues[0].step}, function(step){
              $scope.step = step.data[0];
              Validation.get({validationId: step.data[0].validationid}, function(validation){
                $scope.validation = validation.data[0].title;
                $scope.$root.$broadcast('pushCrumb', {
                  text: validation.data[0].title,
                  link: "/validations/"+validation.data[0]._id
                });
                $scope.$root.$broadcast('pushCrumb', {
                  text: $scope.step.name,
                  link: "/step/"+$scope.step._id
                });
                $scope.$root.$broadcast('pushCrumb', {
                  text: $scope.issues[0].name,
                  link: "/issues/"+$scope.issues[0]._id
                });
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
              var stepId = $stateParams.stepId || $scope.step._id;
              $scope.$root.$broadcast('issueDeleted', {issueId: id, stepId: stepId});
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
          var stepId = $stateParams.stepId || $scope.step._id;
          //update the step issue count
          $scope.$root.$broadcast('issueCreated', {issueId: result._id, stepId: stepId});
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

  app.controller("userController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
    var User = $resource("api/users/:userId", {userId: "@userId"});
    var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});

    $scope.permissions = userPermissions;

    UserRoles.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.userRoles = result.data;
      }
    });

    User.get({userId: $stateParams.userId}, function(result){
      if(resultHandler.process(result)){
        $scope.users = result.data;
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

  app.controller("dashboardController", ["$scope", "$resource", "$state", "$stateParams","userPermissions", "notifications", "resultHandler",  function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
    var Validation = $resource("api/validations/:Id", {validationId: "@Id"});
    var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
    var IssueStatus = $resource("api/issuestatus/:statusId", {statusId: "@statusId"});
    var User = $resource("api/users/:userId", {userId: "@userId"});
    var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});

    $scope.permissions = userPermissions;

    Validation.get({Id:"count"}, function(result){
      if(resultHandler.process(result)){
        $scope.validationCount = result.data;
      }
    });

    UserRoles.get({}, function(result){
      $scope.userRoles = result.data;
      User.get({userId:"count", role: getUserRoleId("user")}, function(result){   //  /api/users/count
      if(resultHandler.process(result)){
          $scope.pendingUsers = result.data;
        }
      }); //this fetches user that aren"t authorised (or in other words "user" users)
    });


    IssueStatus.get({}, function(result){
      $scope.issueStatus = result;
      Issue.get({issueId:"count", status: getIssueStatusId("Open")}, function(result){   //  /api/users/count
        if(resultHandler.process(result)){
          $scope.pendingIssues = result.data;
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
    var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
    var System = $resource("system/:path", {path: "@path"});
    var StepTypes = $resource("api/steptypes/:typeId", {typeId: "@typeId"});
    var StepStatus = $resource("api/stepstatus/:statusId", {statusId: "@statusId"});

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
      "technologytypes",
      "attachments",
      "statushistory"
    ];

    UserRoles.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.roles = result.data;
        $scope.setRole(0);
      }
    });

    TechnologyTypes.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.technologytypes = result.data;
        $scope.setTechType(0);
      }
    });

    StepTypes.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.stepTypes = result.data;
      }
    });  //this creates a GET query to api/steps/types

    StepStatus.get({}, function(result){
      if(resultHandler.process(result)){
        $scope.stepStatus = result.data;
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
      Step.get({techtypeId: $scope.technologytypes[$scope.activeTechType]._id}, function(result){
        if(resultHandler.process(result)){
          $scope.steps = result.data.sort(function(a,b){
            if(a.num > b.num){
              return 1;
            }
            if(a.num < b.num){
              return -1;
            }
            return 0;
          });
        }
      });
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

    $scope.saveTechType = function(){
      TechnologyTypes.save({techtypeId: $scope.technologytypes[$scope.activeTechType]._id}, $scope.technologytypes[$scope.activeTechType], function(result){
        resultHandler.process(result, "Update");
      });
    };

    $scope.newStep = function(newStepName, newStepContent, newStepType, newStepStatus){
      var that = this;
      var newStep = {
          name: newStepName,
          content: newStepContent,
          type: newStepType,
          status: "5559a3937730da518d2dc00f",
          num: $scope.steps.length,
          techtypeId: $scope.technologytypes[$scope.activeTechType]._id
      };
      Step.save({}, newStep, function(result){
         if(resultHandler.process(result, "Create")){
           if($scope.steps){
             $scope.steps.push(result);
           }
           else{
             $scope.steps = [result];
           }
           that.newStepName = "";
           that.newStepContent = "";
           that.newStepType = null;
           that.newStepStatus = null;
         }
      });
    };

    $scope.saveStep = function(id){
      Step.save({stepId:id, techtypeId: $scope.technologytypes[$scope.activeTechType]._id}, $scope.getStepById(id), function(result){
        resultHandler.process(result, "Save");
      });
    };

    $scope.deleteStep = function(id){
      //First we need to delete all issues related to the step
        Step.delete({stepId:id}, function(result){
          if(resultHandler.process(result, "Delete")){
            for(var i=0;i<$scope.steps.length;i++){
              if($scope.steps[i]._id == id){
                $scope.steps.splice(i,1);
              }
            }
          }
        });
    };

    $scope.moveStep = function(id, direction){
      if($(event.target).attr("disabled")=="disabled"){
        return false;
      }
      var stepA = $scope.getStepById(id);
      var stepB = $scope.getStepByNum(stepA.num + direction);
      originalA = stepA.num;
      originalB = stepA.num;
      stepA.num += direction;
      stepB.num -= direction;
      Step.save({stepId: stepA._id}, stepA, function(result){
        if(resultHandler.process(result)){
          Step.save({stepId: stepB._id}, stepB, function(result){
            if(resultHandler.process(result), "Update"){
              console.log($("[data-num="+result.num+"]"));
              $scope.steps.splice(originalA, 1);
              $scope.steps.splice(originalA+=direction, 0, stepA);
            }
          });
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

    $scope.showMoveUp = function(index){
      return index>0&&$scope.steps.length>1;
    };

    $scope.showMoveDown = function(index){
      return index < $scope.steps.length -1 && $scope.steps.length > 1;
    };

    $scope.getStepById = function(id){
      for(var i=0;i<$scope.steps.length;i++){
        if($scope.steps[i]._id == id){
          return $scope.steps[i];
        }
      };
    }

    $scope.getStepByNum = function(num){
      for(var i=0;i<$scope.steps.length;i++){
        if($scope.steps[i].num == num){
          return $scope.steps[i];
        }
      };
    }
  }]);

  app.controller("senseController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
    var config = {
      host: "52.11.126.107/peportal",
      isSecure: false
    };

    var senseApp;

    qsocks.Connect(config).then(function(global){
      global.openDoc("0911af14-71f8-4ba7-8bf9-be2f847dc292").then(function(app){
        senseApp = app;
        $scope.$broadcast("ready", app);
      }, function(error) {
          if (error.code == "1002") { //app already opened on server
              global.getActiveDoc().then(function(app){
                senseApp = app;
                $scope.$broadcast("ready", app);
              });
          } else {
              console.log(error)
          }
      });
    });

    $scope.objects = {};

    $scope.test = "testtext";

    $scope.addField = function(name, title){
      $scope.objects[name] = {
        title: title,
        name: name,
        type: "session-listbox"
      };
      $scope.$on("ready", function(event, senseApp){
        var lbDef = {
          qInfo:{
            qType: "ListObject"
          },
          qListObjectDef:{
            qStateName: "$",
            qDef:{
              qFieldDefs:[name]
            }
          }
        };
        senseApp.createSessionObject(lbDef).then(function(response){
          $scope.$apply(function(){
            $scope.objects[name].handle= response.handle;
            $scope.objects[name].object = new qsocks.GenericObject(response.connection, response.handle);
            $scope.renderObject(name, "session-listbox");
          });
        });

      });
    };

    $scope.addTable = function(id, title){
      $scope.objects[id] = {
        title: title,
        name: id,
        type: "table"
      };
      $scope.$on("ready", function(event, senseApp){
        senseApp.getObject(id).then(function(response){
          $scope.objects[id].handle= response.handle;
          $scope.objects[id].object = new qsocks.GenericObject(response.connection, response.handle);
          $scope.renderObject(id, "table");
        });
      });
    };

    $scope.renderObject = function(item, objectType){
      $scope.objects[item].object.getLayout().then(function(layout){
      switch(objectType){
        case "listbox":
        case "session-listbox":
          $scope.objects[item].object.getListObjectData("/qListObjectDef", [{qTop:0, qLeft:0, qHeight:layout.qListObject.qSize.qcy, qWidth: 1 }]).then(function(data){
            $scope.$apply(function(){
              $scope.objects[item].items = data[0].qMatrix;
            });
          });
          break;
        case "table":
          $scope.objects[item].object.getHyperCubeData("/qHyperCubeDef", [{qTop:0, qLeft:0, qHeight:layout.qHyperCube.qSize.qcy, qWidth: layout.qHyperCube.qSize.qcx }]).then(function(data){
            $scope.$apply(function(){
              $scope.objects[item].labels = layout.qHyperCube.qDimensionInfo.concat(layout.qHyperCube.qMeasureInfo);
              $scope.objects[item].items = data[0].qMatrix;
            });
          });
          break;
        case "text":
          $scope.objects[item].getListObjectData("/qListObjectDef", [{qTop:0, qLeft:0, qHeight:layout.qListObject.qSize.qcy, qWidth: 1 }]).then(function(data){
            $scope.$apply(function(){
              $scope.objects[item].text = data[0].qMatrix.toString();
            });
          });
          break;
      }
    });
    };

    $scope.toggleSelect = function(item, elemNum){
      $scope.objects[item].object.selectListObjectValues("/qListObjectDef", [parseInt(elemNum)], true, false).then(function(response){
        for(var o in $scope.objects){
          $scope.renderObject($scope.objects[o].name, $scope.objects[o].type);
        };
      });
    };

    $scope.clearSelections = function(){
      senseApp.clearAll().then(function(){
        for(var o in $scope.objects){
          $scope.renderObject($scope.objects[o].name, $scope.objects[o].type);
        };
      });
    };

    $scope.getObjectByHandle = function(handle){  //NOT NEEDED
      for(var o in $scope.objects){
        if($scope.objects[o].handle==handle){
          return $scope.objects[o];
        }
      }
      return null;
    };

  }])
  .directive("senseFilter", [function(){
    return {
      restrict: "E",
      scope: {
        info: "="
      },
      link: function($scope, element, attr){
        $scope.$parent.addField(attr.field, attr.title);
        $scope.toggleValue =  function(elemNum){
          $scope.$parent.toggleSelect(attr.field, elemNum);
        }
      },
      templateUrl: "/views/public/filter.html"
    }
  }])
  .directive("senseTable", [function(){
    return {
      restrict: "E",
      scope: {
        info: "="
      },
      link: function($scope, element, attr){
        $scope.$parent.addTable(attr.id, attr.title);
        $scope.getHyperlink = function(value){
          return attr.hyperlinkurl +"/"+ value;
        }
      },
      templateUrl: "/views/public/table.html"
    }
  }]);

})();
