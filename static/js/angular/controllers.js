var cardsControllers = angular.module('cardsControllers', []);

/* User controller */
cardsControllers.controller('user', ['$scope', '$routeParams', '$location','$http', function user($scope,$routeParams,$location,$http){

    $scope.signupUserName = '';
    $scope.signupUserPassword = '';
    $scope.signupUserEmail = '';
    $scope.loggedIn = false;

    $scope.login = function(){
        $scope.loggedIn = true;
    }

    $scope.logout = function(){
        $scope.loggedIn = false;
    }

    $scope.signup = function(){
        $http.post("/signup",{
            email:$scope.signupUserEmail,
            password:$scope.signupUserPassword,
            username:$scope.signupUserName
        }).success(function(){
            //$location.path('/');
            $scope.message.push({
                datetime:new Date(),
                type:'success',
                message:'You\'re signed up!'
            });
        }).error(function(){
            console.log("failure");
            $scope.message.push({
                datetime:new Date(),
                type:'failure',
                message:'There was an error signing up! Please try again '
        });
        // Send ajax request to /signup
        // if 200 then save the cookie
        // $cookies[responseKey] = response;
        });
    }

    /* Redirect unauthenticated users to a login form */
    $scope.$watch(function() { return $location.path(); }, function(newValue, oldValue){
        if($scope.loggedIn === false && (!(newValue in {'/signup':true,'/':true}))){  
            $location.path('/');
        }
    });

}]);

/* Play controller */
cardsControllers.controller('play', ['$scope', '$routeParams',
    function play($scope,$routeParams){
}]);
