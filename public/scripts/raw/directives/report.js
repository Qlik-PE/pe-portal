app.directive('report', ["$resource", "resultHandler", function($resource, resultHandler){
  return {
    restrict: "E",
    replace: true,
    scope: {

    },
    link: function($scope, element, attr){
      $scope.entity;
      $scope.report;

      $scope.$on("showReportDialog", function(event, params){
        $scope.entity = params.entity;
        $scope.id = params.id;
        var Reports = $resource("/api/"+params.entity+"/reports");
        var Entity = $resource("/api/"+params.entity+"/:entityId", {entityId:"@entityId"});
        Reports.get({}, function(result){
          if(resultHandler.process(result)){
            $scope.reports = result.data;
          }
        });
        Entity.get({entityId: params.id}, function(result){
          if(resultHandler.process(result)){
            $scope.info = result.data[0];
          }
        });
        $scope.isModal = true;
      });
      $scope.info, $scope.reports;
      $scope.getReportTemplate = function(entity, report){
        return '/views/reports/'+entity+'/'+report;
      };
      $scope.print = function(entity, id) {
        var html = $(".report-print").html();
        //$.get('/print/'+$scope.report+'/'+entity+'/'+id)
        $.post('/print', {data: html})
        .success(function(data){
          window.open(data.file);
        })
      }
      $scope.isModal = false;
      $scope.close = function(){
        $scope.activeImage=null;
        $scope.isModal = false;
      }
    },
    templateUrl: "/views/report.html"
  }
}]);
