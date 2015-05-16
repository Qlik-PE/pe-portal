module.exports = {
  isLoggedIn: function(req, res, next){
    console.log('checking auth');
    if(req.isAuthenticated()){
      next();
    }
    else{
      res.json({errorCode: 401, errorText: 'User not logged in', redirect: '#login'})
    }
  }
}
