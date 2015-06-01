app.service('userPermissions', ['$resource', function($resource){
  var System = $resource("system/:path", {path: "@path"});
  this.permissions = {};
  var that = this;
  this.canCreate = function(entity){
    return this.permissions[entity] && this.permissions[entity].create && this.permissions[entity].create==true
  }
  this.canRead = function(entity){
    console.log(entity);
    return this.permissions[entity] && this.permissions[entity].read && this.permissions[entity].read==true
  }
  this.canUpdate = function(entity){
    return this.permissions[entity] && this.permissions[entity].update && this.permissions[entity].update==true
  }
  this.canDelete = function(entity){
    return this.permissions[entity] && this.permissions[entity].delete && this.permissions[entity].delete==true
  }
  this.refresh = function(){
    System.get({path:'userpermissions'}, function(result){
      that.permissions = result;
    });
  }
  this.refresh();
}]);
