app.controller('RoomListCtrl', ['$scope', '$log', '$location', 'socket', 
	function ($scope, $log, $location, socket) {
		
		
		socket.on("roomList", function(data) {
			$scope.rooms = data.rooms;
			$scope.count = data.count;			
			$scope.$digest();
		});

		$scope.joinRoom = function(room) {
			socket.emit("joinRoom", room.id);	
		};
		
		$scope.leaveRoom = function(room) {
			socket.emit("leaveRoom", room.id);
		};
	}]);
