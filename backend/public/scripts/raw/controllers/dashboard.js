app.controller("dashboardController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
  var Validation = $resource("api/validations/:Id", {validationId: "@Id"});
  var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
  var User = $resource("api/users/:userId", {userId: "@userId"});


  Validation.query({Id:"count"}, function(result){
    $scope.validationCount = result[0];
  });

  User.query({userId:"roles"}, function(result){
    $scope.userRoles = result;
    User.query({userId:'count', role: getUserRoleId('user')}, function(result){   //  /api/users/count
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.pendingUsers = result[0];
      }
    }); //this fetches user that aren't authorised (or in other words 'user' users)
  });


  Issue.query({issueId:"status"}, function(result){
    $scope.issueStatus = result;
    Issue.query({issueId:'count', status: getIssueStatusId('Open')}, function(result){   //  /api/users/count
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.pendingIssues = result[0];
      }
    }); //this fetches user that aren't authorised (or in other words 'user' users)

  });

  function getUserRoleId(name){
    for(var i=0;i<$scope.userRoles.length;i++){
      if($scope.userRoles[i].name == name){
        return $scope.userRoles[i]._id;
      }
    }
  }

  function getIssueStatusId(name){
    for(var i=0;i<$scope.issueStatus.length;i++){
      if($scope.issueStatus[i].name == name){
        return $scope.issueStatus[i]._id;
      }
    }
  }

}]);
