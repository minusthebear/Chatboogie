app.controller('DoctorGetTasksController', ['$store', '$http', '$scope', '$state', '$window', 'doctorFactory', 'dateService',
	function DoctorGetTasksController($store, $http, $scope, $state, $window, doctorFactory, dateService) {
		var id = $store.get('doctor_id'),
			tasks;

		return $http.get('/getTasks/' + id).then(function(res){
			if (res){
				tasks = res.data.arr;
				var d = new Date();
				console.log(tasks);
				var x = dateService.doEquation(tasks, d);

				$scope.tasks = x;
			}
		}).catch(function(err){
			console.log(err);
		});
	}]);