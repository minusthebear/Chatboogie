var app = angular.module('app', ['ngResource', 'ngRoute'])
	.config(function($routeProvider, $locationProvider) {

		$routeProvider.when('/login-page', 
			{ 
				templateUrl: '/partials/login-page.html', 
				controller: 'JoinChat' 
			}).when('/chat-page', {
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
	
app.factory('socket', function(){
    return io.connect('http://localhost:3000');
});



app.controller('mainCtrl', function($scope) {
	$scope.myVar = "It is working.";
});
