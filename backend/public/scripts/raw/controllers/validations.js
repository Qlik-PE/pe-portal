app.controller("validationController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
  var Validations = $resource("api/validations/:validationId", {validationId:"@id"});
  var Steps = $resource("api/steps/:stepId", {stepId:"@stepId"});
  var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});
  var TechnologyTypes = $resource("api/technologytypes/:techtypeId", {techtypeId: "@techtypeId"});

  $scope.permissions = userPermissions;

  console.log($state.current.name);

  if($state.current.name !="validations.new"){
    Validations.get({validationId:$stateParams.Id||""}, function(result){
      if(resultHandler.process(result)){
        $scope.validations = result.data;
        $scope.imageUploadPath = "/api/validations/"+$stateParams.Id+"/image";
      }
    });
  }

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
          $scope.save();
          $scope.setTab(1);
        }
      }
    });
  }

  $scope.delete = function(id){
    //first we need to get the list of steps for the validation
    //then for each step get the issues and delete them
    //then we delete the step and finally delete the validation
    Steps.query({validationid:id}, function(stepresult){
      if(resultHandler.process(stepresult)){
        if(stepresult.length>0){
          for (var i=0;i<stepresult.length;i++){
            var stepId = stepresult[i]._id;       //this variable is used to avoid probelms where i is changed before callbacks are executed
            var isLast = i==stepresult.length-1;  //this variable is used to avoid probelms where i is changed before callbacks are executed
            Issues.delete({stepId: stepId}, function(issueresult){
              if(resultHandler.process(issueresult)){
                Steps.delete({stepId:stepId}, function(result){
                  if(resultHandler.process(result)){
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
                });
              }
            });
          }
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

  $scope.save = function(){
    var id = $stateParams.Id=="new"?"":$stateParams.Id;
    Validations.save({validationId:id}, $scope.validations[0], function(result){
      if(resultHandler.process(result, "Save")){
        if($state.current.name =="validations.new"){
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

  $scope.uploadScreenshot = function(){
    // var file = $("#screenshotUpload")[0].files[0];
    // r = new FileReader();
    // r.onloadend = function(e){
    //   var data = new FormData();
    //   data.append("file", e.target.result);
    //   //send you binary data via $http or $resource or do anything else with it
      //ValidationImages.save({validationId:$stateParams.id}, $("#file")[0].files[0], function(result){
      $("#uploadForm")[0].submit(function(event, result){
        event.preventDefault();
        if($scope.validation[0].screenshots){
          $scope.validation[0].screenshots.push(result._id);
        }
        else{
          $scope.validation[0].screenshots = [result._id];
        }
      });
    //}
    //r.readAsBinaryString(file);
  }

  $scope.getPath = function(id){
    return "/api/images/"+id;
  }

}]);
