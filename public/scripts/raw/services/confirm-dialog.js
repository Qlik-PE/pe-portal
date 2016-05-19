app.service("confirmDialog", [function(){
    this.delete = function(entityToDelete){   //deals with the result in a generic way. Return true if the result is a success otherwise returns false
        return confirm("Are you sure you want to delete this " + entityToDelete + "? This action cannot be undone.");
    }
}]);
