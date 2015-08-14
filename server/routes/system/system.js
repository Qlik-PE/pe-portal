var express = require("express"),
    router = express.Router(),
    Error = require("../../controllers/error"),
    Partners = {
      model: require("../../models/partners"),
      populates: ""
    },
    MasterController = require("../../controllers/master");

router.get("/userpermissions", function(req, res){
  var menu = buildMenu(req.user);
  var userNoPassword = {};
  if(req.user&&req.user.role){
    userNoPassword = cloneObject(req.user);
    delete userNoPassword["password"];
  }
  res.json({
    user: userNoPassword,
    menu: menu
  });
});

router.get("/partners", function(req, res){ //used to check for existing partners in the signup process
  var query = req.query || {};
  //query={name:/Qli/gi};
  var params = req.params;
  MasterController.get(req.query, query, Partners, function(results){
    res.json(results);
  });
});

function buildMenu(user){
  var topMenu;
  var basicMenu = [
    {
      label: "Logout",
      href: "/auth/logout"
    }
  ];
  if(user && user.role.name!='user'){
    basicMenu.splice(0,0, {
      label: "Dashboard",
      href: "#dashboard"
    });
    basicMenu.splice(1,0, {
      label: "Manage Validations",
      href: "#validations"
    });
    basicMenu.splice(2,0, {
      label: "Manage Users",
      href: "#users"
    });
    topMenu = {
      items:[{
        label: user.email,
        href:"#",
        items: []
      }]
    };
    if(user.role.name=="admin"){
      basicMenu.splice(3,0, {
        label: "Admin Console",
        href: "#admin"
      });
    }
    topMenu.items[0].items = basicMenu;
  }
  else{
    topMenu = {
      items:[{
        label: "Login",
        href: "#login",
        items: []
      }]
    };
  }
  return topMenu;
}

function cloneObject(object){
  var clone = {};
  for (var key in object){
    clone[key] = object[key];
  }
  return clone;
}


module.exports = router;
