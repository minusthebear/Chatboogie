
var socket = io.connect('http://localhost:3000');

console.log('This here ' + socket);

app.controller('ChatCtrl', function($scope, socket) {
	console.log("Hello");
	$scope.msgs = []

	$scope.sendMsg = function() {
		socket.emit('send msg', $scope.msg.text);
		$scope.msg.text = '';
		console.log("okay");
	};

	socket.on('get msg', function(data) {
		$scope.msgs.push(data);
		$scope.$digest();
		console.log("Here you are");
	});
});
