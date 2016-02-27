app.controller('DoctorEditController', ['$store', '$http', '$scope', '$state', 'socket', '$window', 'doctorFactory',
	function DoctorEditController($store, $http, $scope, $state, socket, $window, doctorFactory) {
		var info = doctorFactory.getData();

		if (info === false){
			$state.go('doctor.add');
			doctorFactory.setNotice("You have no information to edit. Please fill out your details here.");
		} else {

			$scope.doc = {};
			$scope.info = info;
			console.log($scope.info.firstName);
			$scope.checkboxes = info.fields;
			console.log($scope.checkboxes);

			$scope.pattern = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
			$scope.vldname = /^[A-Za-z., ]*$/
			$scope.vlduni = /^[A-Za-z0-9., ]*$/
			$scope.vldtxt = /^[A-Za-z0-9_. \\,\\!\\?\\s\\-\\'\\"\\$\\(\\)\\:\\&\\@]*$/;

			var id = $store.get('doctor_id');

			$scope.checkIfChecked = function(x){
				for (var i = 0; i < $scope.info.fields.length; i++){
					if (x === $scope.checkboxes[i]){
						return $scope.info.fields[i] = true;
					}
				}
			}

			$scope.checkCheckboxes = function(d){
				if (d === undefined) return false;
				return Object.keys(d).some(function(key){
					return d[key];
				});
			}

			$scope.submit = function(doc){
				var newInfo = {};
				findByMatchingProperties(newInfo, doc, info);
				return $http.post('/editDoctorInfo', {id: id, doc: newInfo}).then(function(res){
					if (res){
						socket.disconnect();
						console.log(res.data);
						doctorFactory.removeData();
						doctorFactory.setData(res);
						$window.location.href = '/doctor';
					}
				}).catch(function(err){
					console.log(err);
				});
			};

			function findByMatchingProperties(newInfo, x, info) {
				var obj = Object.keys(x);

				function isInArray(value, array){
					if (array.indexOf(value) > -1) return true;
				}

				for (var i in info){
					if (isInArray(i, obj)){
						checkData(i, info[i]);					
					} else {
						newInfo[i] = info[i];
					}

				}		

				function checkData(i, j){
					for (var y in x){
						if (i === y){
							checkKeyValue(y, x[y], i, j);
						}
					}
				}

				function checkKeyValue(y, z, i, j){
					if (z == undefined || null){
						newInfo[i] = j; 
					} else if(y === "fields"){
						var abc = {};
						for (var xyz in z){
							if(z[xyz] === true){
								abc[xyz] = true;
							}
						}
						newInfo[y] = abc;
					} else {
						newInfo[i] = z;
					}
				}
			}
		}
	}]);