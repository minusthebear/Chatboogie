app.service('roomNameService', function () {
	var roomName = {};
    return {
    	getRoomName: function () {
    		return roomName;
    	},
        setRoomName: function(value) {
             roomName = value;
        }
    };
});
