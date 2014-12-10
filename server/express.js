var express = require('express') 
  , path = require('path') 
  , rootPath = path.normalize(__dirname + '/../')
  , favicon = require('static-favicon') 
  , logger = require('morgan') 
  , cookieParser = require('cookie-parser') 
  , bodyParser = require('body-parser') 
  , http = require('http')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

module.exports = function(app) {

	app.use(favicon());
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(path.join(rootPath + '/public')));
	app.use('/components', express.static(path.join(rootPath + '/components')));			
	app.use('/js', express.static(path.join(rootPath + '/js')));
	app.use('/css', express.static(path.join(rootPath + '/css')));
	app.set('views', rootPath + '/views/');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');


	if(app.get('env') === 'development') {
		mongoose.connect('mongodb://localhost/doctors');
	} else {
		mongoose.connect('mongodb://mattdoescomputers:SeaweedIsDelicious@ds061370.mongolab.com:61370/doctors');
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
			User.create({username:'Matthew', password:'Mastodon'});
			User.create({username:'Billy', password:'GetUpKids'});
			User.create({username:'Katya', password:'Bachata'});
			User.create({username:'Jarred', password:'WhiteStripes'});
			User.create({username:'Vladimir', password:'TeslaBoy'});
		}
	});

	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({username:username}).exec(function(err, user) {
				if (user) {
					return done(null, user);
					console.log("This works");
				} else {
					return done(null, false);
					console.log("Nothing is found");
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


};
