app.service('IDService', function () {
	var ID = {};

    return {
    	getID: function () {
    		return ID;
    	},
        setID: function(value) {
             ID = value;
        }
    };
});
