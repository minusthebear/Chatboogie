// UService and YesNoController also on this page.

app.controller('ChatUsersAvailable', ['$scope', '$state', '$store', 'socket', '$timeout', 'ModalService', 'UService', 'doctorFactory',
	function ($scope, $state, $store, socket, $timeout, ModalService, UService, doctorFactory) {
		$scope.usersAvailable = false;


		socket.emit('getPeopleList', {});

		socket.on("updatePeople", function(data) {
			$scope.people = data.people;
			if (data.count > 0){
				$scope.usersAvailable = true;
			} else {
				$scope.usersAvailable = false;
			}
			$scope.count = data.count;	
		});

		$scope.info = function(user){
			console.log(user);
			UService.setU(user);
//			var data = doctorFactory.getSendDataInfo();
			ModalService.showModal({
				templateUrl: "partials/doctor/userInfoModal.html",
				controller: "YesNoController"
			}).then(function(modal){
				modal.element.modal();
				modal.close.then(function(result){
					if (result === true) {
						socket.emit('fieldCheck',{doc: $store.get('fullName'), field: user.field});
						socket.on('fieldResponse', function(res){
							if (res.msg === true){ 
								$state.go('doctor.chat');
								UService.setU(user);
							} else {
								console.log("You are not qualified to speak about this issue.");
							}

						});
					}
					else { return; }
				});
			});
		};
	}]);



