app.controller('DoctorListCtrl', ['$scope', 'socket', 'doctorService', 
	function ($scope, socket, doctorService) {
		socket.emit('initialUpdate', {
			id: "D"
		});
		socket.emit('getPeopleList', {});

		$scope.doctor = doctorService.getDoctor();

		socket.on('individual', function(data){
			console.log(data);
			console.log(data.ind.type);
			if(data.ind.type == "doctors"){
				$scope.ind = data.ind;
			}
		});


		socket.on("updateDoctors", function(data) {
			console.log("Running through update doctors");
			console.log(data);
			$scope.doctors = data.doctors;
			$scope.docCount = data.count;
			$scope.doctorsUsed = data.names;				
			$scope.$digest();
		});
	}]);
