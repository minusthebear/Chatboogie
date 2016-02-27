app.controller('ChatDocsAvailable', ['$scope', '$state', '$store', 'socket', '$timeout', 'ModalService', 'UService', 'doctorFactory',
	function ($scope, $state, $store, socket, $timeout, ModalService, UService, doctorFactory) {
		$scope.usersAvailable = false;


		socket.emit('getPeopleList', {id: $store.get('doctor_id')});

		socket.on("updateDoctors", function(data) {
			$scope.doctors = data.doctors;
			if (data.count > 0){
				$scope.usersAvailable = true;
			} else {
				$scope.usersAvailable = false;
			}
			$scope.count = data.count;	
			//$scope.$digest();
		});

		$scope.info = function(user){
			if (user.room != null){
				user['message'] = "Dr. " + user.lastName + " is currently chatting with another individual. If you wish to chat with them, we will send them a message upon leaving their current chat room.";
			} 
			console.log("ChatDocsAvailable");
			console.log(user);
			UService.setU(user);

			ModalService.showModal({
				templateUrl: "partials/doctor/docInfoModal.html",
				controller: "YesNoController"
			}).then(function(modal){
				modal.element.modal();
				modal.close.then(function(result){
					socket.emit('testing',{});
					if (result === true) {
						$state.go('doctor.chat', {}, {
							//inherit: false
						});
						UService.setU(user);
					}
					else { return; }
				});
			});
		};
	}]);
