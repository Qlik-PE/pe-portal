app.service('resultHandler', ["notifications", function(notifications){
  this.process = function(result, action){   //deals with the result in a generic way. Return true if the result is a success otherwise returns false
    if(result.redirect || (result[0] && result[0].redirect)){
      window.location = result.redirect || result[0].redirect;
      return false;
    }
    else if (result.errCode || (result[0] && result[0].errCode)) {
      notifications.showError({
        message: result.errText || result[0].errText,
        hideDelay: 3000,
        hide: true
      });
      return false;
    }
    else {
      //if an action has been passed notify the user of it's success
      if(action){
        notifications.showSuccess({message: action + " Successful"});
      }
      return true;
    }
  }
}]);
