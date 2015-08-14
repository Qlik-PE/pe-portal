app.controller("issueController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, resultHandler){
  var Issue = $resource("api/issues/:issueId", {issueId: "@issueId"});
  var IssueStatus = $resource("api/issuestatus/:statusId", {statusId: "@statusId"});
  var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
  var Validation = $resource("api/validations/:validationId", {validationId: "@validationId"});

  $scope.permissions = userPermissions;

  IssueStatus.get({}, function(result){
    if(resultHandler.process(result)){
      $scope.issueStatus = result.data;
    }
  });  //this creates a GET query to api/issues/statuses

  if($state.current.name!="issues.new"){
    if($stateParams.stepId){  //We have a step to work with
      Issue.get({issueId:$stateParams.issueId||"", step:$stateParams.stepId||""}, function(result){
        if(resultHandler.process(result)){
          $scope.issues = result.data;
        }
      });
    }
    else{ //We should be working with an individual issue
      Issue.get({issueId: $stateParams.issueId}, function(result){
        if(resultHandler.process(result)){
          $scope.issues = result.data;
          //first get the step, then the validation
          Step.get({stepId: $scope.issues[0].step}, function(step){
            $scope.step = step.data[0];
            Validation.get({validationId: step.data[0].validationid}, function(validation){
              $scope.validation = validation.data[0].title;
              $scope.$root.$broadcast('pushCrumb', {
                text: validation.data[0].title,
                link: "/validations/"+validation.data[0]._id
              });
              $scope.$root.$broadcast('pushCrumb', {
                text: $scope.step.name,
                link: "/step/"+$scope.step._id
              });
              $scope.$root.$broadcast('pushCrumb', {
                text: $scope.issues[0].name,
                link: "/issues/"+$scope.issues[0]._id
              });
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
      if(resultHandler.process(result, "Delete")){
        for(var i=0;i<$scope.issues.length;i++){
          if($scope.issues[i]._id == id){
            $scope.issues.splice(i,1);
            var stepId = $stateParams.stepId || $scope.step._id;
            $scope.$root.$broadcast('issueDeleted', {issueId: id, stepId: stepId});
          }
        }
      }
    });
  };

  $scope.save = function(id){
    console.log("saving");
    Issue.save({issueId:id, step: $stateParams.stepId}, $scope.getIssueById(id), function(result){
      resultHandler.process(result, "Save");
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
      if(resultHandler.process(result, "Create")){
        var stepId = $stateParams.stepId || $scope.step._id;
        //update the step issue count
        $scope.$root.$broadcast('issueCreated', {issueId: result._id, stepId: stepId});
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
      }
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
