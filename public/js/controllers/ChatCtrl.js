app.controller('ChatCtrl', 
	function ($scope, $log, socket, loginService) {
		$scope.PersonA = loginService.personValue;
		
		$log.log(loginService.personValue);
		
//		$scope.DoctorA = loginService.doctorValue();
	
		$scope.msgs = [];

		$scope.sendMsg = function() {
			socket.emit('send msg', $scope.chat.msg);
			$scope.chat.msg = '';
		};


		socket.on('get msg', function(data) {
			$scope.msgs.push(data);
			$scope.$digest();
		});
	});
