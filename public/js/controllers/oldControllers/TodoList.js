app.controller('TodoList', ['$scope', '$location', '$http', '$interval', '$log', '$timeout',
	function JoinChat($scope, $location, $http, $interval, $log, $timeout) {
		$scope.todoInput = {};
		
		$scope.value = '';

		$scope.todos = [];
		
		$scope.init = function() {
			$http.get('/query').success(function(data) {
				$log.log("Loud and clear");
				$log.log(data);
				for(var key in data) {
					$scope.todos.push({
						id: data[key].id,
						name: data[key].listItem
					});		
				}
						
			});
		};
	
		$scope.saveTodo = function(todoInput) {	
			$http.post('/save', { info: todoInput.text}).then(function(response){
				if(response.data.success) {
					$scope.todos.push({
						id: response.data.todoId,
						name: todoInput.text
					});
					$scope.todoInput.text = '';		
				}							
			});

		};

		$scope.description = null;
		
		$scope.finish = function(id) {	
			$http.post('/deleteTodos', { id: id }).then(function(response) {
				if(response.data.success) {
					$log.log("Delete worked.");
					var index = document.getElementById(id);
					angular.element(index).parent().remove();
				}
			});
			
		};
		
		$scope.update = function(todo, newValue) {	
			$log.log("Old value: " + todo.name + ", New value: " + newValue);
			$http.post('/updateTodos', { id: todo.id, newValue: newValue }).then(function(response){
				if(response.data.success) {

					var index = document.getElementById(todo.id);
					angular.element(index).parent().remove();							
					
					$log.log(response.data.id + ", " + response.data.listItem);
					$scope.todos.push({
						id: response.data.id,
						name: response.data.listItem
					});	
					$log.log($scope.todos);	
				} else {
					$log.log("The message wasn't received on the client side.");
				}			
			});
		};
	}]);
