var express = require('express')
, app = express()
, server = require('http').createServer(app)
, io = require("socket.io").listen(server)
, redis = require('socket.io-redis')
, session = require('express-session')
, RedisStore = require('connect-redis')(session)
, sessionStore = new RedisStore({client:redisClient})
, mongoose = require('mongoose')
, passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;

var port = process.env.PORT || 3000;

var redisClient = redis.createClient();
io.adapter(redis({host: 'localhost', port: 6379}));

require('./public/js/express')(app, sessionStore);

server.listen(app.get('port'), app.get('ipaddr'), function(){
	console.log('Express server listening on  IP: ' + app.get('ipaddr') + ' and port ' + app.get('port'));
});

var SessionSockets = require('session.socket.io');
var sessionSockets = new SessionSockets(io, sessionStore, cookieParser, 'jsessionid');


require('./public/js/routes')(app, sessionSockets);




var sub = redis.createClient();
var pub = redis.createClient();
sub.subscribe('chat');



require('./public/js/chat-server')(app, io, sessionSockets);



// io.adapter(redis({ host: 'localhost', port: 6379}));

// Run with nodemon server.js
// It should be in development mode. If not, type in export NODE_ENV=development
// To run in production mode, type in export NODE_ENV=production then run nodemon server.js
// Database name is doctorchat

/*
 *	You will need to start a new database. Follow these instructions.
 *  Open a terminal, find the mongo folder and in the command prompt enter " mongod ". Mongod should open. 
 *  Open a new terminal and type in mongo. Type in "use doctorchat", then "db.users.find()"
 *  If there is a doctorchat database, enter db.users.remove() into the command prompt.
 *  Shut down Mongo. 
 *  Save this server.js file. 
 *  Restart mongod
 *  Run nodemon server.js, then after it gets up and running shut it down.
 *  Restart Mongo. Type in "use doctorchat" and "db.users.find()". You should see the new database there.
 * 
 * 
 */

if(app.get('env') === 'development') {
	mongoose.connect('mongodb://localhost/doctorchat');
} else {
	mongoose.connect('mongodb://mattdoescomputers:SeaweedIsDelicious@ds047950.mongolab.com:47950/doctorchat');
}
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
	console.log('multivision db opened');
});

var userSchema = mongoose.Schema({
	username: String,
	password: String
});

var User = mongoose.model('User', userSchema);
    
User.find({}).exec(function(err, collection){
	if (collection.length === 0) {
		User.create({username:'MatthewHamann', password:'SmokeWeedEveryday'});
		User.create({username:'BillyCao', password:'AllAboutTheCheddar'});
		User.create({username:'MaryHornbeck', password:'StudiesHard'});
		User.create({username:'JarredLea', password:'DoctorBones'});
		User.create({username:'Vladimir', password:'LostInRussia'});
	}
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({username:username}).exec(function(err, user) {
			if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	}
));
passport.serializeUser(function(user, done) {
	if(user) {
		done(null, user._id);
	} 
});
passport.deserializeUser(function(id, done) {
	User.findOne({_id:id}).exec(function(err, user) {
		if (user) {
			return done(null, user);
		} else {
			return done(null, false);
		}
	});
});
