var app = angular.module('app', ['ngResource', 'ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider.when('/login-page', 
			{ 
				templateUrl: '/public/partials/login-page.html', 
				controller: 'JoinChat' 
			}).when('/chat-page',
			{
				templateUrl: '/public/partials/chat-page.html', 
				controller: 'JoinChat' 				
			}).otherwise({ 
				redirectTo: '/login-page'
			});   

	});

app.controller('mainCtrl', function($scope) {
	$scope.myVar = "It is working.";
});
