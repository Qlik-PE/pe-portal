app.controller("dashboardController", ["$scope", "$resource", "$state", "$stateParams","userPermissions", "notifications", "resultHandler",  function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
  var Validation = $resource("api/validations/:Id", {validationId: "@Id"});
  var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
  var IssueStatus = $resource("api/issuestatus/:statusId", {statusId: "@statusId"});
  var User = $resource("api/users/:userId", {userId: "@userId"});
  var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});

  $scope.permissions = userPermissions;

  Validation.get({Id:"count"}, function(result){
    if(resultHandler.process(result)){
      $scope.validationCount = result.data;
    }
  });

  UserRoles.get({}, function(result){
    $scope.userRoles = result.data;
    User.get({userId:"count", role: getUserRoleId("user")}, function(result){   //  /api/users/count
    if(resultHandler.process(result)){
        $scope.pendingUsers = result.data;
      }
    }); //this fetches user that aren"t authorised (or in other words "user" users)
  });


  IssueStatus.get({}, function(result){
    $scope.issueStatus = result;
    Issue.get({issueId:"count", status: getIssueStatusId("Open")}, function(result){   //  /api/users/count
      if(resultHandler.process(result)){
        $scope.pendingIssues = result.data;
      }
    }); //this fetches user that aren"t authorised (or in other words "user" users)

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
