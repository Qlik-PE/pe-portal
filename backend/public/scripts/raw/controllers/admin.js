app.controller("adminController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, resultHandler){
  var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});
  var TechnologyTypes = $resource("api/technologytypes/:techtypeId", {techtypeId: "@techtypeId"});
  var Step = $resource("api/steps/:stepId", {stepId: "@stepId"});
  var System = $resource("system/:path", {path: "@path"});
  var StepTypes = $resource("api/steptypes/:typeId", {typeId: "@typeId"});
  var StepStatus = $resource("api/stepstatus/:statusId", {statusId: "@statusId"});

  $scope.permissions = userPermissions;
  $scope.collections = [
    "validations",
    "steps",
    "issues",
    "users",
    "userroles",
    "steptypes",
    "stepstatus",
    "issuestatus",
    "technologytypes"
  ];

  UserRoles.query({}, function(result){
    if(result[0] && result[0].redirect){
      window.location = result[0].redirect;
    }
    else{
      $scope.roles = result;
      $scope.setRole(0);
    }
  });

  TechnologyTypes.query({}, function(result){
    if(resultHandler.process(result)){
      $scope.technologytypes = result;
      $scope.setTechType(0);
    }
  });

  StepTypes.query({}, function(result){
    if(resultHandler.process(result)){
      $scope.stepTypes = result;
    }
  });  //this creates a GET query to api/steps/types

  StepStatus.query({}, function(result){
    if(resultHandler.process(result)){
      $scope.stepStatus = result;
    }
  });

  $scope.newTechType = null;

  $scope.activeRole = 0;

  $scope.activeTechType = 0;

  $scope.activeTab = 0;

  $scope.setTab = function(index){
    $scope.activeTab = index;
  };

  $scope.setRole = function(index){
    $scope.activeRole = index;
    $scope.copyRoleName = $scope.roles[$scope.activeRole].name;
  };

  $scope.setTechType = function(index){
    $scope.activeTechType = index;
    Step.query({techtypeId: $scope.technologytypes[$scope.activeTechType]._id}, function(result){
      if(resultHandler.process(result)){
        $scope.steps = result.sort(function(a,b){
          if(a.num > b.num){
            return 1;
          }
          if(a.num < b.num){
            return -1;
          }
          return 0;
        });
      }
    });
  };

  $scope.saveRole = function(){
    console.log($scope.roles[$scope.activeRole]);
    UserRoles.save({roleId:$scope.roles[$scope.activeRole]._id}, $scope.roles[$scope.activeRole], function(result){
      resultHandler.process(result, "Save");
    });
  };

  $scope.newRole = function(newrolename){
    var that = this;
    UserRoles.save({}, {name: newrolename}, function(result){
      if(resultHandler.process(result, "Create")){
        $scope.roles.push(result);
        that.newrolename = "";
        $scope.setRole($scope.roles.length -1);
      }
    });
  };

  $scope.copyRole = function(copyrolename){
    var roleToCopy = $scope.roles[$scope.activeRole];
    if(copyrolename==roleToCopy.name){
      copyrolename += " - copy";
    }
    UserRoles.save({}, {name: copyrolename, permissions: roleToCopy.permissions}, function(result){
      if(resultHandler.process(result, "Copy")){
        $scope.roles.push(result);
        $scope.setRole($scope.roles.length -1);
      }
    });
  };

  $scope.newTechType = function(newtechtype){
    var that = this;
    TechnologyTypes.save({},{name: newtechtype}, function(result){
      if(resultHandler.process(result, "Update")){
        $scope.technologytypes.push(result);
        that.newtechtype = "";
        $scope.setTechType($scope.technologytypes.length);
      }
    });
  };

  $scope.saveTechType = function(){
    TechnologyTypes.save({techtypeId: $scope.technologytypes[$scope.activeTechType]._id}, $scope.technologytypes[$scope.activeTechType], function(result){
      resultHandler.process(result, "Update");
    });
  };

  $scope.newStep = function(newStepName, newStepContent, newStepType, newStepStatus){
    var that = this;
    var newStep = {
        name: newStepName,
        content: newStepContent,
        type: newStepType,
        status: "5559a3937730da518d2dc00f",
        num: $scope.steps.length,
        techtypeId: $scope.technologytypes[$scope.activeTechType]._id
    };
    Step.save({}, newStep, function(result){
       if(resultHandler.process(result, "Create")){
         if($scope.steps){
           $scope.steps.push(result);
         }
         else{
           $scope.steps = [result];
         }
         that.newStepName = "";
         that.newStepContent = "";
         that.newStepType = null;
         that.newStepStatus = null;
       }
    });
  };

  $scope.saveStep = function(id){
    Step.save({stepId:id, techtypeId: $scope.technologytypes[$scope.activeTechType]._id}, $scope.getStepById(id), function(result){
      resultHandler.process(result, "Save");
    });
  };

  $scope.deleteStep = function(id){
    //First we need to delete all issues related to the step
      Step.delete({stepId:id}, function(result){
        if(resultHandler.process(result, "Delete")){
          for(var i=0;i<$scope.steps.length;i++){
            if($scope.steps[i]._id == id){
              $scope.steps.splice(i,1);
            }
          }
        }
      });
  };

  $scope.moveStep = function(id, direction){
    if($(event.target).attr("disabled")=="disabled"){
      return false;
    }
    var stepA = $scope.getStepById(id);
    var stepB = $scope.getStepByNum(stepA.num + direction);
    originalA = stepA.num;
    originalB = stepA.num;
    stepA.num += direction;
    stepB.num -= direction;
    Step.save({stepId: stepA._id}, stepA, function(result){
      if(resultHandler.process(result)){
        Step.save({stepId: stepB._id}, stepB, function(result){
          if(resultHandler.process(result), "Update"){
            console.log($("[data-num="+result.num+"]"));
            $scope.steps.splice(originalA, 1);
            $scope.steps.splice(originalA+=direction, 0, stepA);
          }
        });
      }
    });
  };

  $scope.delete = function(index){
    var roleToDelete = $scope.roles[$scope.activeRole];
    UserRoles.delete({roleId: roleToDelete._id}, function(result){
      if(resultHandler.process(result, "Delete")){
        for(var j=0;j<$scope.roles.length;j++){
          if($scope.roles[j]._id == roleToDelete._id){
            $scope.roles.splice(j,1);
            if($scope.activeRole > 0){
              $scope.activeRole--;
              $scope.setRole($scope.activeRole);
            }
          }
        }
      }
    });
  };

  $scope.showMoveUp = function(index){
    return index>0&&$scope.steps.length>1;
  };

  $scope.showMoveDown = function(index){
    return index < $scope.steps.length -1 && $scope.steps.length > 1;
  };

  $scope.getStepById = function(id){
    for(var i=0;i<$scope.steps.length;i++){
      if($scope.steps[i]._id == id){
        return $scope.steps[i];
      }
    };
  }

  $scope.getStepByNum = function(num){
    for(var i=0;i<$scope.steps.length;i++){
      if($scope.steps[i].num == num){
        return $scope.steps[i];
      }
    };
  }
}]);
