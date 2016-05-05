// App designed by Matthew Hamann, matt.hamann1982@gmail.com

app.controller('DoctorChatCtrl', ['$scope', '$state', 'socket', '$store', '$timeout', 'doctorFactory', 'UService', 'JService', 'RService', 'logoutFactory',
	function ($scope, $state, socket, $store, $timeout, doctorFactory, UService, JService, RService, logoutFactory) {

		$scope.leave = function(e){
			e.preventDefault();
			socket.emit('leaveRoom', {user: $scope.username, room: $scope.roomID});
			$state.go('doctor.main');

			console.log($scope.roomID);
		};

		var data,
			u = UService.getU(),
			J = JService.getJ();

		$scope.roomID = null;
		$scope.socketID = null;		
		$scope.username = null;
		$scope.msgs = [];
		$scope.officialName = null;
		$scope.ID = null;	

		if ((Object.keys(u).length > 0) && (!(Object.keys(J).length > 0) || J === null)) {
			data = doctorFactory.getSendDataInfo();
			socket.emit('createRoom', {data: data, user: u});
			$scope.username = data.fullName;
			$scope.officialName = "Dr. " + data.lastName;
			UService.setU({});
		}

		if (Object.keys(J).length > 0){
			data = J;
			socket.emit('joinRoom', {data: data.data, roomID: data.roomID, doc: data.doc});
			JService.setJ({});
		}

		socket.emit('getPeopleList', {});
		socket.on('serverSideTest', function(x){
			console.log(x);
		});
	

		socket.on('enterRoom', function(data){
			console.log("ENTERED ROOM");
			var d = data.data;
			$scope.username = d.data.fullName;
			$scope.roomID = d.roomID;
			$scope.socketID = d.data.socketID;
			$scope.officialName = "Dr. " + d.data.lastName;
			$scope.ID = d.data.id;
			RService.setR(d.roomID);
		});

		socket.on('individual', function(data){
			$scope.roomID = data.room;
			$scope.socketID = data.socketID;
			$scope.ID = data.id;
		});

		socket.on('sendMsg', function(message) {
			$scope.msgs.push({
				id: message.id,
				sock: message.sock,
				user: message.user,
				name: message.name,
				text: message.text,
				room: message.room
			});
			console.log("This gets read");
//			$scope.$digest();
		});
		
		socket.on('update', function(message) {

			$scope.msgs.push({
				id: message.id,
				sock: message.sock,
				user: message.user,
				name: message.name,				
				text: message.text,
				room: message.room
			});
//			  $scope.$digest();
		});

		socket.on('commenceExit', function(message) {
			var name = $store.get('fullName');
			$scope.msgs.push({
				id: message.id,
				sock: message.sock,
				user: message.user,
				name: message.name,				
				text: message.text,
				room: message.room
			});
			//  $scope.$digest();
			$timeout(function(){
				socket.emit('forceLeaveRoom', {user: name, room: $scope.roomID });		
				$state.go('doctor.main');
			}, 3000);	
		});

		$scope.sendMsg = function() {
			socket.emit('sendMsg', {
				id: $scope.ID,
				sock: $scope.socketID,
				user: $scope.username,
				name: $scope.officialName,
				text: $scope.chat.msg,
				type: "doctor",
				room: $scope.roomID
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
			socket.emit('leaveRoom', { room: $scope.roomID });
		};

		$scope.$on('$destroy', function (event) {
		    socket.removeListener('sendMsg');
		    socket.removeListener('createRoom');
		    socket.removeListener('leaveRoom');
		    socket.removeListener('enterRoom');
		    socket.removeListener('joinRoom');
		    socket.removeListener('individual');
		    socket.removeListener('update');
		    socket.removeListener('commenceExit');
		    socket.removeListener('forceLeaveRoom');		    
		});

	}]);
