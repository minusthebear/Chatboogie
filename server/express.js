var express = require('express') 
  , path = require('path') 
  , rootPath = path.normalize(__dirname + '/../')
  , cors = require('cors')
  , favicon = require('static-favicon') 
  , logger = require('morgan') 
  , cookieParser = require('cookie-parser') 
  , bodyParser = require('body-parser') 
  , session = require('express-session')
  , http = require('http')
  , config = require('./config')
  , Grant = require('grant-express')
  , grant = new Grant(require('./config'))
  , mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , redis = require('redis')
  , cookie = require('cookie')
  , flash = require('connect-flash')
  , bcrypt = require('bcrypt-nodejs')
  , User = require('./models/userSchema');
  
// var RedisStore = require('connect-redis')(session);

module.exports = function(app, RedisStore) {

//	var RedisStore = new RedisStore({client: RedisClient})

	app.use(favicon());
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(function(req,res,next){
	   res.setHeader('Access-Control-Allow-Origin', '*');
	   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \ Authorization');  
	   next();
	});
	app.use(cookieParser(config.secret));
	app.use(session({
		secret: config.secret,
		key: config.cookieKey,
		store: RedisStore, 
		saveUninitialized: true,
		resave: true,
		cookie: {
			path: '/',
			httpOnly: true,
			secure: false,
			maxAge: null
		}
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(grant);
	app.use(express.static(path.join(rootPath + '/public')));
	app.use('/components', express.static(path.join(rootPath + '/components')));			
	app.use('/js', express.static(path.join(rootPath + '/js')));
	app.use('/css', express.static(path.join(rootPath + '/css')));
	app.use('/partials', express.static(path.join(rootPath + '/partials')));
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

	passport.use('local-login', new LocalStrategy({
	        // by default, local strategy uses username and password, we will override with email
	        usernameField : 'username',
	        passwordField : 'password',
	        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
		function(req, username, password, done) {
			User.findOne({username:username}).exec(function(err, user) {
				if(err) {
					console.log("THIS IS AN ERROR!");
					return done(err);
				} else if(!user) { 
					console.log("NO USER");
					return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
				} else {
					console.log("IT came here");
					user.comparePasswords(password, function(err, isMatch){
						console.log("DID IT WORK?");
						if(!isMatch){
							console.log("not a match");
							return done(null, false, req.flash('loginMessage', 'Invalid username or password'));
						} else {
							console.log("IT CAME TO THE END");
							return done(null, user);							
						}
					});
				}
			});
		}
	));

	passport.use('local-register', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback

	},
	function(req, username, password, done) {
		User.findOne({username: username}, function(err, user){
			if (err){
				return done(err);
			}
			if(user)
				return done(null, false, {
					message: "Name already exists."
				});

			var newUser = new User({
				username: username,
				password: password,
				authorization: "doctor",
				expireAfterSeconds: null,
				createdAt: null
			});

			console.log(newUser);

			newUser.save(function(err){
				req.login(newUser, function(err){
					if (err){ console.log(err); }
					return done(null, newUser);
				});

			});
		});
	}));

	passport.use('local-temp-login', new LocalStrategy({
	        // by default, local strategy uses username and password, we will override with email
	        usernameField : 'username',
	        passwordField : 'password',
	        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
		function(req, username, password, done) {
			console.log('local-temp-login');
			User.findOne({username: username}).exec(function(err, user) {
				if(err) {
					console.log("ERROR!");
					return done(err);
				} else if(!user) { 
					console.log("No user!!!");
					return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
				} else {
					console.log("THIS WORKED!");
					return done(null, user);
				}
			});
		}
	));

	passport.use('local-temp-register', new LocalStrategy({
	        // by default, local strategy uses username and password, we will override with email
	        usernameField : 'username',
	        passwordField : 'password',
	        passReqToCallback : true // allows us to pass back the entire request to the callback
	    },
		function(req, username, password, done) {
			User.findOne({username: username}).exec(function(err, user) {
				if (err){
					return done(err);
				}
				if(user)
					return done(null, false, {
						message: "Name already exists."
					});

				var newUser = new User({
					username: username,
					password: password,
					authorization: "user",
					createdAt: null,
					expireAfterSeconds: 1800
				});

				console.log(newUser);

				newUser.save(function(err){
					req.login(newUser, function(err){
						if (err){ console.log(err); }
						return done(null, newUser);
					});
				});
			});
		}
	));

	passport.serializeUser(function(user, done) {
		if(user) {
			console.log("IN SERIALIZE USER");
			done(null, user._id);
		} 
	});
	passport.deserializeUser(function(id, done) {
		User.findOne({_id:id}).exec(function(err, user) {
			console.log("IN DESERIALIZE");
			if (err) done(err);

			if (user) {
				return done(null, user);
			}
		});
	});


};
