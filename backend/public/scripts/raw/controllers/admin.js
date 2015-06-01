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
