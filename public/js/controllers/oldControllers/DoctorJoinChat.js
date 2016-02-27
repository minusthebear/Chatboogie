app.controller('DoctorJoinChat', ['$http', '$scope', '$state', 'socket',
	function DoctorJoinChat($http, $scope, $state, socket) {
	


		console.log(response.data);
		IDService.setID("doctor");
		IDService.setSessID(response.data.user);
		doctorService.setDoctor(doctor);
		console.log("doctor signing in...");		
		socket.emit('doctorsJoinServer', info);

		var info = {
			user: doctor.name,
			qualification: doctor.qualification,
			password: doctor.password,
			doctors: "doctors",
			owns: null,
			inroom: null
		};		




		$scope.signin = function(doctor) {
			$auth.login({username: doctor.name, password: doctor.password})
				.then(function(response){
					if(response) {
						$auth.isAuthenticated();
						$state.go('doctor-main');
					} else {
						console.log('failed login');
					}
			});						
		};

	
	}]);
