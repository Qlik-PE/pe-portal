app.directive('header', ['userPermissions', '$state', '$interpolate', function (userPermissions, $state, $interpolate) {
  return {
    restrict: "E",
    replace: true,
    scope:{

    },
    templateUrl: "/views/header.html",
    link: function(scope){
      scope.userPermissions = userPermissions;
    }
  }
}]);
