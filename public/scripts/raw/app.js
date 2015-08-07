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
        templateUrl: "/views/public/validations/index.html",
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
  include "./services/permissions.js"
  include "./services/result-handler.js"

  //Directives
  include "./directives/gallery.js"

  //Controllers
  include "./controllers/main.js"
  include "./controllers/auth.js"
  include "./controllers/validations.js"
  include "./controllers/steps.js"
  include "./controllers/issues.js"
  include "./controllers/users.js"
  include "./controllers/dashboard.js"
  include "./controllers/admin.js"
  include "./controllers/sense-engine.js"

})();
