var application=null;
(function(angular){
    "use strict";
    application = angular.module("webExames",["ngRoute","ngMaterial"]);
    
    application.constant("CONSTANTS",
        {
            "URL_BASE": window.location.href
        });
    application.run(["$rootScope",function($rootScope){
        $rootScope.$on("$routeChangeSuccess", function(currentRoute, previousRoute){
            $rootScope.title = currentRoute.current.title;
        });
    }]);
    application.config(function($routeProvider){
        $routeProvider.when("/",{
            templateUrl: function(params){
                return "/index";
            },
            title : "Portal Exames"
        })
        .otherwise({
            templateUrl: function(params){
                return "/404";
            },
            title : "Portal Exames"
        });
    });
    
    
})(angular);

angular.element(document).ready(function(){
	angular.bootstrap(document,['webExames']);
});