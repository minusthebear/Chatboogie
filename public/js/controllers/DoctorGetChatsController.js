app.controller('DoctorGetChatsController', ['$store', '$http', '$scope', '$state', '$window', 'doctorFactory', 'dateService',
	function DoctorGetChatsController($store, $http, $scope, $state, $window, doctorFactory, dateService) {
		$scope.chats = [];
		var chats = [];
		var v = {};
		var id = $store.get('doctor_id');
		var d = new Date();

		$scope.limit = 10;

		doctorFactory.getChatRooms(id).then(function(x){
			console.log(x);
			for (var i in x){
				chats[i] = { partner: x[i] }
			}
			var x = dateService.doEquation(chats, d);
			$scope.chats = x;
		}).catch(function(err){
			console.log(err);
		});

		$scope.ind = function(key, value){
			doctorFactory.setValue(value);
			$state.go('doctor.each', {'chat': key});			
		};

		$scope.increaseLimit = function(){
			$scope.limit = ($scope.limit + 10);
		};
	}]);

app.controller('DoctorIndChatController', ['$state', '$store', '$stateParams', '$scope', '$http', 'doctorFactory',
	function DoctorIndChatController($state, $store, $stateParams, $scope, $http, doctorFactory){
		var info = doctorFactory.getValue();
		
		var time = $stateParams.chat;
		var id = $store.get('doctor_id');

		info.partner = info.partner.replace("_", ", ");

		$scope.info = info;

		doctorFactory.getChats(id, time).then(function(y){
			var objArr = {};
			var i = 0;
			y.forEach(function(x){
				var z = JSON.parse(x);
				objArr[i] = z;
				i++;
			});
			$scope.chats = objArr;
		}).catch(function(err){
			console.log(err);
		});	
		
	}]);

app.filter('objLimitTo', [function(){
    return function(obj, limit){
        var keys = Object.keys(obj);
        if(keys.length < 1) return [];

        var ret = new Object();
        var count = 0;
        angular.forEach(keys, function(key, arrayIndex){
            if(count >= limit) return false;
            ret[key] = obj[key];
            count++;
        });
        return ret;
    };
}]);