app.controller('JoinChat',
	function JoinChat($scope, $location, $http) {
		$scope.peopleJoinChat = function() {
			$location.url('/chat-page');
			
				};
		$scope.signin = function(username, password) {
			$location.url('/chat-page');

			};
		});
