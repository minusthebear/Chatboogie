app.controller('DoctorJoinChat', ['$scope', '$location', '$http', 'socket', 'doctorService', 'IDService',
	function DoctorJoinChat($scope, $location, $http, socket, doctorService, IDService) {
		$scope.signin = function(doctor) {
			IDService.setID("doctor");
			doctorService.setDoctor(doctor);
			console.log("doctor signing in...");		
			socket.emit('doctorsJoinServer', {
				user: doctor.name,
				qualification: doctor.qualification,
				password: doctor.password,
				doctors: "doctors",
				owns: null,
				inroom: null
			});
			$location.url('/chat-page');
		};
	}]);
