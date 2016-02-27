app.controller('UserMainController', ['$store', '$window',
	function UserMainController($store, $window) {
			
		$store.set('username', window.username);
		$store.set('authorization', window.authorization);		
		console.log("Howdy!!");
	}]);