app.controller('validationController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
  var Validations = $resource('api/validations/:validationId', {validationId:'@id'});

  if($stateParams.id){
    Validations.get({validationId:$stateParams.id}, function(result){
      $scope.validation = result;
    })
  }
  else{
    Validations.query(function(result){
      $scope.validations = result;
    });
  }

  $scope.delete = function(id){
    console.log('delete me');
  };
}]);
