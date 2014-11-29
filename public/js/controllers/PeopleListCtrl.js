app.controller('PeopleListCtrl', ['$scope', '$log', 'socket', 'personService', 
	function ($scope, $log, socket, personService) {
		
		$scope.person = personService.getPerson();

		$log.log($scope.person.name + " person")		

		socket.emit('people-join-server', {
			user: $scope.person.name,
			symptoms: $scope.person.symptoms,
			people: "people"
		});

		socket.on("update-people", function(data) {
			$scope.people = data.people;
			$scope.count = data.count;
			$scope.namesUsed = data.names;				
			$scope.$digest();
		});

	}]);
