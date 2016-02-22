var fs = require("fs");
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

//Private library
var db = require('../db');
var _c = require('./_controller');
var _s = require('./_service');
var di = require("../api/_di");
var DataFactory = require('../data/DataFactory');

String.prototype.toCamelCase = function() {
  return this
      .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
      .replace(/\s/g, '')
      .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
};

var Main = function(){
    
    var self = this;

    self.pathConfig = "./server/config";
    self.pathController = "./server/controller";
    self.pathService    = "./server/service";
    self.controllers = {};
    self.services = {};
    self.config = [];

    self._init = function(){
        _loadConfig();
        _configure();
        _loadServices();
        _loadControllers();
        _configureDB();
        return self;
    };
    var _configureDB = function(){
        for(var i in self.config.database.datasources){
            if(i){
                var ds = self.config.database.datasources[i];
                DataFactory(ds,ds.type);
            }
        }
    };
    var _loadConfig = function(){
        self.config = require("../config/config.js");
        if(!self.config.views){
            self.config.views = {};
        }
        if(!self.config.views.path){
            self.config.views.path = "site";
        }
        if(!self.config.express){
            self.config.express = {
                views: "/client/",
                statics: "/client/"
            };
        }
        if(self.config.hasAuthentication === undefined){
            self.config.hasAuthentication = true;
        }
        return self;
    };
    var _configurePassport = function(){
        passport.use(new Strategy(
          function(username, password, cb) {
            db.users.findByUsername(username, function(err, user) {
              if (err) { return cb(err); }
              if (!user) { return cb(null, false); }
              if (user.password != password) { return cb(null, false); }
              return cb(null, user);
            });
        }));
        passport.serializeUser(function(user, cb) {
          cb(null, user.id);
        });
        
        passport.deserializeUser(function(id, cb) {
          db.users.findById(id, function (err, user) {
            if (err) { return cb(err); }
            cb(null, user);
          });
        });
    };
    var _configure = function(){
        if(self.config.hasAuthentication){
            _configurePassport();
        }
        
        var app = express();
        app.configure(function() {
            app.set('views', self.config.express.views);
            app.engine('html', require('ejs').renderFile);
            
            app.use(express.logger('dev'));
            app.use(express.cookieParser());
            app.use(express.bodyParser());
            app.use(express.session({ secret: self.config.express.expressSession }));
            
            app.use(express.urlencoded());
            app.use(express.json());
            app.use(express.static(self.config.express.statics));
            if(self.config.hasAuthentication){
                app.use(passport.initialize());
                app.use(passport.session());
            }
        });
        self.app = app;
        return self;
    };
    var _loadServices = function(){
        if(!fs.existsSync(self.pathService)){
            fs.mkdir(self.pathService);
        }
        fs.readdir(self.pathService,function(error,files){
            if(error){
                console.error(error);
                return;
            }
            for(var i =0; i<files.length;i++){
                var name = files[i].replace("Service","").replace(".js","").toLowerCase();
                self.services[name] = _s.load(name,require("../service/"+files[i].replace(".js","")),self.app);
            }
        });
        return self;
    };
    var _loadControllers = function(){
        if(self.config){
            if(self.config.welcome){
                self.app.get(self.config.welcome.url,self.config.welcome.controller);
            }else{
                self.app.get("/",function(req,res){
                    res.render(self.config.views.path+"/index.html");
                });
            }
        }
        if(!fs.existsSync(self.pathController)){
            fs.mkdir(self.pathController);
        }
        fs.readdir(self.pathController,function(error,files){
            if(error){
                console.error(error);
                return;
            }
            for(var i =0; i<files.length;i++){
                var name = files[i].replace("Controller","").replace(".js","").toLowerCase();
                var controller = self.controllers[name] = _c.load(name,require("../controller/"+files[i].replace(".js","")),self.app);
                controller.app = self;
                if(controller.hasOwnProperty("services")){
                    for(var s in controller.services){
                        if(s){
                            var nameService = controller.services[s];
                            var nameServiceCamelCase = nameService.toCamelCase();
                            try{
                                controller[nameServiceCamelCase] = di.$inject(nameService);
                            }catch(e){
                                console.log("Trying to inject service %s in the controller %s",nameService,files[i]);
                                throw e;
                            }
                        }
                    }
                }
            }
        });
        return self;
    };
    self.error = function(res,error){
        console.log(error);
        res.render(self.config.views.path+"/error/505.html");
    };
    self.listen = function(){
        self.app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
          console.log("#....................................#");
          console.log("#....................................#");
          console.log("#....................................#");
          console.log("#.....Starting micro framework.......#");
          console.log("#....................................#");
          console.log("#....................................#");
          console.log("#....................................#");
          console.log("#...........by caltras@gmail.com.....#");
        });
    };
    return self._init();
};
module.exports = Main;