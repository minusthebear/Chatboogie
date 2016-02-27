// This will be changed, and a service will be added later

app.controller('CreateRoom', ['$scope', 'socket',
	function ($scope, socket) {
		
		$scope.createRoom = function(NamingRoom) {
			var roomExists = false;
			var roomName = NamingRoom.name;		
			console.log(roomName);
			
			socket.emit("check", roomName, function(data) {
				console.log(data);
				roomExists = data.result;
				if (roomExists) {
					return false;
				} else {
					console.log("It worked");      
					if (roomName.length > 0) { //also check for roomname
					
						socket.emit('createRoom', {
							name: roomName
						});	
				  
					} else { return false; }
				}
			});			
		};
	}]);
