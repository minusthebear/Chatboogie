app.controller('ChatCtrl', ['$scope', '$log', 'socket', 'personService', 'doctorService',
	function ($scope, $log, socket, personService, doctorService) {
				
		$scope.msgs = [];

		$scope.person = personService.getPerson();
		
		$scope.doctor = doctorService.getDoctor();

		socket.on('send-msg', function(message) {
			$scope.msgs.push({
				user: message.user,
				text: message.text
			});
			$scope.$digest();
		});

		$scope.sendMsg = function() {
			var name;
			if (typeof $scope.person !== undefined) {
				name = $scope.person.name;
			} else if (typeof $scope.doctor !== undefined) {
				name = $scope.doctor.name;
			} else {
				return false;
			}
			
			socket.emit('send-msg', {
				user: name,
				message: $scope.chat.msg
			});
			//add the message to our model locally
			$scope.msgs.push({
				user: name,
				text: $scope.chat.msg
			});
			$scope.chat.msg = '';
		};
	

	}]);
