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
  include "./services/permissions.js"
  include "./services/result-handler.js"
  include "./services/confirm-dialog.js"

  //Directives
  include "./directives/gallery.js"
  include "./directives/report.js"
  include "./directives/breadcrumbs.js"
  include "./directives/header.js"

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
