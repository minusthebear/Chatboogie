// This will be changed, and a service will be added later

app.controller('CreateRoom', ['$scope', '$log', '$location', '$http', 'socket',
	function ($scope, $log, $location, $http, socket) {
		
		$scope.createRoom = function(NamingRoom) {
			var roomExists = false;
			var roomName = NamingRoom.name;		

			
			socket.emit("check", roomName, function(data) {
				roomExists = data.result;
				if (roomExists) {
					return false;
				} else {      
					if (roomName.length > 0) { //also check for roomname
					
						socket.emit('createRoom', {
							name: roomName
						});	
				  
					} else { return false; }
				}
			});			
		};
	}]);
