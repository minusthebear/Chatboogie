app.controller('JoinChat', ['$scope', '$location', '$http', 'socket', 'personService', 'IDService', 
	function JoinChat($scope, $location, $http, socket, personService, IDService) {
		$scope.peopleJoinChat = function(person) {
			IDService.setID("person");
			console.log("person signing in...");
			personService.setPerson(person);
			socket.emit('peopleJoinServer', {
				user: person.name,
				symptoms: person.symptoms,
				people: "people",
				owns: null,
				inroom: null
			});
			$location.url('/chat-page');
		};
	}]);
