app.controller('validationController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
  var Validations = $resource('api/validations/:validationId', {validationId:'@id'});

  if($stateParams.id!="new"){
    Validations.query({validationId:$stateParams.id||''}, function(result){
      if(result[0].redirect){
        window.location = result[0].redirect;
      }
      else{
        $scope.validations = result;
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
    var id = $stateParams.id=="new"?"":$stateParams.id;
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

  $scope.delete = function(){
    console.log('delete me');
  };
}]);
