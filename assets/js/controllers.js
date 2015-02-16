angular.module('starter.controllers', [])
.controller('homeCtl',['$scope', '$localstorage', function($scope, $localstorage) {
  $scope.getuser = function() {

  var user = JSON.parse($localstorage.getObject('user'));
  $scope.userName = user.user.name;
  // console.log('Here I am ',user.user.name);

  }

}])
  .controller('signupCtl',['$scope', 'userService', '$localstorage', '$http', '$location', function($scope, userService, $localstorage, $http, $location) {
      var checkUser = $localstorage.getObject('user');  
      if(checkUser) {
          $location.path('/homePage');
        }
    $scope.user = {};
    $scope.signup = function() {
      $http.post('/auth/register', {
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          type: 'app'
        })
        .success(function(response) {
          var nowDate = new Date();
          nowDate.setDate(nowDate.getDate() + 7); 
          var object = {user: response, timestamp: nowDate};
          $localstorage.setObject('user', object);
          $location.path('/homePage');
        })
        .error(function(error) {
          $scope.error = error.message;
          //hide response message
          setTimeout(function () {
            $scope.error = '';
            $scope.$apply();
            }, 2000);
        });
    };
      $scope.signupFacebook = userService.login;
  }])

.controller('loginCtl', ['$scope', 'userService', '$localstorage', '$http', '$location', function($scope, userService, $localstorage, $http, $location) {
  var checkUser = $localstorage.getObject('user');  
  if(checkUser) {
      $location.path('/homePage');
    }
  $scope.user={};
  $scope.login = function(){
    $http.post('/auth/login',{ 
      email: $scope.user.email,
      password: $scope.user.password, 
    })
    .success(function(response){
          var nowDate = new Date();
          nowDate.setDate(nowDate.getDate() + 7); 
          var object = {user: response.auth, timestamp: nowDate};
          $localstorage.setObject('user', object);
          $location.path('/homePage');
    })
    .error(function(errorResponse){ 
        $scope.error = errorResponse.error;
        //hide response message
        setTimeout(function () {
          $scope.error = '';
          $scope.$apply();
          }, 2000);
    });
  };
  
  $scope.loginFacebook = userService.login;

}])
.controller('homepageCtrl',['$scope', 'userService', '$localstorage', '$location',  function($scope, userService, $localstorage, $location) {
    var checkUser = $localstorage.getObject('user');    
    if(!checkUser || checkUser === null) {
      $location.path('/login');
    }else{
        var checkExpiryTime = $localstorage.expiryTime(checkUser);
        if(!checkExpiryTime) {
          $location.path('/login');      
        }
    }
    $scope.logout = userService.logout;
}]);


