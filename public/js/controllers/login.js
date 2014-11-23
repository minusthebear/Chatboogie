app.controller('PeopleController', function($scope){
	$scope.person = {
		name: '',
		symptoms: ''
	};
});

app.controller('DoctorController', function($scope){
	$scope.doctor = {
		name: '',
		qualification: '',
		password: ''
	};
});
