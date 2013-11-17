var cards = angular.module('cards', []);

cards.directive('focusMe', function($timeout) {
    console.log("focus hit");
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

cards.controller('ui', function ui($scope){
});
