var _ = require('underscore')._;



// export function for listening to the socket
module.exports = function (io) {
	var people = {};
	var doctors = {};
	var rooms = {};
	var namesUsed = [];
	var sockets = [];
//	var sizePeople = _.size(people);
//	var sizeDoctors = _.size(doctors);

	function clientDisconnection(socket, people, doctors, namesUsed) {
		socket.on('disconnect', function() {
			var self;
			if ((typeof people[socket.id] !== "undefined") && (people[socket.id].type == "people")){
				self = people[socket.id];
				delete people[socket.id];
				console.log("first");
			} else if ((typeof doctors[socket.id] !== "undefined") && (doctors[socket.id].type == "doctors")){
				self = doctors[socket.id];
				delete doctors[socket.id];
				console.log("second");
			} else { 
				console.log("third");
				return false
			}

			var nameIndex = namesUsed.indexOf(self.user);
			console.log(namesUsed);
			delete self; 
			delete namesUsed[nameIndex];
			console.log(namesUsed);

			io.sockets.emit('update-people', {people: people, count: _.size(people), names: namesUsed});
			io.sockets.emit('update-doctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});
			console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
		});
	} 
	


	io.sockets.on('connection', function(socket){
		
		socket.on('people-join-server', function (data) {
			people[socket.id] = {"user": data.user, "symptoms": data.symptoms, "type": data.people};
			console.log(people);
			namesUsed.push(data.user);
			io.sockets.emit('update-people', {people: people, count: _.size(people), names: namesUsed});
			console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
			console.log(_.size(people));
			console.log(_.size(doctors));
		});
		
		socket.on('doctors-join-server', function (data) {
			doctors[socket.id] = {"user": data.user, "qualification": data.qualification, "password": data.password, "type": data.doctors};
			console.log(doctors);
			namesUsed.push(data.user);
//			io.sockets.emit('update-people', {people: people, count: sizePeople, names: namesUsed});
			io.sockets.emit('update-doctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});
		});

		//broadcast to other users
		socket.on('send-msg', function(data){
			socket.broadcast.emit('send-msg', {
				user: data.user,
				text: data.message
			});
		});
		
		clientDisconnection(socket, people, doctors, namesUsed);
		
	});
};

