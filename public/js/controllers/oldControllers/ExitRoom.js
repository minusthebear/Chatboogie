// This will be changed, and a service will be added later

app.controller('ExitRoom', ['$scope', '$log', '$location', '$http', '$timeout','$window','socket',
	function ($scope, $log, $location, $http, $timeout, $window, socket) {
		
		$scope.exitRoom = function() {
			socket.emit('leaveRoom', {});
		};
		
		$scope.disconnect = function() {
			$http.post('/disconnect' /*, {username: person.name, symptoms: person.symptoms} */).then(function(response){
				console.log(response);
				if(response.data.success) {
					$log.log("Success!");
					// What I need to do is find a way to redirect and reload everything.
					$window.location.href = "http://www.google.com";
				} else { $log.log('There was an error'); }			
			});
		};
	}]);
