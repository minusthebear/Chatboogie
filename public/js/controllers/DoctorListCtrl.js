app.controller('DoctorListCtrl', ['$scope', '$log', 'socket', 'doctorService', 
	function ($scope, $log, socket, doctorService) {
		socket.emit('initialUpdate', {
			id: "D"
		});
		socket.emit('getPeopleList', {});

		$scope.doctor = doctorService.getDoctor();

		socket.on("updateDoctors", function(data) {
			$scope.doctors = data.doctors;
			$scope.docCount = data.count;
			$scope.doctorsUsed = data.names;				
			$scope.$digest();
		});
	}]);
