app.directive('breadcrumbs', ['$state', '$interpolate', function ($state, $interpolate) {
  return {
    restrict: "E",
    replace: true,
    scope:{

    },
    templateUrl: function(element, attr){
      return 'views/breadcrumbs.html'
    },
    link: function(scope){
      scope.breadcrumbs;
      scope.$on('$stateChangeSuccess', function() {
        scope.activeItem = $state.current.name.split(".")[0];
        scope.breadcrumbs = [];
        var state = $state.$current;
        if(state.self.name != "home"){
          while(state.self.name != ""){
            console.log(state);
            scope.breadcrumbs.push({
              text: state.data.crumb,
              link: state.data.link
            });
            state = state.parent;
          }
          scope.breadcrumbs.push({text: "Home", link: "/"});
        }
        scope.breadcrumbs.reverse();
      });
      scope.$on('spliceCrumb', function(event, crumb){
        scope.breadcrumbs.splice(-1, 1, crumb);
      });
      scope.$on('pushCrumb', function(event, crumb){
        scope.breadcrumbs.push(crumb);
      });
    }
  }
}]);
