app.controller('RoomListCtrl', ['$scope', 'socket', 
	function ($scope, socket) {
		
		
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
