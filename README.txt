Dec 04, 2014

Before you read on, if you look at Socket.js you can see it's becoming quite
big. Maybe you have ideas on how to shrink down the size? 

Now you may read on.

ADDED FILES:
Added IDService.js to the folder js/services/
Added CreateRoom.js and RoomListCtrl.js to js/controllers

ADDED FUNCTIONALITIES

* I have added "owns" and "inroom" to each people and doctors object 
(lines 92 and 124 of Socket.js)

* With IDService.js, I solved a problem I had encountered where the user
would log in as people or doctors and get listed as whichever getService()
was first in ChatCtrl.js. With IDService, the individual gets labled as
"P" or "D" upon logging in by JoinChat.js and DoctorJoinChat.js. ChatCtrl 
on line 7 figures out which label the user belongs under.

* I have added a socket.emit('update') function which tells the users what is
happening. This also a very handy console.log-esque tool, just FYI.

* Likewise, I have added socket.emit('initialUpdate') for when the user
first logs on.

* Rooms are now listed in chat-room.html

* You are now able to create rooms. When you create a room, it activates
the CreateRoom.js controller. The function first checks to see if the object
"rooms" has a name equal to the name you have chosen by using socket.emit('check').
If the answer is no, you then begin the process of creating a room. The process
is initialized in CreateRoom.js by sending the roomName, and then the magic
happens from lines 145-181.

* I have added the Room.js file from the last project because it's a good
JavaScript template for the room.

* A unique ID is generated for the room on line 152.

* In Socket.js I expanded the disconnect function to take into account if
the user is in a room. This is still a work in progress. You will not be
able to crash the page if you refresh and disconnect even though you do not
have a socket.id thanks to line 18-19.

* Lines 62-80 of Socket.js controls leaving rooms. Obviously this is also still
a work in progress, but I haven't found any bugs thus far.
