app.controller('JoinChat', ['$scope', '$location', '$http', 'socket', 'personService', 
	function JoinChat($scope, $location, $http, socket, personService) {
		$scope.peopleJoinChat = function(person) {
			$location.url('/chat-page');
			personService.setPerson(person);


		};
	}]);
