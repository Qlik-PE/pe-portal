app.controller('adminController', ['$scope', function($scope){
  $scope.activeTab = 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }
}]);
