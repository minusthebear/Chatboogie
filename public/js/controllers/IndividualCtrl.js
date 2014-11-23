app.controller('ChatCtrl', 
	function relevamtData($scope, loginService) {
		$scope.PersonA = loginService.getPerson;
		
		$scope.DoctorA = loginService.getDoctor;
	
		
	});
