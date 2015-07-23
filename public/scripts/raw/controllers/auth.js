app.controller("authController", ["$scope", "$resource", "$state", "$stateParams", "resultHandler", function($scope, $resource, $state, $stateParams, resultHandler){
  var SignUp = $resource("/auth/signup");
  $scope.partnername = "";
  $scope.partner;
  $scope.partners = [];
  $scope.showSuggestions = false;

  $scope.checkPartner = function(){
      if($scope.partnername.length>1){
        //in this controller we"re using a jQuery GET instead of an angular $resource
        //this is because I could not get the regex to parse properly with $resource
        $.get("system/partners", {name: {$regex:$scope.partnername, $options:"gi"}})
        .success(function(result){
          if(resultHandler.process(result)){
            if(result.data.length>0){
              $scope.$apply(function(){
                $scope.partners = result.data;
                $scope.showSuggestions = true;
              });
            }
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
    $scope.partnername = partner.name;
    $scope.partners = [];
    $scope.showSuggestions = false;
  };

  $scope.signup = function(){
    var user = {
      partner: $scope.partner,
      partnername: $scope.partnername,
      name: $scope.name,
      email: $scope.email,
      password: $scope.password
    };
    SignUp.save({}, user, function(result){
      if(resultHandler.process(result, "Registration")){
        window.location = "#login";
      }
    });
  };

}]);
