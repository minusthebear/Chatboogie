app.service('doctorService', function () {
	var doctor = {};
    
    return {
    	getDoctor: function () {
    		return doctor;
    	},
        setDoctor: function(value) {
             doctor = value;
        }
    };
});
