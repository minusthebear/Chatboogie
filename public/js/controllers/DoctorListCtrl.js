app.controller('DoctorListCtrl', ['$scope', '$log', 'socket', 'doctorService', 
	function ($scope, $log, socket, doctorService) {

		$scope.doctor = doctorService.getDoctor();
				
		socket.emit('doctors-join-server', {

			user: $scope.doctor.name,
			qualification: $scope.doctor.qualification,
			password: $scope.doctor.password,
			doctors: "doctors"
		});

		socket.on("update-doctors", function(data) {

			$scope.doctors = data.doctors;
			$scope.docCount = data.count;
			$scope.doctorsUsed = data.names;				
			$scope.$digest();
		});
	}]);
