app.controller("userController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
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
