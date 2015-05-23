app.controller("issueController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
  var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
  var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
  var Validation = $resource("api/validations/:validationId", {validationId: "@validationId"});

  Issue.query({issueId:"status"}, function(result){
    if(result[0] && result[0].redirect){
      window.location = result[0].redirect;
    }
    else{
      $scope.issueStatus = result;
    }
  });  //this creates a GET query to api/issues/statuses

  if($state.current.name!="issues.new"){
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
    else{ //We should be working with an individual issue
      Issue.query({issueId: $stateParams.issueId}, function(result){
        if(result[0] && result[0].redirect){
          window.location = result[0].redirect;
        }
        else{
          $scope.issues = result;
          //first get the step, then the validation
          Step.query({stepId: $scope.issues[0].step}, function(step){
            $scope.step = step[0].name;
            Validation.query({validationId: step[0].validationid}, function(validation){
              $scope.validation = validation[0].title;
            });
          })
        }
      })
    }

  }
  else{
    //get a list of validations
  }



  $scope.activeTab = 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }

  $scope.delete = function(id){
    Issue.delete({issueId:id}, function(result){
      for(var i=0;i<$scope.issues.length;i++){
        if($scope.issues[i]._id == id){
          $scope.issues.splice(i,1);
        }
      }
    });
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