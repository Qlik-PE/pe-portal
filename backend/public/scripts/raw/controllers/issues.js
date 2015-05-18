app.controller('issueController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
  var StepIssue = $resource('api/validations/:validationId/step/:stepid/issue', {validationId:'@id', validationstepId:'@stepid'});
  var Issue = $resource('api/issues/:issueid', {issueId: '@issueid'});

  if($stateParams.id && $stateParams.stepId){ //we're looking at the issues for a particular step
    StepIssue.query({validationId:$stateParams.id, validationstepId: $stateParams.sid}, function(results){
      if(result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.issues = result;
      }
    });
  }
  else{ //get all issues
    Issue.query({issueId:$stateParams.issueid||'', validationstepId: $stateParams.sid}, function(results){
      if(result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.issues = result;
      }
    });
  }

});
