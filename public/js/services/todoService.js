app.service('TodoService', function () {
	var Todo = {};

    return {
    	getTodo: function () {
    		return Todo;
    	},
        setTodo: function(value) {
             Todo = value;
        }
    };
});
