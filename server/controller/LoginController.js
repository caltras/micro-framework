module.exports = {
    "services" : [],
    "get" : {
        "/": function(req, res){
            res.render("site/login.html");
        },
    },
    "post" : {
        "/auth" : {}
    }
};