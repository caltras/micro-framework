var HomeController = (function(){
    return {
        "services"          : ["HomeService"],
        "authenticate"      : true,
        "authenticateAll"   : true,
        "get" : {
            "index": [function(req,res){
                res.render("site/index.html");
            }],
            "dashboard": [true, function(req, res){
                var homeService = HomeController.homeService;
                homeService.hello().then(function(snapshot){
                    res.json(snapshot.val());
                },function(error){
                    HomeController.app.error(res,error);
                });
            }]
        }
    };
})();
module.exports = HomeController;