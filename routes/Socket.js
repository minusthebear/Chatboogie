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
						removeRoomFunction (socket, people, doctors, rooms);
					} else {
						leaveRoomFunction(socket, room);					
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
	
	function leaveRoomFunction(socket, rooms) {
		var room = rooms[people[socket.id].inroom];
		if (_.contains((room.people), socket.id)) {
			var personIndex = room.people.indexOf(socket.id);
			room.people.splice(personIndex, 1);
			people[socket.id].inroom = null;
			io.sockets.emit("update", {
				user: "Chatroom",
				text: people[socket.id].user + " has left the room."
			});
			socket.leave(room.name);
		}
	}
	
	function removeRoomFunction (socket, people, doctors, rooms) {
		var room = rooms[people[socket.id].inroom];
		var nameIndex = room.name;
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
				delete rooms[people[socket.id].owns];
			}
		}
		people[socket.id].owns = null;
		room.people = _.without(room.people, socket.id);	
		delete chatHistory[room.name];
		io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});
	} 
	

	function joinServer(socket, user) {
		namesUsed.push(user);
		console.log("People size: " + _.size(people) + ", Doctors size: " + _.size(doctors));
		io.sockets.emit("update", {
			user: "Chatroom",
			text: "A person has joined the server"
		});
	}
	
	function joinRoom(socket, room, id) {
		room.addPerson(socket.id); 
		people[socket.id].inroom = id; 
		socket.join(socket.room); 
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
			if (people[socket.id].inroom !== null) {
				
				io.sockets.in(socket.room).emit('sendMsg', {
					user: data.user,
					text: data.message
				});
				//socket.emit('successMsg', {
					//user: data.user,
					//text: data.message					
				//});
			} else {
				socket.emit('failMsg', {
					user: 'Chatroom',
					text: 'You must be in a room in order to send a message.'
				});
			}		
		});
		
		
		clientDisconnection(socket, people, doctors, rooms, namesUsed);
		
		//creates a new chat room
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
				joinRoom(socket, room, id);
				socket.room = data.name;
				people[socket.id].owns = id;
				io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});				
				socket.emit("update", {
					user: "Chatroom",
					text: "Welcome to " + room.name + "."
				});
				chatHistory[socket.room] = [];
			} else {
				socket.emit("update", {
					user: "Chatroom",
					text: "You have created a room."
				});
			}	
		});
		
		socket.on("joinRoom", function(data) {
			var id = data;
			if (typeof people[socket.id] !== "undefined") {
				var room = rooms[id];
				if (socket.id === room.owner) {
					socket.emit("update", {
						user: "Chatroom",
						text: "You are the owner of this room and have already joined this room."
					});
				} else {
					if (_.contains((room.people), socket.id)) {
						socket.emit("update", {
							user: "Chatroom",
							text: "You have already joined this room."
						});						
					} else {
						if (people[socket.id].inroom !== null) {
							socket.emit("update", {
								user: "Chatroom",
								text: "You are already in a room."
							});								
						} else {
							socket.room = room.name;
							joinRoom(socket, room, id);
							io.in(socket.room).emit("update", {
								user: "Chatroom",
								text: people[socket.id].user	+ " has joined room: " + room.name							
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
			if (people[socket.id].inroom === null) {
				socket.emit("update", {
					user: "Chatroom",
					text: "You are not in a room. You cannot leave a room"
				});
			} else {
				if (people[socket.id].owns !== null) {
					io.sockets.in(socket.room).emit("update", {
						user: "Chatroom",
						text: "The owner (" +people[socket.id].user + ") has left the room. The room is removed and you have been disconnected from it as well."
					});
					removeRoomFunction (socket, people, doctors, rooms);				
				} else {
					io.sockets.in(socket.room).emit("update", {
						user: "Chatroom",
						text: "The owner (" +people[socket.id].user + ") has left the room. "
					});
					leaveRoomFunction (socket, rooms);
				}
			}
		});
		
		//deletes the room
		socket.on("removeRoom", function(data){
			io.sockets.in(socket.room).emit("update", {
				user: "Chatroom",
				text: "The owner (" +people[socket.id].user + ") has removed the room. The room is removed and you have been disconnected from it as well."
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
