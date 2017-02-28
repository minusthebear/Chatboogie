The goal of this application is to show my progress and burgeoning skills as a programmer. The application is a two-tiered chat application, one where privileged users ("doctors") and non-privileged users ("users") can chat with one another.

This application uses the MEAN Stack framework (MongoDB, Express, Angular.JS, Node.JS). I use Socket.IO for real-time bidirectional communication. I use Redis as the data structure store.

There are two options on this page: you can either register as a temporary "user" and your information is erased in a half-hour, or you could register as a "doctor" and have your information stored.

Users fill out a form and are then connected to a chat room to await a doctor for a chat.
Doctors can chat with users or other doctors. Doctors can only chat with users who check one of the doctor's fields of expertise. Doctors can also post "tasks" for themselves which are dated and stored by Redis. Users can choose whether or not their chats are archived by Redis for their doctor to access at a later time.

Please explore the application!

// Run with nodemon app.js
// It should be in development mode. If not, type in export NODE_ENV=development

// Make sure Redis and Mongod are running.

//  runs on port 3000

