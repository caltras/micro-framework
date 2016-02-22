(function(application){
    "use strict";
    
    var RootController = function($rootScope,$scope){
        $rootScope.titleApp = "Portal Exames";        
    };
    
    RootController.$inject = ['$rootScope','$scope'];
    application.controller("rootCtrl", RootController);
    
})(application);