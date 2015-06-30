app.controller("senseController", ["$scope", "$resource", "$state", "$stateParams", function($scope, $resource, $state, $stateParams){
  var config = {
    host: "10.211.55.3",
    port: "8080",
    isSecure: false
  };

  var senseApp;

  qsocks.Connect(config).then(function(global){
    global.openDoc("c9ece11e-274f-4045-8d1d-402ca46496fc").then(function(app){
      senseApp = app;
      $scope.$broadcast("ready", app);
    }, function(error) {
        if (error.code == "1002") { //app already opened on server
            global.getActiveDoc().then(function(app){
              senseApp = app;
              $scope.$broadcast("ready", app);
            });
        } else {
            console.log(error)
        }
    });
  });

  $scope.objects = {};

  $scope.test = "testtext";

  $scope.addField = function(name, title){
    $scope.objects[name] = {
      title: title,
      name: name,
      type: "session-listbox"
    };
    $scope.$on("ready", function(event, senseApp){
      var lbDef = {
        qInfo:{
          qType: "ListObject"
        },
        qListObjectDef:{
          qStateName: "$",
          qDef:{
            qFieldDefs:[name]
          }
        }
      };
      senseApp.createSessionObject(lbDef).then(function(response){
        $scope.$apply(function(){
          $scope.objects[name].handle= response.handle;
          $scope.objects[name].object = new qsocks.GenericObject(response.connection, response.handle);
          $scope.renderObject(name, "session-listbox");
        });
      });

    });
  };

  $scope.addTable = function(id, title){
    $scope.objects[id] = {
      title: title,
      name: id,
      type: "table"
    };
    $scope.$on("ready", function(event, senseApp){
      senseApp.getObject(id).then(function(response){
        $scope.objects[id].handle= response.handle;
        $scope.objects[id].object = new qsocks.GenericObject(response.connection, response.handle);
        $scope.renderObject(id, "table");
      });
    });
  };

  $scope.renderObject = function(item, objectType){
    $scope.objects[item].object.getLayout().then(function(layout){
    switch(objectType){
      case "listbox":
      case "session-listbox":
        $scope.objects[item].object.getListObjectData("/qListObjectDef", [{qTop:0, qLeft:0, qHeight:layout.qListObject.qSize.qcy, qWidth: 1 }]).then(function(data){
          $scope.$apply(function(){
            $scope.objects[item].items = data[0].qMatrix;
          });
        });
        break;
      case "table":
        $scope.objects[item].object.getHyperCubeData("/qHyperCubeDef", [{qTop:0, qLeft:0, qHeight:layout.qHyperCube.qSize.qcy, qWidth: layout.qHyperCube.qSize.qcx }]).then(function(data){
          $scope.$apply(function(){
            $scope.objects[item].labels = layout.qHyperCube.qDimensionInfo.concat(layout.qHyperCube.qMeasureInfo);
            $scope.objects[item].items = data[0].qMatrix;
          });
        });
        break;
      case "text":
        $scope.objects[item].getListObjectData("/qListObjectDef", [{qTop:0, qLeft:0, qHeight:layout.qListObject.qSize.qcy, qWidth: 1 }]).then(function(data){
          $scope.$apply(function(){
            $scope.objects[item].text = data[0].qMatrix.toString();
          });
        });
        break;
    }
  });
  };

  $scope.toggleSelect = function(item, elemNum){
    $scope.objects[item].object.selectListObjectValues("/qListObjectDef", [parseInt(elemNum)], true, false).then(function(response){
      for(var o in $scope.objects){
        $scope.renderObject($scope.objects[o].name, $scope.objects[o].type);
      };
    });
  };

  $scope.clearSelections = function(){
    senseApp.clearAll().then(function(){
      for(var o in $scope.objects){
        $scope.renderObject($scope.objects[o].name, $scope.objects[o].type);
      };
    });
  };

  $scope.getObjectByHandle = function(handle){  //NOT NEEDED
    for(var o in $scope.objects){
      if($scope.objects[o].handle==handle){
        return $scope.objects[o];
      }
    }
    return null;
  };

}])
.directive("senseFilter", [function(){
  return {
    restrict: "E",
    scope: {
      info: "="
    },
    link: function($scope, element, attr){
      $scope.$parent.addField(attr.field, attr.title);
      $scope.toggleValue =  function(elemNum){
        $scope.$parent.toggleSelect(attr.field, elemNum);
      }
    },
    templateUrl: "/views/public/filter.html",
  }
}])
.directive("senseTable", [function(){
  return {
    restrict: "E",
    scope: {
      info: "="
    },
    link: function($scope, element, attr){
      $scope.$parent.addTable(attr.id, attr.title);
      $scope.getHyperlink = function(value){        
        return attr.hyperlinkurl +"/"+ value;
      }
    },
    templateUrl: "/views/public/table.html",
  }
}]);
