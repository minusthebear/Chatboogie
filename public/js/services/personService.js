app.service('personService', function () {
	var person = {};

    return {
    	getPerson: function () {
    		return person;
    	},
        setPerson: function(value) {
             person = value;
        }
    };
});
