app.controller('validationstepController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
  var ValidationStep = $resource('api/validations/:validationId/step/:validationstepId', {validationId:'@id', validationstepId:'@sid'});
  var Step = $resource('api/steps/:stepId', {stepId: '@stepId'});

  Step.query({stepId:'types'}, function(result){
    $scope.stepTypes = result;
  });  //this creates a GET query to api/steps/types

  ValidationStep.query({validationId:$stateParams.id, validationstepId:$stateParams.sid||''}, function(result){
    if(result[0].redirect){
      window.location = result[0].redirect;
    }
    else{
      $scope.steps = result;
    }
  });


  $scope.activeTab = 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }

  $scope.delete = function(id){
    console.log('delete me');
  };

  $scope.save = function(id){
    console.log('saving');
    ValidationStep.save({validationId: $stateParams.id, validationstepId:id}, $scope.getStepById(id), function(result){
      if(result.redirect){
        window.location = result.redirect;
      }
      else {
        //notify the user that the validation was successfully saved
      }
      //add notifications & error handling here
    });  //currently we're only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };

  $scope.getStepById = function(id){
    for(var i=0;i<$scope.steps.length;i++){
      if($scope.steps[i]._id == id){
        return $scope.steps[i];
      }
    };
  }
}]);
