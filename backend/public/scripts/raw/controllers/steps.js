app.controller("stepController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
  var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});

  Step.query({stepId:"types"}, function(result){
    $scope.stepTypes = result;
  });  //this creates a GET query to api/steps/types

  Step.query({stepId:"status"}, function(result){
    $scope.stepStatus = result;
  });  //this creates a GET query to api/steps/statuses

  if($stateParams.Id){  //We have a validation to work with
    Step.query({stepId:$stateParams.stepId||"", validationid:$stateParams.Id||""}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.steps = result;
      }
    });
  }
  else{ //We should be working with an individual step
    Step.query({stepId: $stateParams.stepId}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.steps = result;
      }
    })
  }

  $scope.activeTab = $state.current.name == "step.issues" ? 1 : 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }

  $scope.delete = function(id){
    Step.delete({stepId:id}, function(result){
      for(var i=0;i<$scope.steps.length;i++){
        if($scope.steps[i]._id == id){
          $scope.steps.splice(i,1);
        }
      }
    });
  };

  $scope.save = function(id){
    console.log("saving");
    Step.save({stepId:id, validationid: $stateParams.Id}, $scope.getStepById(id), function(result){
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
    data.name = $scope.newStepName;
    data.content = $scope.newStepContent;
    data.type = $scope.newStepType;
    data.status = $scope.newStepStatus;
    data.validationid = $stateParams.Id;
    Step.save(data, function(result){
      //need to add error handling
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
