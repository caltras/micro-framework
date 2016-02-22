var util = require("util");
//var DataInterface = require("./Data");
var Firebase = require("firebase");
/*var FirebaseData = function(){
};
FirebaseData = util.inherits(FirebaseData,DataInterface);*/
var FirebaseData = function(){};
FirebaseData = (function(config){
    var self = this;
    FirebaseData.config = config;
    return self;
});

FirebaseData.datasources = {};
FirebaseData.createConnection = function(){
    return new Firebase(FirebaseData.config.url);
};
FirebaseData.getInstance = function(ds){
    var dtSource = null;
    if(!FirebaseData.datasources.hasOwnProperty(ds)){
        FirebaseData.datasources[ds] = FirebaseData.createConnection();
    }
    dtSource = FirebaseData.datasources[ds];
    return dtSource;
};

module.exports = FirebaseData;