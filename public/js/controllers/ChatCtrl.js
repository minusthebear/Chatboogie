app.controller('ChatCtrl', ['$scope', '$log', 'socket', 'personService', 'doctorService', 
	function ($scope, $log, socket, personService, doctorService) {
		
		$scope.person = personService.getPerson();

		$scope.doctor = doctorService.getDoctor();
		
		$scope.msgs = [];

		socket.emit('people-join-server', {
			user: $scope.person.name,
			symptoms: $scope.person.symptoms
		});

		socket.on("update-people", function(data) {

			//var i, user;
			////			$log.log([data.people].length);
			//newData = [data.people];
			////			$log.log((newData).length);
			////			$log.log($scope.person.name);
			//for (i = 0; i < newData.length; i++) {
			////				$log.log(newData[i]);
				//user = newData[i];
				//if (user.user === $scope.person.name) {
					//newData.splice(i, 1);
				//}
				//return newData;
			//}
			//$scope.people = newData;
			$scope.people = data.people;
			$scope.count = data.count;				
			$scope.$digest();
		});

		socket.on('send-msg', function(message) {
			$scope.msgs.push({
				user: message.user,
				text: message.text
			});
			$scope.$digest();
		});

		$scope.sendMsg = function() {
			socket.emit('send-msg', {
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
		
		
		
		
/*		
		  socket.on('user-disconnect', function (data) {
			$scope.msgs.push({
			  user: 'chatroom',
			  text: 'User ' + data.people.user + ' has left.'
			});
			var i, ind;
			for (i = 0; i < $scope.people.length; i++) {
			  ind = $scope.people[i].user;
			  if (ind === data.people.user) {
				$scope.people.splice(i, 1);
				break;
			  }
			}
		  });
*/

	}]);
