module.exports = {
    welcome: { 
        url :"/",
        controller: function(req, res){
            res.render("site/index.html");
        }
    },
    views : {
        path : "site"
    },
    express : {
        views: "./client/",
        statics: "./client/",
        expressSession : "micro framework"
    },
    login : {
        method : "post", action: "/login/auth", failureRedirect: '/login', successRedirect : "/home/dashboard"
    },
    hasAuthentication : true,
    database : {
        datasources : {
            app : {
                url : "https://portal-exames-dsv.firebaseio.com",
                type : "FirebaseData"
            }
        }
    }
};