app.controller("validationController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
  var Validations = $resource("api/validations/:validationId", {validationId:"@id"});
  var Steps = $resource("api/steps/:stepId", {stepId:"@stepId"});
  var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});
  var TechnologyTypes = $resource("api/technologytypes/:techtypeId", {techtypeId: "@techtypeId"});

  $scope.permissions = userPermissions;
  $scope.validationId = $stateParams.Id;
  if($stateParams.Id !="new"){
    Validations.get({validationId:$stateParams.Id||""}, function(result){
      if(resultHandler.process(result)){
        $scope.validations = result.data.length>0?result.data:[{}];
        $scope.imageUploadPath = "/api/validations/"+$stateParams.Id+"/image";
        if($state.current.name == "validations.detail"){
          $scope.$root.$broadcast('spliceCrumb', {
            text: $scope.validations[0].title,
            link: "/validations/"+$scope.validations[0]._id
          });
        }
      }
    });
  }

  $scope.$watchCollection("validations[0]" ,function(n, o){
    if($scope.saveTimeout){
      clearTimeout($scope.saveTimeout);
    }
    $scope.saveTimeout = setTimeout(function(){
      if(n){
        $scope.save(n._id||"");
      }
    }, 600);
  });

  TechnologyTypes.get({}, function(result){
    if(resultHandler.process(result)){
      $scope.technologytypes = result.data;
    }
  });

  $scope.activeTab = 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }

  $scope.setSteps = function(){
    Steps.get({validationid:$stateParams.Id}, function(stepresult){
      if(resultHandler.process(stepresult)){
        if(stepresult.data.length > 0){
          resultHandler.process({errCode:true, errText: "Validation already has steps."});
        }
        else{
          $scope.$broadcast("techTypeChanged",$scope.validations[0].technology_type._id );
          $scope.save($scope.validations[0]._id);
          $scope.setTab(1);
        }
      }
    });
  }

  $scope.delete = function(id){
    //first we need to get the list of steps for the validation
    //then for each step get the issues and delete them
    //then we delete the step and finally delete the validation
    Steps.get({validationid:id}, function(stepresult){
      if(resultHandler.process(stepresult)){
        if(stepresult.data.length>0){
          function deleteIssuesAndStep(stepIndex){
            var stepId = stepresult.data[stepIndex]._id;
            Issues.delete({stepId: stepId}, function(issueresult){
              if(resultHandler.process(issueresult)){
                //delete the step
                Steps.delete({stepId:stepId}, function(result){
                  if(resultHandler.process(result)){
                    if(stepIndex==stepresult.data.length-1){
                      //delete the validation
                      Validations.delete({validationId: id}, function(result){
                        if(resultHandler.process(result, "Delete")){
                          for(var j=0;j<$scope.validations.length;j++){
                            if($scope.validations[j]._id == id){
                              $scope.validations.splice(j,1);
                            }
                          }
                          window.location = "#validations";
                        }
                      });
                    }
                    else{
                      //delete the next step and issues
                      stepIndex++;
                      deleteIssuesAndStep(stepIndex);
                    }
                  }
                });
              }
            });
          }

          deleteIssuesAndStep(0);
        }
        else{
          Validations.delete({validationId: id}, function(result){
            if(resultHandler.process(result, "Delete")){
              for(var j=0;j<$scope.validations.length;j++){
                if($scope.validations[j]._id == id){
                  $scope.validations.splice(j,1);
                }
              }
              window.location = "#validations";
            }
          });
        }
      }
    });
  };

  $scope.save = function(id){
    //var id = $stateParams.Id=="new"?"":$stateParams.Id;
    Validations.save({validationId:id}, $scope.validations[0], function(result){
      if(resultHandler.process(result, "Save")){
        if($stateParams.Id == "new"){
          window.location = "/#validations/"+result._id;
        }
      }
    });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };

  $scope.validate = function(){
    var id = $stateParams.Id=="new"?"":$stateParams.Id;
    $scope.validations[0].status = "Validated";
    Validations.save({validationId:id}, $scope.validations[0], function(result){
      if(resultHandler.process(result, "Save")){
        if($state.current.name =="validations.new"){
          window.location = "/#validations/"+result._id;
        }
      }
    });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };

  $scope.unvalidate = function(){
    var id = $stateParams.Id=="new"?"":$stateParams.Id;
    $scope.validations[0].status = "Pending";
    Validations.save({validationId:id}, $scope.validations[0], function(result){
      if(resultHandler.process(result, "Save")){
        if($state.current.name =="validations.new"){
          window.location = "/#validations/"+result._id;
        }
      }
    });  //currently we"re only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };

  $scope.disableEditing = function(){
    var canUpdate = $scope.permissions.canUpdate('validations');
    var isNew = $stateParams.Id == 'new';
    return ((!canUpdate && !isNew) || isNew);
  };

  $scope.report = function(id, entity){
    $scope.$root.$broadcast("showReportDialog", {id:id, entity: entity});
  };

}]);
