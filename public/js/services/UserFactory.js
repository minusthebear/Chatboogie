app.factory('UserFactory', function ($http, $q, $store) {
	var info = {};
    var name;
    var room;
    
    return {
    	setInfo: setInfo,
        getInfo: getInfo,
        setName: setName,
        getName: getName,
        setRoom: setRoom,
        getRoom: getRoom
    };

    function getInfo(){
        return info;
    }

    function setInfo(user){
        var i = user;
        i.name = user.name;
        i.email = user.email;
        i.field = user.field;
        i.insurance = user.insurance;
        i.seenDoctor = user.seenDoctor;
        i.issue = user.issue;
        i.permission = user.permission;
        // i.id = $store.get('user_id');
        i.authorization = $store.get('authorization');
        i.socketID = null;
        i.room = null;
        i.doctor = null;
        info = i;
    }

    function setName(n){
        name = n;
    }

    function getName(){
        return name;
    }

    function setRoom(r){
        room = r;
    }

    function getRoom(){
        return room;
    }

    function sendResponseData(response) {
        return response.data;
    }
    function sendGetError(response) {
        return $q.reject('Error retrieving your information. (HTTP status: ' + response.status + ')');
    }
});
