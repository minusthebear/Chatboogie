var expressSession = require('express-session'),
	ConnectRedis = require('connect-redis')(expressSession),
	redis = require('redis'),
	redisAdapter = require('socket.io-redis'),
	redisChat = require('../redis/doctorChat'),
	uuid = require('node-uuid'),
	_ = require('underscore')._,
	config = require('../config'),
	dCon = require('../models/dateConverter');

module.exports = function (io, Room, SocketFunc, SpaceFunc) {
	var people = {};
	var doctors = {};
	var rooms = {};
	var sox = {};
	var individual;
	var user;
	var permission = false;

	io.sockets.on('connection', function(socket){

		clientDisconnection(socket, people, doctors, rooms, sox);

		socket.on('peopleJoinServer', function (u) {
			var user = u;
			setPersonInfo(people, user, socket);
			io.sockets.emit('updatePeople', {people: people, count: _.size(people), socket: socket.id});
			joinServer(socket, user.name);
			setGenSocketInfo(socket.id, user.name, "people");
		});

		socket.on('doctorsJoinServer', function (u) {
			var user = u;
			setDoctorInfo(doctors, user, socket);
			io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors)});
			if (!user.fullName){
				socket.disconnect();
			}			
			joinServer(socket, user.fullName);
			setGenSocketInfo(socket.id, user.fullName, "doctors");
		});

		socket.on('fieldCheck', function(res){
			var msg;
			var check = checkFields(res.field, res.doc);
			if (check === true) { msg = true; }
			else { msg = false; }
			socket.emit('fieldResponse', {msg: msg});
		});

		socket.on('confirmRoomCheck', function(data){
			if(!!rooms[data.room]){
				socket.emit('personInRoom', {res: true});
			} else {
				socket.emit('personInRoom', {res: false});
			}
		});

		//SENDING MESSAGES
		//broadcast to other users
		socket.on('sendMsg', function(data){
			if (!rooms[data.room]){
				socket.emit('failMsg', {
					name: 'Chatroom',
					text: 'Please wait for someone to join your room.'
				});
			} else {
				var rID = rooms[data.room].timeCreated,
					ind = determine(data.user);
				if (ind.room === null) {		
					socket.emit('failMsg', {
						name: 'Chatroom',
						text: 'You must be in a room in order to send a message.'
					});
				} else {
					var chat = {
						id: data.id,
						sock: data.sock,
						user: data.user,
						name: data.name,				
						text: data.text,
						room: data.room			
					};
					io.sockets.to(data.room).emit('sendMsg', chat);

					// UNCOMMENT LATER
					if (permission === true){
						var user1 = rooms[data.room].doctors[0];
						redisChat.addChat(chat, user1, rID);
					}
					if (!!rooms[data.room].doctors[1]) {
						var user2 = rooms[data.room].doctors[1];
						redisChat.addChat(chat, user2, rID);
					}
				}	
			}
		});

		//CREATE A ROOM
		//INITIATED BY THE DOCTOR

		socket.on('createRoom', function(data) {

			var name = data.data.fullName;

			if (doctors[name].room) {
				socket.emit("update", {
					user: "Chatroom",
					text: "You are in a room. You must leave a room before you join another room."
				});
			} else if (!doctors[name].room) {	
				var id = uuid.v1(), d = new Date(), w, x, y, z, DT;
				w = dCon.setMonth(d.getMonth());
				x = dCon.setMinutes(d.getMinutes());
				y = dCon.setSeconds(d.getSeconds());
				z = dCon.setDay(d.getDate());
				DT = d.getFullYear().toString() + w + z + d.getHours().toString() + x + y;

				rooms[id] = new Room(id, DT);			
				joinRoom(socket, rooms[id], id, doctors[name]);
				socket.emit("update", {
					name: "Chatroom",
					text: "A room has been created. id: " + id + " at time: " + d
				}); 		
				doctors[name].room = id;
				if(data.user.name){
					doctors[name].user = data.user.name;
				} else if (data.user.fullName){
					doctors[name].chatDoc = data.user.fullName;
				}
				socket.emit("individual", {room: id, socketID: socket.id, id: doctors[name].id });
				var sock = data.user.socketID;
				sendInvite(data, io, rooms[id], id, doctors[name], sock);
				io.sockets.emit("roomList", {rooms: rooms, count: _.size(rooms)});				
			} else {
				return false;
			}
		});

	// ROOM CREATED, UPON JOINING ROOM.

		socket.on("joinRoom", function(data) {
			if (people[data.data.name] && people[data.data.name]['room'] != (null || undefined)) {
				socket.emit("update", {
					name: "Chatroom",
					text: "You are in a room. Feel free to chat with the doctor."
				});
				return;				
			} else if (doctors[data.data.fullName] && doctors[data.data.fullName]['room'] != undefined) {
				socket.emit("update", {
					name: "Chatroom",
					text: "You are in a room. Feel free to chat with the doctor."
				});
				return;		
			} else {
				if (people[data.data.name]){
					var name = data.data.name;
					getUserInfo(socket, data.data, data.roomID, data.doc);
					socket.emit('individual', people[name]);
					if(people[name].permission === true){
						permission = true;
					}
				} else if (doctors[data.data.fullName]){
					var name = data.data.fullName;
					getDocInfo(socket, data.data, data.roomID, data.doc);
					socket.emit('enterRoom', {data: data});
					permission = true;
				} else { return; }
				socket.emit("update", {
					name: "Chatroom",
					text: "A room has been created. id: " + data.roomID + " at time: " + Date()
				}); 

			}
		});

		socket.on("docJoinRoom", function(data) {
			if (doctors[data.data.name].room) {
				socket.emit("update", {
					name: "Chatroom",
					text: "You are in a room. Feel free to chat with the doctor."
				});
				return;				
			}
			
			getDocInfo(socket, data.data, data.roomID, data.doc);
			socket.emit("update", {
				name: "Chatroom",
				text: "A room has been created. id: " + data.roomID + " at time: " + Date()
			}); 
		});

		socket.on("chatRoomCheck", function(fn) {
			var match = false;
			if (people[socket.id].inroom !== null) {
				return match = true;
			} else {
				return match = false;
			}
			fn({result: match});
		});

		socket.on("sendExitNotice", function(data){
			io.sockets.in(data.room).emit('commenceExit', {
				name: "Chatroom",
				text: "The doctor has denied your request."
			});			
		});

		//allows user to cleanly leave the room
		socket.on("forceLeaveRoom", function(data){
			if (!data){
				return false;
			}
			var n = sox[socket.id].name,
				ind = determine(n),
				r = ind.room;

			if (!rooms[r]){
				return false;
			} else {
				var rID = rooms[r].getTimeCreated();
				if (!ind) { 
					return false; 
				}
				var a = ind.authorization,
					givenName;
				if (ind.room === null) {
					socket.emit("update", {
						name: "Chatroom",
						text: "You are not in a room. You cannot leave a room"
					});
				} else {
					if ((permission === true) && (!!doctors[data.user])){	
						if(!!ind.user){
							redisChat.recordChatInfo(ind.id, rID, ind.user);
						} else if(!!ind.chatDoc){
							redisChat.recordChatInfo(ind.id, rID, ind.chatDoc);					
						} else {
						}
					} 
					// Do two separate functions to delete room and leave room
					leaveRoomFunction(socket, people, doctors, rooms, a, n);
				}
			}
			permission = false;
		});



// GET RID OF INDIVIDUAL!!!!!

		socket.on("leaveRoom", function(data){
			if (!data){
				return false;
			}			
			var ind = determine(data.user),
				r = data.room,
				rID = rooms[r].getTimeCreated();
			if (!ind) { 
				return false; 
			}
			var a = ind.authorization,
				givenName;
			if(a === "doctor"){
				givenName = "Dr. " + ind.lastName;
			} else {
				givenName = data.user;
			}
			if (ind.room === null) {
				socket.emit("update", {
					name: "Chatroom",
					text: "You are not in a room. You cannot leave a room"
				});
			} else {
				if ((permission === true) && (a === "doctor")){
					if(!!ind.user){
						redisChat.recordChatInfo(ind.id, rID, ind.user);
					} else if(!!ind.chatDoc){
						redisChat.recordChatInfo(ind.id, rID, ind.chatDoc);					
					} else { console.log("nopesies"); }
				} 
				leaveRoomFunction(socket, people, doctors, rooms, a, data.user);
				if (!rooms[r]){
					permission = false;
				} else {
					io.sockets.in(r).emit("commenceExit", {
						name: "Chatroom",
						text: "Your chat partner (" + givenName + ") has left the room. "
					});
				}
			}
		});

		//gets users in the chatroom
		socket.on('getPeopleList', function(data) {
			io.sockets.emit('updatePeople', {people: people, count: _.size(people), socket: socket.id});
			io.sockets.emit('updateDoctors', {doctors: doctors, count: _.size(doctors)});	
		});	

	

		function checkFields(field, name){
			if (!doctors[name]) return false;
			var f = doctors[name].fields;
			for (var i = 0; i < f.length; i++){
				if (f[i] === field) return true;
				if (i === f.length) return false;
			}
		}

		function getUserInfo(socket, data, id, doc){
			var room;
			for (var r in rooms){
				if (r === id) {
					room = rooms[r];
				}
				else {
					return false;
				}
			}

			for (var p in people){
				var x = people[p];
				if (x.socketID === data.socketID) { 
					joinRoom(socket, room, id, data);
					people[p].room = id;
					people[p].doctor = doc.fullName;
					setGenSocketInfo(socket.id, p, "people"); 
				}
			}
		}


		function getDocInfo(socket, data, id, doc){
			var room;
			for (var r in rooms){
				if (r === id) {room = rooms[r];}
				else {return false;}
			}
			for (var d in doctors){
				var x = doctors[d];
				if (x.socketID === data.socketID) { 
					joinRoom(socket, room, id, data);
					doctors[d].room = id;
					doctors[d].chatDoc = doc.fullName;
				}
			}
		}


		function determine(user){
			var ind;
			if (user == undefined || null){ console.log("POW!"); return; } 
			else if (people[user]) {
				ind = people[user];
				return ind;
			} else if (doctors[user]) {
				ind = doctors[user];		
				return ind;	
			} else { 		
				return false; 
			}		
		}

		function setPersonInfo(people, user, socket){
			return people[user.name] = {
				name: user.name,
				email: user.email,
				field: user.field,
				insurance: user.insurance,
				seenDoctor: user.seenDoctor,
				issue: user.issue,
				permission: user.permission,
				authorization: user.authorization,
//				id: user.id,
				socketID: socket.id,
				room: null,
				doctor: null
			};
		}

		function setDoctorInfo(doctors, user, socket){
			if (!doctors[user.name]){
				return doctors[user.fullName] = {
					fullName: user.fullName,
					firstName: user.firstName,
					lastName: user.lastName,
					middleName: user.middleName,
					email: user.email,
					fields: user.fields,
					university: user.university,
					work: user.work,
					authorization: user.authorization,
					id: user.id,
					socketID: socket.id,
					chatDoc: null,
					room: null,
					user: null
				};
			} else {
				return;
			}
		}

		function setGenSocketInfo(id, name, type){
			return sox[id] = {
				name: name,
				type: type
			}
		}

		function sendInvite(data, io, room, id, doc, sock){
			io.to(sock).emit('comeJoinRoom', {data: data.user, roomID: id, doc: doc});
		}
	});
};
