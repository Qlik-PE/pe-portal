app.controller("issueController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
  var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});

  Issue.query({issueId:"status"}, function(result){
    $scope.issueStatus = result;
  });  //this creates a GET query to api/issues/statuses

  if($stateParams.stepId){  //We have a validation to work with
    Issue.query({issueId:$stateParams.issueId||"", step:$stateParams.stepId||""}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.issues = result;
      }
    });
  }
  else{ //We should be working with an individual step
    Issue.query({issueId: $stateParams.issueId}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.issues = result;
      }
    })
  }

  $scope.activeTab = 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }

  $scope.delete = function(id){
    console.log("delete me");
  };

  $scope.save = function(id){
    console.log("saving");
    Issue.save({issueId:id, step: $stateParams.stepId}, $scope.getIssueById(id), function(result){
      if(result.redirect){
        window.location = result.redirect;
      }
      else {
        //notify the user that the validation was successfully saved
      }
      //add notifications & error handling here
    });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };

  $scope.new = function(){
    var data = {};
    data.name = $scope.newIssueName;
    data.content = $scope.newIssueContent;
    data.status = $scope.newIssueStatus;
    data.step = $stateParams.stepId;
    Issue.save(data, function(result){
      //need to add error handling
      if($scope.issues){
        $scope.issues.push(result);
      }
      else{
        $scope.issues = [result];
      }
      $scope.newIssueName = null;
      $scope.newIssueContent = null;
      $scope.newIssueType = null;
      $scope.newIssueStatus = null;
    });
  }

  $scope.getIssueById = function(id){
    for(var i=0;i<$scope.issues.length;i++){
      if($scope.issues[i]._id == id){
        return $scope.issues[i];
      }
    };
  }
}]);
