app.controller('DoctorFormController', ['$store', '$http', '$scope', '$state', '$window', 'doctorFactory',
	function DoctorFormController($store, $http, $scope, $state, $window, doctorFactory) {
		$scope.informationReceived = true;

		if (doctorFactory.getNotice()){
			$scope.notice = doctorFactory.getNotice();
			$scope.informationReceived = false;
		}
	
		$scope.doc = {};

		$scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
		$scope.vldname = /^[A-Za-z.\\,\\s]*$/;
		$scope.vlduni = /^[A-Za-z0-9_. \\,\\s]*$/;
		$scope.vldtxt = /^[A-Za-z0-9_. \\,\\!\\?\\s\\-\\'\\"\\$\\(\\)\\:\\&\\@]*$/;

		var id = $store.get('doctor_id');
		$scope.checkCheckboxes = function(d){
			if (d === undefined) return false;
			return Object.keys(d).some(function(key){
				return d[key];
			});
		}

		$scope.submit = function(doc){
			console.log(doc);
			return $http.post('/addDoctorInfo', {id: id, doc: doc}).then(function(res){
			 	if (res){
			 		console.log(res.data);
//			 		$state.go('doctor.main');
			 		$store.remove('importantData');
			 		$store.set('importantData', true);
			 		$window.location.href = '/doctor';
			 	}
			}).catch(function(err){
			 	console.log(err);
			});
		};
	}]);