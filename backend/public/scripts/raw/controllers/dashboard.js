app.controller("dashboardController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
  var Validation = $resource("api/validations/:Id", {validationId: "@Id"});
  var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
  var User = $resource("api/users/:userId", {userId: "@userId"});


  User.query({userId:'count', 'role.name': 'partner'}, function(result){   //  /api/users/count
    if(result[0] && result[0].redirect){
      window.location = result[0].redirect;
    }
    else{
      $scope.pendingUsers = result[0];
    }
  }); //this fetches user that aren't authorised (or in other words 'user' users)

}]);
