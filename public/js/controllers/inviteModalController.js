app.controller('inviteModalController', [ '$state', '$scope', 'socket',  'ModalService', 'UService', 'JService',
	function inviteModalController($state,  $scope,  socket, ModalService, UService, JService) {

			socket.on('comeJoinRoom', function(data){
//				$scope.$digest();
				console.log(data);

				UService.setU(data.doc);

				executeModal();

				function executeModal(){	
					return ModalService.showModal({
						templateUrl: "partials/doctor/docInfoModal.html",
						controller: "YesNoController"
					}).then(function(modal){
						modal.element.modal();
						modal.close.then(function(result){
							if (result === true) {
								console.log(result);
								socket.emit('confirmRoomCheck',{room: data.roomID});
								socket.on('personInRoom', function(data){
									if (data.res === true){
										$state.go('doctor.chat');
										JService.setJ(data);
									} else {
										delete data;
										return;
									}
								});
							} else { 
								socket.emit('sendExitNotice', { room: data.roomID });
								delete data;
								return; 
							}
							

						});
					});
				} 
			});
	}]);