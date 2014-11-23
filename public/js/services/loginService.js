app.factory('loginService', function() {
	var personValue = {
		name: '',
		symptoms: ''
	};
	var doctorValue = {
		
	};
	
	return {
		signIn: function(doctor) {
			return doctorValue;
		},
		peopleJoinChat: function(person) {
			personValue.name = person.name;
			personValue.symptoms = person.symptoms;
			return personValue;
		}
	};
});



//app.factory('loginService', function($scope) {
	//var personValue = {
		//name: $scope.person.name,
		//symptoms: $scope.person.symptoms
	//};
	//var doctorValue = {
		//name: $scope.doctor.name,
		//qualification: $scope.doctor.qualification,
		//password: $scope.doctor.password
	//};
	
	//return {
		//signIn: function() {
			//return doctorValue;
		//},
		//peopleJoinChat: function() {
			//return personValue;
		//}
	//};
//});
