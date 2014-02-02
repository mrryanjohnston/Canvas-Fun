var cardsServices = angular.module('cardsServices', []);

/* Authentication Service */
cardsServices.service('authentication', function($scope){
    $scope.loggedin = false;

    $scope.login = function(){
        $scope.loggedin = true;
    }

    $scope.logout = function(){
        $scope.loggedin = false;
    }

    $scope.isAuthenticated = function(){
        return $scope.loggedin;
    }

    $scope.$on("$routeChangeSuccess", function(current) {
        var authRequired = $route.current && $route.current.$route && $route.current.$route.authentication;
        if (authRequired && !signedIn.isSignedIn()){
            console.log("Auth required for the requested URL.");
            var currentUrl = $location.url();
            //$location.url("/#/signin?redirect_url=" + encodeURIComponent(currentUrl));
        }   
    }); 
});
