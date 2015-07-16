app.service("userPermissions", ["$resource", "resultHandler", function($resource, resultHandler){
  var System = $resource("system/:path", {path: "@path"});
  this.permissions = {};
  var that = this;
  this.canCreate = function(entity){
    return this.permissions[entity] && this.permissions[entity].create && this.permissions[entity].create==true
  }
  this.canRead = function(entity){    
    return this.permissions[entity] && this.permissions[entity].read && this.permissions[entity].read==true
  }
  this.canUpdate = function(entity){
    return this.permissions[entity] && this.permissions[entity].update && this.permissions[entity].update==true
  }
  this.canDelete = function(entity){
    return this.permissions[entity] && this.permissions[entity].delete && this.permissions[entity].delete==true
  }
  this.canSeeAll = function(entity){
    return this.permissions[entity] && this.permissions[entity].allOwners && this.permissions[entity].allOwners==true
  }
  this.refresh = function(){
    System.get({path:"userpermissions"}, function(result){
      if(resultHandler.process(result)){
        that.permissions = result.permissions;
        that.role = result.name;
      }
    });
  }
  this.refresh();
}]);
