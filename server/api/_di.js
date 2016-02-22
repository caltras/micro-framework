module.exports = {
    $inject : function(path) {
        var getUrl = function(path){
            var url = path;
            if(path.toLowerCase().indexOf("service") > -1){
                url = path.replace("service/","").replace(".js","");
                url = "service/"+url;
            }else{
                if(path.toLowerCase().indexOf("controller") > -1){
                    url = path.replace("controller/","").replace(".js","");
                    url = "controller/"+url;
                }
            }
            return url;
        };
        return require("../"+getUrl(path));
    }
};