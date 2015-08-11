(function() {
  var peportalprinter = angular.module("peportalprinter", ["ui.router", "ngResource"]);

  peportalprinter.config(["$stateProvider","$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      // route for the home page
      .state("home", {
        url: "/",
        templateUrl : "/views/printhome.html",
        controller  : "printController"
      });
    }]);

    include "./controllers/print.js"

})();
