var config = require("../config/config");
module.exports = {
    "get" : {
        "/" : function(req, res){
            req.logout();
            res.redirect(config.login.failureRedirect);
        }
    }
};