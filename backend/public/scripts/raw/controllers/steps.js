app.controller("stepController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
  var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
  var StepTypes = $resource("api/steptypes/:typeId", {typeId: "@typeId"});
  var StepStatus = $resource("api/stepstatus/:statusId", {statusId: "@statusId"});
  var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});

  $scope.permissions = userPermissions;

  StepTypes.get({}, function(result){
    if(resultHandler.process(result)){
      $scope.stepTypes = result.data;
    }
  });  //this creates a GET query to api/steps/types

  StepStatus.get({}, function(result){
    if(resultHandler.process(result)){
      $scope.stepStatus = result.data;
    }
  });  //this creates a GET query to api/steps/statuses

  if($stateParams.Id && $stateParams.Id!="new"){  //We have a validation to work with
    Step.get({stepId:$stateParams.stepId||"", validationid:$stateParams.Id||""}, function(result){
      if(resultHandler.process(result)){
        $scope.steps = result.data;
      }
    });
  }
  else if ($state.current.name =="validations.new") {
    //do nothing as we have no steps yet
  }
  else{ //We should be working with an individual step
    Step.get({stepId: $stateParams.stepId}, function(result){
      if(resultHandler.process(result)){
        $scope.steps = result.data;
      }
    })
  }

  $scope.$on("techTypeChanged", function(event, techTypeId){
    Step.get({techtypeId: techTypeId}, function(result){
      if(resultHandler.process(result)){
        for(var i=0;i<result.data.length;i++){
          var s = result[i];
          s._id = null;
          s.techtypeId = null;
          s.validationid = $stateParams.Id;
          s.status = "5559a3937730da518d2dc00f";
          Step.save({}, s, function(stepresult){
            if(i==result.data.length){
              resultHandler.process(stepresult, "Setting steps ");
              $scope.steps = result.data;
            }
          });
        }
      }
    });
  });

  $scope.activeTab = $state.current.name == "step.issues" ? 1 : 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }

  $scope.delete = function(id){
    //First we need to delete all issues related to the step
    Issues.delete({step:id}, function(result){
      if(resultHandler.process(result)){
        Step.delete({stepId:id}, function(result){
          if(resultHandler.process(result, "Delete")){
            for(var i=0;i<$scope.steps.length;i++){
              if($scope.steps[i]._id == id){
                $scope.steps.splice(i,1);
              }
              if($state.current.name.indexOf("detail")!=-1){ //we only redirect if the current view is a detail view
                window.location = "#validations/"+$stateParams.Id;
              }
            }
          }
        });
      }
    });
  };

  $scope.save = function(id){
    console.log("saving");
    Step.save({stepId:id, validationid: $stateParams.Id}, $scope.getStepById(id), function(result){
      resultHandler.process(result, "Save");
    });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };

  $scope.new = function(){
    var data = {};
    data.name = $scope.newStepName;
    data.content = $scope.newStepContent;
    data.type = $scope.newStepType;
    data.status = $scope.newStepStatus;
    data.validationid = $stateParams.Id;
    Step.save(data, function(result){
      if(resultHandler.process(result, "Create")){
        if($scope.steps){
          $scope.steps.push(result);
        }
        else{
          $scope.steps = [result];
        }
        $scope.newStepName = null;
        $scope.newStepContent = null;
        $scope.newStepType = null;
        $scope.newStepStatus = null;
      }
    });
  }

  $scope.getStepById = function(id){
    for(var i=0;i<$scope.steps.length;i++){
      if($scope.steps[i]._id == id){
        return $scope.steps[i];
      }
    };
  }
}]);
