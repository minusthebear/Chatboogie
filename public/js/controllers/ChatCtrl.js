// App designed by Matthew Hamann, matt.hamann1982@gmail.com


app.controller('ChatCtrl', ['$scope', '$state', 'socket', '$store', '$timeout', 'UserFactory',
	function ($scope, $state, socket, $store, $timeout, UserFactory) {
			console.log("Testing");

			var data = UserFactory.getInfo();			
			socket.emit('peopleJoinServer', data);

			$scope.msgs = [];

			$scope.username = null;
			$scope.room = null;
			$scope.socketID = null;	

			socket.on('comeJoinRoom', function(x){
				console.log(x);
				socket.emit('joinRoom', x);
			});

			socket.on('individual', function(x){
				console.log(x);
				$scope.username = x.name;
				$scope.room = x.room;
				$scope.socketID = x.socketID;
				UserFactory.setName($scope.username);
				UserFactory.setRoom($scope.room);
			});


			socket.on('sendMsg', function(message) {
				console.log("Socket received sendMsg");
				$scope.msgs.push({
					id: message.id,
					user: message.user,
					name: message.name,
					text: message.text,
					room: message.room
				});
				console.log("This gets read");
			});
			
			socket.on('update', function(message) {
				console.log(message);
				$scope.msgs.push({
					id: message.id,
					user: message.user,
					name: message.name,
					text: message.text,
					room: message.room
				});
			});

			socket.on('commenceExit', function(message) {
				console.log("EXIT");
				$scope.msgs.push({
					id: message.id,
					sock: message.sock,
					user: message.user,
					name: message.name,				
					text: message.text,
					room: message.room
				});
				$timeout(function(){
					console.log($scope.username);
					$state.go('user');
				}, 3000);
			});		

			$scope.sendMsg = function() {
				socket.emit('sendMsg', {
					id: $scope.socketID,
					user: $scope.username,
					name: $scope.username,
					text: $scope.chat.msg,
					type: "user",
					room: $scope.room
				});
				$scope.chat.msg = '';
				console.log("Sending off message");
			};

			socket.on('failMsg', function(message) {
				$scope.msgs.push({
					user: message.user,
					text: message.text
				});
			});

			$scope.leaveRoom = function() {
				socket.emit('leaveRoom', {});
			};
			
			socket.on('testing', function(x){
				console.log(x);
			});

		$scope.$on('$destroy', function (event) {
		    socket.removeListener('sendMsg');
		    socket.removeListener('createRoom');
		    socket.removeListener('leaveRoom');
		    socket.removeListener('enterRoom');
		    socket.removeListener('joinRoom');
		    socket.removeListener('individual');
		    socket.removeListener('update');
		    socket.removeListener('commenceExit');
		    socket.removeListener('comeJoinRoom');		    
		});
	}]);
