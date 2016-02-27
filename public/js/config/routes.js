app.config(function ($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('httpInterceptor');

    $stateProvider
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // doctors
        ////////////////////////////////////////////////////////////////////////////////////////////////
        .state('doctor', {
            url: "/doctor",
            templateUrl: "partials/doctor/ui-view.html",
//            controller:'DoctorMainController',
            redirectTo: 'doctor.main',
            data: {
                doctor: true
            }
        })
        .state('doctor.main', {
            url: "/main",
            templateUrl: "partials/doctor/doctor.main.html",
            data: {
                doctor: true
            }
        })        
        .state('doctor.add', {
            url: "/add",
            //templateUrl: "/partials/doctor/chat-page.html",
            templateUrl: "/partials/doctor/doctor.add.html",
            data: {
                doctor: true
            }
        })
        .state('doctor.edit', {
            url: "/edit",
            //templateUrl: "/partials/doctor/chat-page.html",
            templateUrl: "/partials/doctor/doctor.edit.html",
            data: {
                doctor: true
            }
        })                   
        .state('doctor.chat', {
            url: "/doctorChat",
            templateUrl: "/partials/doctor/doctor.chat.html",
            data: {
                doctor: true
            }
        })
        .state('doctor.alltasks', {
            url: "/allTasks",
            templateUrl: "/partials/doctor/doctor.alltasks.html",
            data: {
                doctor: true
            }
        })
        .state('doctor.history', {
            url: "/chatHistory",
            templateUrl: "/partials/doctor/doctor.allchats.html",
            data: {
                doctor: true
            }           
        })
        .state('doctor.each', {
            url: "/chatHistory/:chat",
            params: {'chat': null},
            templateUrl: "/partials/doctor/doctor.each.html",
            data: {
                doctor: true
            }           
        })            
        .state('doctor.taskform', {
            url: "/taskForm",
            templateUrl: "/partials/doctor/doctor.taskform.html",
            data: {
                doctor: true
            }
        })
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // patients
        ////////////////////////////////////////////////////////////////////////////////////////////////
        .state('user', {
            url: "/user",
            templateUrl: "/partials/patient/ui-view.html",
            redirectTo: 'user.form',
            data: {
                user: true
            }
        })        
        .state('user.form', {
            url: "/form",
            templateUrl: "partials/patient/user.form.html",
            data: {
                user: true
            }
        })

        .state('user.chat', {
            url: "/chat",
  //          templateUrl: "/partials/patient/chat-page.html",
            templateUrl: "/partials/patient/user.chat.html",
            data: {
                user: true
            }
        })
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // unauthorized
        ////////////////////////////////////////////////////////////////////////////////////////////////
        .state('unauthorized', {
            url: "/unauthorized",
            templateUrl: "/partials/unauthorized.html"
        });

}).factory('httpInterceptor', function($q, $store, $window) {
    return {
        request: function (config){
            config.headers = config.headers || {};
            console.log(config);
            if($store.get('token')){
                var token = config.headers.Authorization = 'Bearer ' + $store.get('token');
            }
            return config;
        },
        responseError: function(response){
            if(response.status === 401 || response.status === 403) {
                //$window.location.href = "http://localhost:3000/frontPageDoctor";
                console.log("IT's here");
            }
            console.log("IT's here");
            return $q.reject(response);
        }
    };
})

.factory('Auth', function(){
    
    return {
        isDoctor: false,
        isUser: false
    }

}).factory('logoutFactory', function($store, doctorFactory, socket){
    return {
        logout: logout
    };

    function logout(){
        var ID = $store.get('authorization');
            if (ID === "doctor") {
                doctorFactory.removeData();
                if($store.get('fullName')){ $store.remove('fullName'); }
                $store.remove('authorization');
                $store.remove('username');
                $store.remove('doctor_id');
                $store.remove('token');
                console.log("THIS IS LOG OUT");
                socket.disconnect();
            } else if (ID === "user") {
                $store.remove('authorization');
                $store.remove("username");
                socket.disconnect();
            } else {
                $auth.removeToken();
            }         
    }
})

.run(function($rootScope, $state, $store, $location, $window, Auth, socket, doctorFactory, logoutFactory, UserFactory, RService){

    $window.onbeforeunload = function(){
        if ($store.get('authorization') === "user"){
            console.log("onbeforeunload");
            logoutFactory.logout();
        } else if ($store.get('authorization') === "doctor"){
            console.log("It came here.");
            socket.disconnect();
        } else { return; }
    }
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState){
        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams);
        }

        if(fromState.name === "doctor.chat"){
            var name = $store.get('fullName');
            var room = RService.getR();
            console.log(room);                 
            //socket.emit('leaveRoom', {user: name, room: room});
        }

        if (fromState.name === "user.chat"){
            var name = UserFactory.getName();
            var room = UserFactory.getRoom();
            console.log(UserFactory.getName());
            socket.emit('forceLeaveRoom', {user: name, room: room});
            socket.on('initSafeDisconnect', function(){
                console.log("SAFE DISCONNECT");
                socket.disconnect();
            });   
        }

        if (!toState.data) return;

        if (!$store.get('authorization')){
            $store.set('authorization', window.authorization);
        }

        var ID = $store.get('authorization');

        if (ID === "doctor"){
            Auth.isDoctor = true;
            Auth.isUser = false;
        } else if (ID === "user"){
            Auth.isUser = true;
            Auth.isDoctor = false;
        } else {
            console.log("Some error.");
            return;
        }

        if (Auth.isDoctor) {
            var notUser = (toState.data !== undefined
                            && toState.data.user);

            if (notUser) { return $state.go('unauthorized'); }

            var authorized = (!!toState.data.doctor 
                            && toState.data.doctor === true);

            if (authorized) { return; }
        }
        
        if (Auth.isUser) {
            var notDoctor = (toState.data !== undefined
                        && !toState.data.user);

            if (notDoctor) { 
                event.preventDefault(); 
                return $state.go('unauthorized');
            }

            var authorized = (!!toState.data.user 
                            && toState.data.user === true);

            if (authorized) {  return;  }
        }
    });
});