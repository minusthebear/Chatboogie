app.controller('ChatCtrl', ['$scope', '$log', 'socket', 
	function ($scope, $log, socket) {
				
		$scope.msgs = [];



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
	

	}]);
