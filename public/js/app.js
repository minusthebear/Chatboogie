var app = angular.module('app', ['ngResource', 'ngRoute'])
	.config(function($routeProvider, $locationProvider) {

		$routeProvider.when('/login-page', 
			{ 
				templateUrl: '/partials/login-page.html', 
				controller: 'JoinChat' 
			})
			.when('/doctor-login', { 
				templateUrl: '/partials/doctor-login.html', 
				controller: 'DoctorJoinChat' 
			})
			.when('/chat-page', {
				templateUrl: '/partials/chat-page.html', 
				controller: 'ChatCtrl' 				
			}).otherwise({ 
				redirectTo: '/login-page'
			});  
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: true
		}); 

	});
	
app.factory('socket', function () {
	return io.connect('http://localhost:3000');

//  var socket = io.connect('http://localhost:3000');
/*  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  }; */
});



app.controller('mainCtrl', function($scope) {
	$scope.myVar = "It is working.";
});
