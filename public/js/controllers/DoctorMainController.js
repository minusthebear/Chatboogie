app.controller('DoctorMainController', ['$state', '$store', '$scope', '$window', 'socket', 'doctorFactory', 'logoutFactory', 'ModalService', 'UService', 'JService', 
	function DoctorMainController($state, $store, $scope, $window, socket, doctorFactory, logoutFactory, ModalService, UService, JService) {

		$scope.$watch('$viewContentLoaded', function(){
//			socket.removeAllListeners();
		});

		$scope.info = null;
		var id, authorization;

		$scope.disconnect = function(){
			console.log("Clicked!");
			var landingUrl = "http://" + $window.location.host + "/frontPage";
			$window.location.href = landingUrl;
			logoutFactory.logout();
		};

		$scope.informationReceived = false;

		$scope.testing = "Hey there!!!";


		function dataFunc(user) {
			var fullName;
			if (user.lastname === null || user.firstName === null){
				fullName = null;
			} else {
				fullName = user.lastName + '_' + user.firstName;
			}
			$store.set('fullName', fullName); 
			return {
				fullName: fullName,
				firstName: user.firstName,
				lastName: user.lastName,
				middleName: user.middleName,
				email: user.email,
				fields: user.fields,
				university: user.university,
				work: user.work,
				id: id,
				authorization: authorization
			};
		}	

		function allInfo(){
			var info = doctorFactory.getData();
			$scope.info = info;
			var dataToSend = dataFunc(info);
			doctorFactory.setSendDataInfo(dataToSend);
			$scope.informationReceived = true;
			socket.emit('doctorsJoinServer', dataToSend);
			console.log(id);
		}

		if (!($store.get('token'))) {
			id = $store.set('doctor_id', window.idNumber);
			$store.set('token', window.token);
			authorization = $store.set('authorization', window.authorization);
			$store.set('username', window.username);

		} else {
			id = $store.get('doctor_id');
			authorization = $store.get('authorization');
			$store.get('username');		
		}
		var id = $store.get('doctor_id');

		if (($store.get('importantData') === true) && ($store.get('firstName') != (null || undefined))) {
			allInfo();
		} else { 
			doctorFactory.removeData();
			return doctorFactory.findDoctor(id).then(function(res){
				if (res.success === true){
					doctorFactory.getDoctorInfo(id).then(function(res){
						if (res === true) {
							allInfo();
						}
					}).catch(function(err){
						console.log(err);
					});
				} else {
					$store.set('importantData', false);
					$scope.info = null;
				}
			}).catch(function(err){
				console.log(err);
			});
		}


	}]);

app.service('JService', function () {
	var j = {};
    
    return {
    	getJ: function () {
    		return j;
    	},
        setJ: function(value) {
             j = value;
        }
    };
});

app.controller('YesNoController', ['$scope', 'close', 'UService', function($scope, close, UService) {

	$scope.user = UService.getU();
	
	console.log("YesNoController");
	console.log($scope.user);

  	$scope.close = function(result) {
  	  //delete $scope.user;
 	  close(result, 500); // close, but give 500ms for bootstrap to animate
	  $scope.user = null;
	};

}]);

app.service('UService', function () {
	var user = {};
    
    return {
    	getU: function () {
    		return user;
    	},
        setU: function(value) {
             user = value;
        }
    };
});

app.service('RService', function () {
	var room = {};
    
    return {
    	getR: function () {
    		return room;
    	},
        setR: function(value) {
             room = value;
        }
    };
});