angular.module('app', ['ionic','starter.controllers'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('page3', {
      url: '',
      templateUrl: 'partials/page3.html',
      controller: 'homeCtl'
    })
    .state('page4', {
      url: '/signup',
      templateUrl: 'partials/page4.html',
      controller: 'signupCtl'
    })
    
    .state('page5', {
      url: '/login',
      templateUrl: 'partials/page5.html',
      controller: 'loginCtl'
    })
    
    .state('page6', {
      url: '/homePage',
      templateUrl: 'partials/page6.html',
      controller: 'homepageCtrl'     
    });

  // if none of the above states are matched, use this as the fallback  
  $urlRouterProvider.otherwise('/login');  

})
.factory('userService', ['$rootScope', '$state','$http','$location', '$localstorage', function($rootScope, $state, $http, $location, $localstorage) {
  // Hello.js Functions
  hello.init({ 
    // replace this with your own Facebook App ID
    facebook : '592974850759811'
  }, {
    redirect_uri:'http://localhost:1337/#/login'
    }
  );
  var service = {
    isLoggedIn: function() {
      return $rootScope.userStatus;
    },
    login: function() {
      hello('facebook').login( function() {
        hello( 'facebook' ).api( '/me' ).success(function(response) {

            $http.post('/auth/register', {
              name: response.first_name,
              email: response.email,
              profileId: response.id,
              type : 'facebook'
            })
            .success(function(response) {
              var nowDate = new Date();
              nowDate.setDate(nowDate.getDate() + 7); 
              var object = {user: response, timestamp: nowDate};
              $localstorage.setObject('user', object);
              //window.localStorage['user'] = JSON.stringify(user);
              $location.path('/homePage');
            })
            .error(function(error) {
              $scope.error = error.message;
            });
         
        })
         .error(function(){
            $scope.error = error.message;
        });
      });     
    },
    logout: function() {
      hello('facebook').logout( function() {
      });
      $http.post('/auth/logout')
      .success(function(response) {
          $localstorage.removeObject('user');
          $location.path('/login');
      })
      .error(function(error) {
        $scope.error = error.message;
      });
    }
  }
  return service;
}])
.factory('$localstorage', ['$window', function($window) {
  return {
    removeObject: function(key) {
      $window.localStorage[key] = '';
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return $window.localStorage[key];
    },
    expiryTime: function(object) {
      var expirtyTime = JSON.parse(object);
      if(new Date().toISOString() > expirtyTime.timestamp) {
        return false;
      }else {
        return true;
      }

    }
  }
}]);

