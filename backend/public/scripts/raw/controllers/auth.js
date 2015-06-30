app.controller("authController", ["$scope", "$resource", "$state", "$stateParams", "userPermissions", function($scope, $resource, $state, $stateParams, userPermissions){

  $scope.partnername = "";
  $scope.partner;
  $scope.partners = [];
  $scope.showSuggestions = false;

  $scope.checkPartner = function(){
      if($scope.partnername.length>1){
        //in this controller we"re using a jQuery GET instead of an angular $resource
        //this is because I could not get the regex to parse properly with $resource
        $.get("system/partners", {name: {$regex:$scope.partnername, $options:"gi"}})
        .success(function(data){
          if(data.length>0){
            $scope.$apply(function(){
              $scope.partners = data;
              $scope.showSuggestions = true;
            });
          }
        })
      }
  };

  $scope.hideSuggestions = function(){
    //$scope.$apply(function(){
      $scope.partners = [];
      $scope.showSuggestions = false;
    //});
  };

  $scope.selectPartner = function(partner){
    $scope.partner = partner._id;
    $scope.partners = [];
    $scope.showSuggestions = false;
  };

}]);
