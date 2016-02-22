var FirebaseData = require("../data/FirebaseData");
module.exports = {
    hello : function(){
        var db =FirebaseData.getInstance("app");
        return db.once("value");
    }
};