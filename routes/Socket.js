var uuid = require('node-uuid'),
	_ = require('underscore')._;

// export function for listening to the socket
module.exports = function (io, Room) {
	var people = {};
	var doctors = {};
	var rooms = {};
	var namesUsed = [];
	var sockets = [];
	var chatHistory = {};


	//Function to allow for smooth disconnection of sockets
	function clientDisconnection(socket, people, doctors, rooms, namesUsed) {

		socket.on('disconnect', function() {
			if (people[socket.id] === undefined) {
				return false;
			} else {
				var self;
				var room = rooms[people[socket.id].inroom];
				if (people[socket.id].inroom) {
					if (socket.id === room.owner) {
						leaveRoomFunction (socket, people, doctors);
					} else {
						if (_.contains((room.people), socket.id)) {
							var personIndex = room.people.indexOf(socket.id);
							room.people.splice(personIndex, 1);
							people[socket.id].inroom = null;
							io.sockets.emit("update", {
								user: "Chatroom",
								text: people[socket.id].name + " has left the room."
							});
							socket.leave(room.name);
						}					
					}
				}
				console.log("Socket on disconnect: People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
				if ((typeof people[socket.id] !== "undefined") && (people[socket.id].type == "people")){
					self = people[socket.id];
					delete people[socket.id];
				} else if ((typeof doctors[socket.id] !== "undefined") && (doctors[socket.id].type == "doctors")){
					self = doctors[socket.id];
					delete doctors[socket.id];
				} else { 
					return false;
				}
				var nameIndex = namesUsed.indexOf(self.user);
				delete self; 
				delete namesUsed[nameIndex];
				//try splice instead later
				console.log(namesUsed);

				io.sockets.emit('updatePeople', {people: people, count: _.size(people), names: namesUsed});
				io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});	
				console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));		
			}
		});
	}
	
	function leaveRoomFunction (socket, people, doctors) {
		var room = rooms[people[socket.id].inroom]
		var socketids = [];
		for (var i = 0; i<sockets.length; i++) {
			socketids.push(sockets[i].id);
			if(_.contains(socketids), room.people) {
				sockets[i].leave(room.name);
			}
		}
		if(_.contains(room.people), socket.id) {
			for (var i=0; i<room.people.length; i++) {
				people[room.people[i]].inroom = null;
			}
		}
		delete room[people[socket.id].owns];
		people[socket.id].owns = null;
		room.people = _.without(room.people, socket.id);	
		delete chatHistory[room.name];
		io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});
	} 
	



	io.sockets.on('connection', function(socket){


		//Enables those logged in at login-page to be logged in as "People"
		//Receives information from PeopleListCtrl (initialUpdate) and JoinChat (peopleJoinServer)
		socket.on('peopleJoinServer', function (data) {
			people[socket.id] = {"user": data.user, "symptoms": data.symptoms, "type": data.people, "owns": data.owns, "inroom": data.inroom};
			socket.on("initialUpdate", function(data) {
				if ((people[socket.id] !== undefined) && (data.id == "P")) { 				
					socket.emit("update", {
						user: "Chatroom",
						text: "You have joined the server"
					});
				}
				else { return false }
			});
			console.log("on people join" + people);
			namesUsed.push(data.user);
			io.sockets.emit('updatePeople', {people: people, count: _.size(people), names: namesUsed});
			console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
			io.sockets.emit("update", {
				user: "Chatroom",
				text: "A person has joined a server"
			});
		});

		//Enables those logged in at doctor to be logged in as "Doctor"
		//Receives information from DoctorListCtrl (initialUpdate) and DoctorJoinChat (doctorsJoinServer)		
		socket.on('doctorsJoinServer', function (data) {
			socket.on("initialUpdate", function(data) {
				if ((doctors[socket.id] !== undefined) && (data.id == "D")) { 				
					socket.emit("update", {
						user: "Chatroom",
						text: "You have joined the server"
					});
				}
				else { return false }
			});
			doctors[socket.id] = {"user": data.user, "qualification": data.qualification, "password": data.password, "type": data.doctors, "owns": data.owns, "inroom": data.inroom};
			console.log("on doctor join: " + doctors);
			namesUsed.push(data.user);
			io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});
			console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
			io.sockets.emit("update", {
				user: "Chatroom",
				text: "A person has joined a server"
			});
		});

		//broadcast to other users
		socket.on('sendMsg', function(data){
			socket.broadcast.emit('sendMsg', {
				user: data.user,
				text: data.message
			});
		});
		
		clientDisconnection(socket, people, doctors, rooms, namesUsed);
		
		socket.on('createRoom', function(data) {
			if (people[socket.id].inroom) {
				socket.emit("update", {
					user: "Chatroom",
					text: "You are in a room."
				});
			} else if (!people[socket.id].owns) {	
				var id = uuid.v4();

				var room = new Room(data.name, id, socket.id);
				rooms[id] = room;
				socket.emit("update", {
					user: "Chatroom",
					text: "A room has been created."
				});

				socket.room = data.name;
				socket.join(socket.room);
				people[socket.id].owns = id;
				people[socket.id].inroom = id;
				room.addPerson(socket.id);
				io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});				
				socket.emit("update", {
					user: "Chatroom",
					text: "Welcome to " + room.name + "."
				});

	//			socket.emit("sendRoomID", {id: id});
				chatHistory[socket.room] = [];
				console.log(rooms[id].name);
			} else {
				socket.emit("update", {
					user: "Chatroom",
					text: "You have created a room."
				});
			}	
		});
		
		socket.on("check", function(name, fn) {
			var match = false;
			_.find(rooms, function(key,value) {
				if (key.name === name) {
					socket.emit('update', {
						user: "Chatroom",
						text: "The name " + name + " is already taken."
					});	
					return match = true;
				}
			});
			fn({result: match});
		});		
		
		socket.on("leaveRoom", function(data){
			io.sockets.in(socket.room).emit("update", {
				user: "Chatroom",
				text: "The owner (" +people[socket.id].user + ") has left the room. The room is removed and you have been disconnected from it as well."
			});
			leaveRoomFunction (socket, people, doctors);
		});
		socket.on("removeRoom", function(data){
			io.sockets.in(socket.room).emit("update", {
				user: "Chatroom",
				text: "The owner (" +people[socket.id].user + ") has removed the room. The room is removed and you have been disconnected from it as well."
			});
			leaveRoomFunction (socket, people, doctors);
		});

		//gets users in the chatroom
		socket.on('getPeopleList', function(data) {
			
			io.sockets.emit('updatePeople', {people: people, count: _.size(people), names: namesUsed});
			io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});	
			io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});
		});	
	});
};
