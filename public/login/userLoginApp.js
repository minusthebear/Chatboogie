var userlogin = angular.module('userlogin', ['ngResource', 'ui.router', 'ui.bootstrap', 'ngCookies', 'satellizer']);

userlogin.config(function($stateProvider, $locationProvider, $authProvider){
	$locationProvider.html5Mode(true);
});

userlogin.controller('mainCtrl', function($scope, $rootScope, $http, $auth) {
	$scope.isAuthenticated = function(){
		return $auth.isAuthenticated();
	};

});