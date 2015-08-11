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

    peportalprinter.controller("printController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
      $scope.reports, $scope.info;
      $scope.queryParams = window.location.pathname.split("/");
      $scope.id = $scope.queryParams.pop();
      $scope.entity = $scope.queryParams.pop();
      $scope.report = $scope.queryParams.pop();
      $scope.url = 'http://localhost:3000/views/reports/'+$scope.entity+'/'+$scope.report;
      console.log('print controller');

        //var Entity = $resource("/api/"+entity+"/:entityId", {entityId:"@entityId"});

        // Entity.get({entityId: id}, function(result){
        //   $scope.info = result.data[0];
        // });
        // $.get('/api/'+entity+'/reports').success(function(result){
        //   $scope.reports = result.data;
        // });
        $.get('/api/'+$scope.entity+'/'+$scope.id).success(function(result){
          $scope.$apply(function(){
            $scope.info = result.data[0];
          });
        });


    }]);


})();
