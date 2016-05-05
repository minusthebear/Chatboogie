// App designed by Matthew Hamann, matt.hamann1982@gmail.com


app.controller('UserMainController', ['$store', '$window',
	function UserMainController($store, $window) {
			
		$store.set('username', window.username);
		$store.set('authorization', window.authorization);		
		console.log("Howdy!!");
	}]);