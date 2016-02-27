var app = angular.module('app', ['ngResource', 'ui.router', 'ui.bootstrap', 'ngCookies', 'satellizer']);
	
app.factory('socket', function () {
	return io.connect('http://localhost:3000');
});



app.controller('mainCtrl', function($scope, $rootScope, $cookies, $log) {
	$scope.myVar = "It is working.";

	//This bit is new
	$log.log("Cookies:");
	$log.log($cookies);
	
	$rootScope.currentUser = $cookies.user || null;
	
    $scope.$parent.user = JSON.parse($rootScope.currentUser);
    console.log($rootScope.currentUser);
});
