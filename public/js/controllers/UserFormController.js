app.controller('UserFormController', ['$scope', '$state', '$store', 'UserFactory', 
	function UserFormController($scope, $state, $store, UserFactory) {
		console.log("Hi!!");
		$scope.submit = function(user){
			UserFactory.setInfo(user);
			$state.go('user.chat');
		};
	}]);