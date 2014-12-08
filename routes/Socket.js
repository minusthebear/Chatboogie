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
	var individual;


	//Function to allow for smooth disconnection of sockets
	function clientDisconnection(socket, people, doctors, rooms, namesUsed) {

		function safeDisconnect() {
			if ((typeof people[socket.id] !== "undefined") && (people[socket.id].type == "people")){
				individual = people[socket.id];
				console.log('16');
			//	delete people[socket.id];
			} else if ((typeof doctors[socket.id] !== "undefined") && (doctors[socket.id].type == "doctors")){
				individual = doctors[socket.id];
				console.log('17');
			//	delete doctors[socket.id];
			} else { 
				console.log('18');
				return false;
			}
			var room = rooms[individual.inroom];
			if (individual.inroom) {
				if (socket.id === room.owner) {
					removeRoomFunction (socket, people, doctors, rooms);
				} else {
					leaveRoomFunction(socket, room);					
				}
			}
			console.log("Socket on disconnect: People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
			if ((typeof people[socket.id] !== "undefined") && (people[socket.id].type == "people")){
				individual = people[socket.id];
				delete people[socket.id];
				console.log("19");
			} else if ((typeof doctors[socket.id] !== "undefined") && (doctors[socket.id].type == "doctors")){
				individual = doctors[socket.id];
				delete doctors[socket.id];
				console.log("20");
			} else { 
				return false;
				console.log("21");
			}
			var nameIndex = namesUsed.indexOf(individual.user);
			delete individual; 
			delete namesUsed[nameIndex];
			//try splice instead later
			console.log(namesUsed);

			io.sockets.emit('updatePeople', {people: people, count: _.size(people), names: namesUsed});
			io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});	
			console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));						
		}

		socket.on('disconnect', function() {
			if ((people[socket.id] !== undefined)) { 
				console.log('13');
				safeDisconnect();
			} else if (doctors[socket.id] !== undefined) {
				console.log('14');
				safeDisconnect();
			} else {
				console.log('15');
				return false;
			}
		});
	}
	
	function leaveRoomFunction(socket, rooms) {
		var self, room, container;
		
		if ((typeof people[socket.id] !== "undefined") && (people[socket.id].type == "people")){
			self = people[socket.id];
			room = rooms[people[socket.id].inroom];
			container = room.people;
			console.log("9");
		} else if ((typeof doctors[socket.id] !== "undefined") && (doctors[socket.id].type == "doctors")){
			self = doctors[socket.id];
			room = rooms[doctors[socket.id].inroom];
			container = room.doctors;
			console.log("10");
		} else { 
			return false;
			console.log("11");
		}
		
		console.log(room.people);
		console.log(container);
		if (_.contains((container), socket.id)) {
			console.log(container);
			var personIndex = container.indexOf(socket.id);
			container.splice(personIndex, 1);
			self.inroom = null;
			io.sockets.emit("update", {
				user: "Chatroom",
				text: self.user + " has left the room."
			});
			socket.leave(room.name);
			console.log("12");
		}
	}
	
	function removeRoomFunction (socket, people, doctors, rooms) {
		var self, room, container;
		
		if ((typeof people[socket.id] !== "undefined") && (people[socket.id].type == "people")){
			self = people[socket.id];
			room = rooms[people[socket.id].inroom];
			container = room.people;
			console.log("1");
		} else if ((typeof doctors[socket.id] !== "undefined") && (doctors[socket.id].type == "doctors")){
			self = doctors[socket.id];
			room = rooms[doctors[socket.id].inroom];
			container = room.doctors;
			console.log("2");
		} else { 
			return false;
			console.log("3");
		}

		var nameIndex = room.name;
		var socketids = [];
		for (var i = 0; i<sockets.length; i++) {
			socketids.push(sockets[i].id);
			if(_.contains(socketids), room.people) {
				sockets[i].leave(room.name);
				console.log("4");
			}
			if(_.contains(socketids), room.doctors) {
				sockets[i].leave(room.name);
				console.log("5");
			}
		}
		if(_.contains(container), socket.id) {
			for (var i=0; i<room.people.length; i++) {
				people[room.people[i]].inroom = null;
				console.log("6");
			}
			for (var i=0; i<room.doctors.length; i++) {
				doctors[room.doctors[i]].inroom = null;
				console.log("7");
			}
			delete rooms[self.owns];
		}
		self.owns = null;
		container = _.without(container, socket.id);	
		delete chatHistory[room.name];
		io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});
		console.log("8");
	} 
	

	function joinServer(socket, user) {
		namesUsed.push(user);
		console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
		io.sockets.emit("update", {
			user: "Chatroom",
			text: "A person has joined the server"
		});
	}
	
	function joinRoom(socket, room, id, individual) {
		console.log("socket.room: " + socket.room);
		console.log("room: " + room);
		console.log("ID: " + id);
		if (people[socket.id]) {
			room.addPerson(socket.id);
		} else if (doctors[socket.id]) {
			room.addDoctor(socket.id);		
		} else { return false; } 
		individual.inroom = id; 
		console.log("joining: " + socket.room + " : " + socket.id);
		socket.join(socket.room); 
		console.log("People[Socket.id]: " + people[socket.id]); 
		console.log("Individual: " + individual);
		console.log("Room.people: " + room.people);
		console.log("Room.doctors: " + room.doctors);
	  //socket.emit("sendRoomID", {id: id});
	}




	io.sockets.on('connection', function(socket){


		//Enables those logged in at login-page to be logged in as "People"
		//Receives information from PeopleListCtrl (initialUpdate) and JoinChat (peopleJoinServer)
		socket.on('peopleJoinServer', function (data) {
			socket.on("initialUpdate", function(data) {
				if ((people[socket.id] !== undefined) && (data.id == "P")) { 				
					socket.emit("update", {
						user: "Chatroom",
						text: "You have joined the server"
					});
				}
				else { return false }
			});
			people[socket.id] = {"user": data.user, "symptoms": data.symptoms, "type": data.people, "owns": data.owns, "inroom": data.inroom};
			io.sockets.emit('updatePeople', {people: people, count: _.size(people), names: namesUsed});
			joinServer(socket, data.user);
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
			io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});
			joinServer(socket, data.user);
		});

		//broadcast to other users
		socket.on('sendMsg', function(data){
			console.log("getting sucked up by sendMsg");
			var hereInRoom;
			if (people[socket.id]) {
				hereInRoom = people[socket.id].inroom;
				console.log("AAA");
			} else if (doctors[socket.id]) {
				hereInRoom = doctors[socket.id].inroom;	
				console.log("BBB");				
			} else { return false; }			
			console.log(hereInRoom);
			if (hereInRoom === null) {		
				socket.emit('failMsg', {
					user: 'Chatroom',
					text: 'You must be in a room in order to send a message.'
				});
			} else {
				console.log("THis works.");
				console.log(individual);	
				console.log(socket.room);					
				io.sockets.in(socket.room).emit('sendMsg', {
					user: data.user,
					text: data.message					
				});		
			}		
		});
		
		
		clientDisconnection(socket, people, doctors, rooms, namesUsed);
		
		//creates a new chat room
		socket.on('createRoom', function(data) {
			if (people[socket.id]) {
				individual = people[socket.id];
			} else if (doctors[socket.id]) {
				individual = doctors[socket.id];	
			} else { return false; }
			
			if (individual.inroom) {
				socket.emit("update", {
					user: "Chatroom",
					text: "You are in a room."
				});
			} else if (!individual.owns) {	
				var id = uuid.v4();

				var room = new Room(data.name, id, socket.id);
				rooms[id] = room;
				socket.emit("update", {
					user: "Chatroom",
					text: "A room has been created. id: " + id
				}); 
				socket.room = data.name;				
				joinRoom(socket, room, id, individual);
				individual.owns = id;
				io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});				
				socket.emit("update", {
					user: "Chatroom",
					text: "Room create with (" + socket.room + ") Welcome to " + room.name + "."
				});
				chatHistory[socket.room] = [];
				console.log(socket.room);
				console.log(socket.id);
			} else {
				socket.emit("update", {
					user: "Chatroom",
					text: "You have created a room."
				});
			}	
		});
		
		socket.on("joinRoom", function(data) {
			var id = data;
			var container;
			
			if (people[socket.id]) {
				individual = people[socket.id];
			} else if (doctors[socket.id]) {
				individual = doctors[socket.id];		
			} else { return false; }
			
			console.log(people[socket.id]);
			console.log(individual);
			if (typeof individual !== "undefined") {
				var room = rooms[id];
				
				if (people[socket.id]) {
					container = room.people;
					console.log(container);					
				} else if (doctors[socket.id]) {
					container = room.doctors;
					console.log("It came here instead. Something is wrong.");		
				} else { return false; }
				console.log("This is the container: " + container);				
				if (socket.id === room.owner) {
					socket.emit("update", {
						user: "Chatroom",
						text: "You are the owner of this room and have already joined this room."
					});
				} else {
					if (_.contains((container), socket.id)) {
						socket.emit("update", {
							user: "Chatroom",
							text: "You have already joined this room."
						});						
					} else {
						if (individual.inroom !== null) {
							socket.emit("update", {
								user: "Chatroom",
								text: "You are already in a room."
							});								
						} else {
							socket.room = room.name;
							console.log(socket.room);
							joinRoom(socket, room, id, individual);
							io.in(socket.room).emit("update", {
								user: "Chatroom",
								text: individual.user	+ " has joined room: " + room.name							
							});
							var keys = _.keys(chatHistory);
							if (_.contains(keys, socket.room)) {
								socket.emit("history", chatHistory[socket.room]);
							}
						}
					}	
				}	
			}
		});
		
		//checks to see if the room name is available
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
		
		socket.on("chatRoomCheck", function(fn) {
			console.log(people[socket.id].inroom);
			var match = false;
			if (people[socket.id].inroom !== null) {
				return match = true;
			} else {
				return match = false;
			}
			fn({result: match});
		});
		
		
		//allows user to cleanly leave the room
		socket.on("leaveRoom", function(data){
			if (people[socket.id]) {
				individual = people[socket.id];
			} else if (doctors[socket.id]) {
				individual = doctors[socket.id];		
			} else { return false; }
			
			if (individual.inroom === null) {
				socket.emit("update", {
					user: "Chatroom",
					text: "You are not in a room. You cannot leave a room"
				});
			} else {
				if (individual.owns !== null) {
					io.sockets.in(socket.room).emit("update", {
						user: "Chatroom",
						text: "The owner (" + individual.user + ") has left the room. The room is removed and you have been disconnected from it as well."
					});
					removeRoomFunction (socket, people, doctors, rooms);				
				} else {
					io.sockets.in(socket.room).emit("update", {
						user: "Chatroom",
						text: "The owner (" + individual.user + ") has left the room. "
					});
					leaveRoomFunction (socket, rooms);
				}
			}
		});
		
		//deletes the room
		socket.on("removeRoom", function(data){
			if (people[socket.id]) {
				individual = people[socket.id];
			} else if (doctors[socket.id]) {
				individual = doctors[socket.id];		
			} else { return false; }
			
			io.sockets.in(socket.room).emit("update", {
				user: "Chatroom",
				text: "The owner (" + individual.user + ") has removed the room. The room is removed and you have been disconnected from it as well."
			});
			removeRoomFunction (socket, people, doctors, rooms);
		});

		//gets users in the chatroom
		socket.on('getPeopleList', function(data) {
			io.sockets.emit('updatePeople', {people: people, count: _.size(people), names: namesUsed});
			io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors), names: namesUsed});	
			io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});
		});	
	});
};
