var passport = require("passport");
var config = require("../config/config");
module.exports = {
    load : function(name,ctrl,app) {
        var _gets = ctrl.get;
        var _deletes = ctrl.delete;
        var _puts = ctrl.put;
        var _post = ctrl.post;
        if(_gets){
            this.register(name,"get",_gets,app,ctrl);
        }
        if(_post){
            this.register(name,"post",_post,app,ctrl);
        }
        if(_deletes){
            this.register(name,"delete",_deletes,app,ctrl);
        }
        if(_puts){
            this.register(name,"put",_puts,app,ctrl);
        }
        return ctrl;
    },
    register : function(name,type,collection,app,ctrl){
        var loginSucess = function(req, res) {
            res.redirect(config.login.successRedirect);
        };
        for(var i in collection){
            var action = collection[i];
            var url = "/"+name;
            if(i && i!="/"){
                url +="/"+i;
            }
            url = url.replace(new RegExp("//", 'g'),"/");
            if(config.login && config.login.method == type && config.login.action == url){
                
                app[type](url,passport.authenticate('local', { failureRedirect: config.login.failureRedirect }),loginSucess);
            }else{
                var authenticate=false;
                var fnAction = null;
                if(action){
                    if(Array.isArray(action)){
                        if(typeof(action[0]) == "boolean"){
                            authenticate = action[0];
                            fnAction = action[1];
                        }else{
                            fnAction = action[0];
                        }
                    }else{
                        if(action instanceof Function){
                            fnAction = action;
                        }else{
                            authenticate = action.authenticate;
                            fnAction = action.action;
                        }       
                    }
                    if(config.hasAuthentication === undefined){
                        config.hasAuthentication = true;
                    }
                    if((authenticate || ctrl.authenticateAll) && config.hasAuthentication ){
                        app[type](url ,require('connect-ensure-login').ensureLoggedIn(), fnAction);
                    }else{
                        app[type](url, fnAction);
                    }
                }
            }
            
        }
    }
};
