app.factory('socket', function($rootScope) {
	var socket = io.connect('http://localhost:3000');



 	function on(eventName, callback) {
        socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$evalAsync(function () {
                callback.apply(socket, args);
            });
        });
        //socket.removeListener(eventName, callback);
    }

    function emit(eventName, data, callback) {
        socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$evalAsync(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
        });
        //socket.removeListener(eventName, callback);
    }
    
    function removeAllListeners(eventName, callback) {
	    socket.removeAllListeners(eventName, function() {
	        var args = arguments;
	        $rootScope.$evalAsync(function () {
	            callback.apply(socket, args);
	        });
	    });
//	    getSocket();
	}

	function removeListener(eventName, data, callback) {
	    socket.removeListener(eventName, data, function() {
	        var args = arguments;
	        $rootScope.$evalAsync(function () {
                if (callback) {
                    callback.apply(socket, args);
                }
            });
	    });
	}

    function disconnect(eventName, callback) {
        socket.disconnect(eventName, function() {
            var args = arguments;
            $rootScope.$evalAsync(function () {
                callback.apply(socket, args);
            });
        });
    }


    // };
    return {
    	on: on,
    	emit: emit,
    	removeAllListeners: removeAllListeners, 
    	removeListener: removeListener,
        disconnect: disconnect
    };


});
