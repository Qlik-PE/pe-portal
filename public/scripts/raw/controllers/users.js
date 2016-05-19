app.controller("userController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", "confirmDialog", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler, confirmDialog){
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
    if(!confirmDialog.delete("User"))
      return;

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
