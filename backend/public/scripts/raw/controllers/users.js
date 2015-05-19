app.controller("userController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
  var User = $resource("api/users/:userId", {userId: "@userId"});

  User.query({userId:"roles"}, function(result){
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
    console.log("delete me");
  };

  $scope.save = function(user){
    console.log("saving");
    User.save({userId:user._id}, user, function(result){
      if(result.redirect){
        window.location = result.redirect;
      }
      else {
        //notify the user that the validation was successfully saved
      }
      //add notifications & error handling here
    });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };
}]);
