app.controller('RoomListCtrl', ['$scope', '$log', 'socket', 
	function ($scope, $log, socket) {
		socket.on("roomList", function(data) {
			$scope.rooms = data.rooms;
			$scope.count = data.count;			
			$scope.$digest();
		});
	}]);
