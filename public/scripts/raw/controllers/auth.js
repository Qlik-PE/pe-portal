app.controller("authController", ["$scope", "$resource", "$state", "$stateParams", "resultHandler", "userPermissions", function($scope, $resource, $state, $stateParams, resultHandler, userPermissions){
  var SignUp = $resource("/auth/signup");
  var Login = $resource("/auth/login");
  var Forgot = $resource("/auth/forgot");
  var UnknownUser = $resource("/auth/reset/:token", {token:"@token"});

  $scope.userPermissions = userPermissions;

  $scope.partnername = "";
  $scope.partner;
  $scope.partners = [];
  $scope.showSuggestions = false;
  $scope.currentState = $state.current.name;
  $scope.$on('$stateChangeSuccess', function() {
    $scope.currentState = $state.current.name;
    console.log($scope.currentState);
  });

  if($scope.currentState=="reset"){
    $scope.resetToken = $stateParams.token;
    UnknownUser.get({token: $scope.resetToken}, function(result){
      if(resultHandler.process(result)){
        $scope.userid = result.id;
      }
    });
  }

  $scope.checkPartner = function(){
    var rge = [];
    if($scope.partnername && $scope.partnername.length>1){
      rge.push({name: {$regex:$scope.partnername, $options:"gi"}});
    }
    if(rge.length>0){
      //in this controller we"re using a jQuery GET instead of an angular $resource
      //this is because I could not get the regex to parse properly with $resource
      $.get("system/partners", {$or:rge})
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
    //check that an email has been entered
    if(!$scope.email){
      resultHandler.process({errCode: true, errText: "Please enter an Email"});
      return;
    }
    //check that a name has been entered
    if(!$scope.name){
      resultHandler.process({errCode: true, errText: "Please enter a Name"});
      return;
    }
    //check that we have a password and that the passwords match
    if(!$scope.password){
      resultHandler.process({errCode: true, errText: "Please enter a Password"});
      return;
    }
    if($scope.password!=$scope.confirm){
      resultHandler.process({errCode: true, errText: "Password confirmation does not match"});
      return;
    }
    var user = {
      partner: $scope.partner,
      partnername: $scope.partnername,
      name: $scope.name,
      email: $scope.email,
      password: $scope.password
    };
    SignUp.save({}, user, function(result){
      if(resultHandler.process(result, "Registration")){
        userPermissions.refresh();
        window.location = "#dashboard";
      }
    });
  };

  $scope.login = function(){
    Login.save({
      email: $scope.loginemail,
      password: $scope.loginpassword
    }, function(result){
      if(resultHandler.process(result)){
        userPermissions.refresh();
        window.location = "#dashboard";
      }
    });
  };


  $scope.forgot = function(){
    Forgot.save({email: $scope.email}, function(result){
      if(resultHandler.process(result)){

      }
    });
  };

  $scope.resetPassword = function(){
    UnknownUser.save({id: $scope.userid, password: $scope.password}, function(result){
      if(resultHandler.process(result, "Password reset")){

      }
    });
  };

}]);
