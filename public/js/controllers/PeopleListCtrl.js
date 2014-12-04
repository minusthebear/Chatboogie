app.controller('PeopleListCtrl', ['$scope', '$log', 'socket', 'personService', 
	function ($scope, $log, socket, personService) {
		socket.emit('initialUpdate', {
			id: "P"
		});
		socket.emit('getPeopleList', {});
		
		socket.on("updatePeople", function(data) {
			$scope.people = data.people;
			$scope.count = data.count;
			$scope.namesUsed = data.names;				
			$scope.$digest();
		});
	}]);
