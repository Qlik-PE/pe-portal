app.controller('validationController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
  var Validations = $resource('api/validations/:validationId', {validationId:'@id'});
  var ValidationImages = $resource('api/validations/:validationId/image', {validationId: '@id'});

  if($stateParams.Id!="new"){
    Validations.query({validationId:$stateParams.Id||''}, function(result){
      if(result[0].redirect){
        window.location = result[0].redirect;
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
    console.log('delete me');
  };

  $scope.save = function(){
    var id = $stateParams.Id=="new"?"":$stateParams.Id;
    Validations.save({validationId:id}, $scope.validations[0], function(result){
      if(result.redirect){
        window.location = result.redirect;
      }
      else {
        //notify the user that the validation was successfully saved
      }
      //add notifications & error handling here
    });  //currently we're only allowing a save from the detail page, in which case we should only have 1 validation in the array
  };

  $scope.uploadScreenshot = function(){
    // var file = $("#screenshotUpload")[0].files[0];
    // r = new FileReader();
    // r.onloadend = function(e){
    //   var data = new FormData();
    //   data.append('file', e.target.result);
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

  $scope.delete = function(){
    console.log('delete me');
  };
}]);
