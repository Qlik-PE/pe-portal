app.controller('imageController', ['$scope', '$resource', '$stateParams', function($scope, $resource, $stateParams){
  var ValidationImage = $resource('api/validations/:validationId/images/:imageid', {validationId:'@id', validationstepId:'@iid'});
  var Image = $resource('api/images/:imageid', {stepId: '@stepId'});



});
