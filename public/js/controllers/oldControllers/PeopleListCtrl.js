app.controller('PeopleListCtrl', ['$scope', 'socket', 'personService', 
	function ($scope, socket, personService) {
		socket.emit('initialUpdate', {
			id: "P"
		});
		socket.emit('getPeopleList', {});

		$scope.person = personService.getPerson();
		
		socket.on('individual', function(data){
			console.log(data);
			console.log(data.ind.type);
			if(data.ind.type == "people"){
				$scope.ind = data.ind;
			}
		});

		socket.on("updatePeople", function(data) {
			console.log(data);
			$scope.people = data.people;
			$scope.count = data.count;
			$scope.namesUsed = data.names;				
			$scope.$digest();
		});
	}]);
