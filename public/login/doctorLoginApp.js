// var doctorlogin = angular.module('doctorlogin', ['ngResource', 'ui.router', 'ui.bootstrap', 'ngCookies', 'satellizer']);

// doctorlogin.config(function($stateProvider, $locationProvider, $authProvider){
// 	$locationProvider.html5Mode(true);
// });

// doctorlogin.controller('loginCtrl', function($scope, $rootScope, $http, $auth, $store, $window) {
// 	$scope.user;

// 	$scope.signin = function(user) {
// 		console.log(user);
// 		$auth.login({username: user.username, password: user.password})
// 			.then(function(response){
// 				console.log(response);
// 				if(response) {
// 					console.log(response);

// 					$auth.isAuthenticated();
// 					$store.set('doctor_id', response.data.id);
// 					$store.set('authorization', response.data.username);
// 					$store.set('username', response.data.authorization);
// 					$http.get('/redirect').then(function(x){
// 						console.log(x);
// 					}).catch(function(err){
// 						console.log(err);
// 					});
// 				} else {
// 					console.log('failed login');
// 				}
// 			}).catch(function(err){
// 				console.log("There is an error.")
// 			});
// 	};

// 	$scope.isAuthenticated = function(){
// 		return $auth.isAuthenticated();
// 	};

// });