app.controller("adminController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", "resultHandler", function($scope, $resource, $state, $stateParams, userPermissions, resultHandler){
  var UserRoles = $resource("api/userroles/:roleId", {roleId: "@roleId"});
  var TechnologyTypes = $resource("api/technologytypes/:techtypeId", {techtypeId: "@techtypeId"});
  var System = $resource("system/:path", {path: "@path"});

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
    if(result[0] && result[0].redirect){
      window.location = result[0].redirect;
    }
    else{
      $scope.technologytypes = result;
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

  $scope.newStep = function(stepContent){
    var that = this;
    $scope.technologytypes[$scope.activeTechType].steps.push({
        name: stepContent,
        index: $scope.technologytypes[$scope.activeTechType].steps.length
    });
    TechnologyTypes.save({techtypeId: $scope.technologytypes[$scope.activeTechType]._id }, $scope.technologytypes[$scope.activeTechType], function(result){
       if(resultHandler.process(result, "Update")){
         that.newstepcontent = "";
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
}]);
