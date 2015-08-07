app.directive('gallery', function(){
  return {
    restrict: "E",
    replace: true,
    scope: {
      images: "="
    },
    link: function($scope, element, attr){
      $scope.activeImage;
      $scope.isModal = false;
      $scope.showModal = function(index){
        $scope.activeImage = index;
        $scope.setSize();
        $scope.isModal = true;
      };
      $scope.setSize = function(){
        var width = $scope.images[$scope.activeImage].width, height = $scope.images[$scope.activeImage].height;
        if(height > width && height > 600){
          var ratio = height / width;
          height = 600;
          width = 600 / ratio;
        }
        else if(width > height && width > 960){
          var ratio = width / height;
          width = 960;
          height = 960 / ratio;
        }
        $(".modal-image").css({
          "height": (height+20) + "px",
          "width": (width+20) + "px"
        });
        $(".modal-image img").css({
          "height": (height) + "px",
          "width": (width) + "px"
        });
      }
      $scope.prev = function(){
        if($scope.activeImage==0){
          $scope.activeImage=$scope.images.length-1;
        }
        else{
          $scope.activeImage--;
        }
        $scope.setSize();
      };
      $scope.next = function(){
        if($scope.activeImage==$scope.images.length-1){
          $scope.activeImage=0;
        }
        else{
          $scope.activeImage++;
        }
        $scope.setSize();
      };
      $scope.close = function(){
        $scope.activeImage=null;
        $scope.isModal = false;
      }
    },
    templateUrl: "/views/gallery.html"
  }
});
