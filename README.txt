Dec 07, 2014

As it's late, I won't go into too much detail. 
The important things to note are I've added (for people only, doctors come tomorrow)
the ability to join rooms, leave rooms, and I've begun to do coding for chatting
within a room.

I've done most edits in ChatCtrl.js and Socket.js, with the joinRoom() function
being in RoomListCtrl.js on line 11.

Everything is smooth sailing so far, except I can't figure out why when I send a 
message, either the sender gets two messages and the other sockets get one, or the 
other sockets get one and the sender none, or the sender gets two and the other sockets 
get zero. 

The relevant code in ChatCtrl.js lines 30-52 and Socket.js lines 146-163.

Also, remember I asked about adding the function to a different routing file.

Hopefully you are not broke and hungover bwahahahaha!
