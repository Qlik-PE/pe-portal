app.controller("stepController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "notifications", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, notifications, resultHandler){
  var Validation = $resource("api/validations/");
  var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
  var StepTemplate = $resource("api/templatesteps/:stepId", {stepId: "@stepId"});
  var StepTypes = $resource("api/steptypes/:typeId", {typeId: "@typeId"});
  var StepStatus = $resource("api/stepstatus/:statusId", {statusId: "@statusId"});
  var StatusHistory = $resource("api/statushistory/:historyId", {historyId: "@historyId"});
  var Issues = $resource("api/issues/:issueId", {issueId:"@issueId"});
  var Screenshots = $resource("api/attachments/:attachmentId", {attachmentId:"@attachmentId"});
  var SaveScreenshots = $resource("attachments/:attachmentId", {attachmentId:"@attachmentId"});

  $scope.permissions = userPermissions;
  $scope.screenshots = [];
  $scope.step;
  $scope.validation;
  $scope.saveTimeout;

  StepTypes.get({}, function(result){
    if(resultHandler.process(result)){
      $scope.stepTypes = result.data;
    }
  });

  StepStatus.get({}, function(result){
    if(resultHandler.process(result)){
      $scope.stepStatus = result.data;
    }
  });

  if($stateParams.Id && $stateParams.Id!="new"){  //We have a validation to work with
    Step.get({stepId:$stateParams.stepId||"", validationid:$stateParams.Id||""}, function(result){
      if(resultHandler.process(result)){
        $scope.steps = result.data;
        $scope.$watch("steps" ,function(n, o){
          for(var i=0;i<o.length;i++){
            if(o[i].status._id != n[i].status._id){
              StatusHistory.save({},{
                entityId: $scope.steps[0]._id,
                oldStatus: o[i].status.name,
                newStatus: n[i].status.name
              }, function(result){
                resultHandler.process(result);
              });
            }
          }
        }, true);
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
        //set the breadcrumb
        Validation.get({_id: $scope.steps[0].validationid}, function(result){
          if(resultHandler.process(result)){
            if($state.current.name == "step"){
              $scope.$root.$broadcast('pushCrumb', {
                text: result.data[0].title,
                link: "/validations/"+result.data[0]._id
              });
              $scope.$root.$broadcast('pushCrumb', {
                text: $scope.steps[0].name,
                link: "/steps/"+$scope.steps[0]._id
              });
            }
          }
        });
        StatusHistory.get({entityId: $scope.steps[0]._id}, function(result){
          if(resultHandler.process(result)){
            $scope.stepStatusHistory = result.data;
          }
        });
        $scope.setTab(0);
        $scope.$watchCollection("steps[0]" ,function(n, o){
          //because this is fired for any change we'll implement a timeout to prevent saving too many times while a user is typing
          if($scope.saveTimeout){
            clearTimeout($scope.saveTimeout);
          }
          $scope.saveTimeout = setTimeout(function(){
            $scope.save($scope.steps[0]._id);
            if(o.status != n.status){
              //we need to add a record to the status history table
              StatusHistory.save({},{
                entityId: $scope.steps[0]._id,
                oldStatus: o.status.name,
                newStatus: n.status.name
              }, function(result){
                if(resultHandler.process(result)){
                  if($scope.stepStatusHistory){
                    $scope.stepStatusHistory.splice(0,0,result);
                  }
                  else{
                    $scope.stepStatusHistory = [result];
                  }
                }
              });
            }
          }, 600);

        });
      }
    })
  }

  $scope.$on("techTypeChanged", function(event, techTypeId){
    StepTemplate.get({techtypeId: techTypeId}, function(result){
      if(resultHandler.process(result)){
        for(var i=0;i<result.data.length;i++){
          var s = result.data[i];
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
    if(index==2 && $scope.screenshots.length == 0){
      //now fetch the screenshots for the current step
      Screenshots.get({entityId: $scope.steps[0]._id}, function(result){
        if(resultHandler.process(result)){
          $scope.screenshots = result.data;
        }
      });
    }
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
  };

  $scope.getStepById = function(id){
    for(var i=0;i<$scope.steps.length;i++){
      if($scope.steps[i]._id == id){
        return $scope.steps[i];
      }
    };
  };

  $(document).on('submit', "#newScreenshotForm", function(event){
    event.preventDefault();
    $.ajax({
      url:'/attachments',
      data: $(this).serialize(),
      success: function(data){
        console.log(data);
      }
    });
  });

  $scope.uploadScreenshot = function(a, b, c){
    var file = $("#file")[0].files[0];
    var r = new FileReader();
    r.onloadend = function(event){
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      var image = r.result;

      var thumbnail = new Image();
      thumbnail.onload = function() {
        var width = thumbnail.width;
        var height = thumbnail.height;
        context.drawImage(thumbnail, 0, 0, thumbnail.width * (200/thumbnail.height), 200);
        var data = {
          entityId: $scope.steps[0]._id,
          image: image,
          thumbnail: canvas.toDataURL(),
          width: width,
          height: height
        };
        Screenshots.save(data, function(result){
          if(resultHandler.process(result, "Image Upload")){

          }
        });
      };
      thumbnail.src = r.result;
    }
    r.readAsDataURL(file);
  };

  $scope.getScreenshot = function(content){
    return "data:image/png;base64,"+btoa(content.data);
    var buffer = _arrayBufferToBase64(content.data);
    return buffer;
  };

  $scope.getScreenshotPath = function(id){
    return "/attachments/"+id;
  };

  $scope.openLightboxModal = function (index) {
    Lightbox.openModal($scope.screenshots, index);
  };

  function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return binary ;
  }
}]);
