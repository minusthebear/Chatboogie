// App designed by Matthew Hamann, matt.hamann1982@gmail.com


var expressSession = require('express-session'),
	ConnectRedis = require('connect-redis')(expressSession),
	redis = require('redis'),
	uuid = require('node-uuid'),
	_ = require('underscore')._;
	
module.exports = function SocketFunc(io, Room) {
	
	this.clientDisconnection = function(socket, people, doctors, rooms, sox) {
		
		function safeDisconnect() {
			var name, type, officialName, individual;
			if (sox[socket.id].type === "doctors"){
				name = sox[socket.id].name;
				officialName = name;
				type = sox[socket.id].type;
				delete sox[socket.id];	
				var user = doctors[name].user;
				officialName = "Dr. " + doctors[name].lastName;
				individual = doctors[name];
				if (people[user]) { people[user].doctor = null; }
				else if(doctors[user]) { doctors[user].chatDoc = null; }
			} else if (sox[socket.id].type === "people"){
				name = sox[socket.id].name;
				type = sox[socket.id].type;
				officialName = name;
				delete sox[socket.id];	
				var doc = people[name].doctor;
				individual = people[name];
				if (doctors[doc]) { 
					doctors[doc].user = null;
				}
			} else { 
				console.log("None of the above");
			}				

			if (people[name]){
				delete people[name];
			} else if (doctors[name]){
				delete doctors[name];
			} else {
				return false;
			}

			delete name; delete type; individual = null; 
			io.sockets.in(socket.room).emit("update", {
				name: "Chatroom",
				text: "The user " + officialName + " has disconnected from the server."
			});

			console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));						
		}

		socket.on('disconnect', function() {
			if (sox[socket.id] !== undefined) { 
				safeDisconnect();
				io.sockets.emit('updatePeople', {people: people, count: _.size(people), socket: socket.id});
				io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors)});	
			} else {
				return false;
			}
		});


		function setValues(socket, sox, name, type){
			name = sox[socket.id].name;
			type = sox[socket.id].type;
			delete sox[socket.id];			
		}
	};
	
	this.leaveRoomFunction = function(socket, people, doctors, rooms, type, name) {
		var id;
		if (type === "doctor"){
			type = "doctors";
		}
		if (type === "user"){
			type = "people";
		}
		if (type === "doctors") {
			id = doctors[name].room;
			rooms[id].removeDoctor(doctors[name].id);			
			doctors[name].chatDoc = null;
			doctors[name]['room'] = null;
			doctors[name].user = null;
			socket.leave(id);
			if (!(rooms[id].people.length > 0) && !(rooms[id].doctors.length > 0)){
				delete rooms[id];
			}
		} else if (type === "people") {
			if (!people[name].room){
				return;
			}
			id = people[name].room;			
			rooms[id].removePerson(people[name].name);
			socket.leave(id);
			if (!(rooms[id].people.length > 0) && !(rooms[id].doctors.length > 0)){
				delete rooms[id];
			}
			socket.emit('initSafeDisconnect', {});
		} else { 
			return false;
		}
	};	

	this.joinServer = function(socket, user) {
		io.sockets.emit("update", {
			name: "Chatroom",
			text: user + " has joined the server"
		});
	};

	this.joinRoom = function(socket, room, id, ind) {
		if (ind.authorization === 'user') {
			room.addPerson(ind.name);
		} else if (ind.authorization === 'doctor') {
			room.addDoctor(ind.id);		
		} else { 
			return false; 
		}
		socket.join(id);
	};

};