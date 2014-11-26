app.controller('DoctorJoinChat', ['$scope', '$location', '$http', 'doctorService',
	function DoctorJoinChat($scope, $location, $http, doctorService) {
		$scope.signin = function(doctor) {
			$location.url('/chat-page');
			doctorService.setDoctor(doctor);
		};
	}]);
