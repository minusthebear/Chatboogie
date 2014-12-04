app.controller('ChatCtrl', ['$scope', '$log', 'socket', 'personService', 'doctorService', 'IDService',
	function ($scope, $log, socket, personService, doctorService, IDService) {
		
		$scope.msgs = [];		
		$scope.ID = IDService.getID();

		if ($scope.ID == "doctor") {
			$scope.person = doctorService.getDoctor();			
		} else if ($scope.ID == "person") {
			$scope.person = personService.getPerson();
		}

		socket.on('sendMsg', function(message) {
			$scope.msgs.push({
				user: message.user,
				text: message.text
			});
			$scope.$digest();
		});
		
		socket.on('update', function(message) {
			$scope.msgs.push({
				user: message.user,
				text: message.text
			});
			$scope.$digest();
		});

		$scope.sendMsg = function() {
			
			socket.emit('sendMsg', {
				user: $scope.person.name,
				message: $scope.chat.msg
			});
			//add the message to our model locally
			$scope.msgs.push({
				user: $scope.person.name,
				text: $scope.chat.msg
			});
			$scope.chat.msg = '';
		};

		$scope.leaveRoom = function() {
			socket.emit('leaveRoom', {});
		};
		

	}]);
