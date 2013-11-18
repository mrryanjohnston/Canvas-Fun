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
            templateUrl: 'partials/about.html',
            controller: 'user'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'user'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);
