var cardsApp = angular.module('cardsApp', ['ngRoute','cardsControllers']);

/* Use to focus on a specific element*/
cardsApp.directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '@focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === "true") { 
                    $timeout(function() {
                        element[0].focus(); 
                    });
                }
            });
        }
    };
});

cardsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            authentication: false,
            templateUrl: 'partials/about.html',
            controller: 'user'
        }).
        when('/signup', {
            authentication: false,
            templateUrl: 'partials/signup.html',
            controller: 'user'
        }).
        otherwise({
            redirectTo: '/'
        })
        /*.
        run($scope.$on("$routeChangeStart", function(event, next, current){
            var authRequired = $route.current && $route.current.$route && $route.current.$route.authentication;
            if (authRequired && !authentication.loggedin === false){
                console.log("Auth required for the requested URL.");
                var currentUrl = $location.url();
                //$location.url("/#/signin?redirect_url=" + encodeURIComponent(currentUrl));
            }
        }));
        */;
    }
]);
