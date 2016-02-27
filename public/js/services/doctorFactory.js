app.factory('doctorFactory', function ($http, $q, $store) {
	var doctor = {};
    var data = {};
    var sendData = {};
    var value = {};
    var chats;
    var notice;
    
    return {
    	getDoctor: getDoctor,
        setDoctor: setDoctor,
        findDoctor: findDoctor,
        getDoctorInfo: getDoctorInfo,
        getData: getData,
        removeData: removeData,
        setData: setData,
        setSendDataInfo: setSendDataInfo,
        getSendDataInfo: getSendDataInfo,
        setNotice: setNotice,
        getNotice: getNotice,
        setValue: setValue,
        getValue: getValue,
        getChats: getChats,
        getCh: getCh,
        getCRm: getCRm,
        getChatRooms: getChatRooms        
    };

    //Will these two functions work with d = sendData?
    function setSendDataInfo(user){
        var d = sendData;
        d.fullName = user.fullName;
        d.firstName = user.firstName;
        d.lastName = user.lastName;
        d.middleName = user.middleName;
        d.email = user.email;
        d.fields = user.fields;
        d.university = user.university;
        d.work = user.work;
        d.id = user.id;
        d.authorization = user.authorization;
        d.room = null;
        d.user = null;
        d.socketID = null;
    }
    function getSendDataInfo(){
        return sendData;
    }

    function setNotice(str){
        notice = str;
    }

    function getNotice(){
        return notice;
    }

    function setValue(arg){
        value = arg;
    }

    function getValue(){
        return value;
    }    

    function getDoctor() { return doctor; }

    function setDoctor(arg) { doctor = arg; }

    function findDoctor(id){
        console.log("In findDoctor");
    	return $http.get('/findDoctor/' + id)
            .then(sendResponseData)
            .catch(sendGetError);
    }

    function getDoctorInfo(id){
        console.log("In getDoctorInfo");
        return $http.get('/getDoctorInfo/' + id)
            .then(setData)
            .catch(sendGetError);
    }

    function getChats(id, time){
        return $http.get('/getChats/' + id + '/' + time)
            .then(sendResponseData)
            .catch(sendGetError);
    }

    function getChatRooms(id){
        return $http.get('/getChatRooms/' + id)
            .then(sendResponseData)
            .catch(sendGetError);
    }

    function getCh(val){
        chats = val;
        console.log(chats);
        return chats;
    }

    function getCRm(val){
        chats = val;
        console.log(chats);
        return chats;
    }    

    // function editDoctorInfo(id, doc){
    //     return $http.post('/editDoctorInfo', {id: id, doc: doc}).then(function(res){

    //     })
    // }

    function setData(response){
        var x;
        $store.set('importantData', true);
        $store.set('firstName', response.data.firstName);
        $store.set('lastName', response.data.lastName);
        $store.set('email', response.data.email);
        $store.set('fields', response.data.fields);
        $store.set('work', response.data.work);
        $store.set('university', response.data.university);
        if (response.data.middleName){
            $store.set('middleName', response.data.middleName);
        }
        x = true;
        console.log("In set data");
        console.log(response);
        return x;
    }

    function getData(){
        var x = $store.get('importantData');
        if (x === true){
            data['firstName'] = $store.get('firstName');
            data['lastName'] = $store.get('lastName');
            data['email'] = $store.get('email');
            data['fields'] = $store.get('fields');
            data['work'] = $store.get('work');
            data['university'] = $store.get('university');
            if ($store.get('middleName')){
                data['middleName'] = $store.get('middleName');
            }
            if ($store.get('fullName')){
                data['fullName'] = $store.get('fullName');
            }
            return data;
        } else {
            return false;
        }
    }

    function removeData(){
        $store.remove('importantData');
        $store.remove('firstName');
        $store.remove('lastName');
        $store.remove('email');
        $store.remove('fields');
        $store.remove('work');
        $store.remove('university');
        $store.remove('fullName');
        if ($store.get('middleName')){
            $store.remove('middleName');
        }
        return true;        
    }

    function sendResponseData(response) {
        return response.data;
    }
    function sendGetError(response) {
        return $q.reject('Error retrieving your information. (HTTP status: ' + response.status + ')');
    }
});