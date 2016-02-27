app.factory('UserFormFactory', function ($http, $q) {
	var form = {};
    
    return {
    	setForm: setForm
    };

    function setForm(user){
        
    }

    function sendResponseData(response) {
        return response.data;
    }
    function sendGetError(response) {
        return $q.reject('Error retrieving your information. (HTTP status: ' + response.status + ')');
    }
});
