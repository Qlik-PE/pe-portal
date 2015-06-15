app.controller("validationController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", function($scope, $resource, $state, $stateParams, userPermissions, notifications){
  var Validations = $resource("api/validations/:validationId", {validationId:"@id"});
  var Steps = $resource("api/steps/:stepId", {stepId:"@stepId"});
  var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});

  $scope.permissions = userPermissions;

  console.log($state.current.name);

  if($state.current.name !="validations.new"){
    Validations.query({validationId:$stateParams.Id||""}, function(result){
      if(result[0] && result[0].redirect){
        window.location = result[0].redirect;
      }
      else if(result.errCode){
        notifications.showError({message: result.errText})
      }
      else{
        $scope.validations = result;
        $scope.imageUploadPath = "/api/validations/"+$stateParams.Id+"/image";
      }
    })
  }

  $scope.activeTab = 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  }

  $scope.delete = function(id){
    //first we need to get the list of steps for the validation
    //then for each step get the issues and delete them
    //then we delete the step and finally delete the validation
    Steps.query({validationid:id}, function(stepresult){
      if(stepresult[0] && stepresult[0].redirect){
        window.location = stepresult[0].redirect;
      }
      else if(stepresult.errCode){
        notifications.showError({message: stepresult.errText})
      }
      else{
        if(stepresult.length>0){
          for (var i=0;i<stepresult.length;i++){
            var stepId = stepresult[i]._id;       //this variable is used to avoid probelms where i is changed before callbacks are executed
            var isLast = i==stepresult.length-1;  //this variable is used to avoid probelms where i is changed before callbacks are executed
            Issues.delete({stepId: stepId}, function(issueresult){
              if(issueresult.errCode){
                notifications.showError({message: issueresult.errText})
              }
              else{
                Steps.delete({stepId:stepId}, function(result){
                  if(result.errCode){
                    notifications.showError({message: result.errText})
                  }
                  else if(isLast){
                    Validations.delete({validationId: id}, function(result){
                      if(result.errCode){
                        notifications.showError({message: result.errText})
                      }
                      else{
                        for(var j=0;j<$scope.validations.length;j++){
                          if($scope.validations[j]._id == id){
                            $scope.validations.splice(j,1);
                          }
                        }
                        notifications.showSuccess({message: "Successfully Deleted"});
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
            if(result.errCode){
              notifications.showError({message: result.errText})
            }
            else{
              for(var j=0;j<$scope.validations.length;j++){
                if($scope.validations[j]._id == id){
                  $scope.validations.splice(j,1);
                }
              }
              notifications.showSuccess({message: "Successfully Deleted"});
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
      if(result.redirect){
        window.location = result.redirect;
      }
      else if($state.current.name =="validations.new"){
        console.log('saved new');
        window.location = "/#validations/"+result._id;
        notifications.showSuccess({message: "Successfully Saved"});
        //notify the user that the validation was successfully saved
      }
      else if (result.errCode) {
        notifications.showError({message: result.errText});
      }
      else{
        notifications.showSuccess({message: "Successfully Saved"});
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
