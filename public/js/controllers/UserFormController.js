// App designed by Matthew Hamann, matt.hamann1982@gmail.com


app.controller('UserFormController', ['$scope', '$state', '$store', 'UserFactory', 
	function UserFormController($scope, $state, $store, UserFactory) {
		console.log("Hi!!");
		$scope.submit = function(user){
			UserFactory.setInfo(user);
			$state.go('user.chat');
		};
	}]);