
var passport = require('passport'),
	Q = require('q'),
	doctorDB = require('../server/redis/doctorDB'),
	tasks = require('../server/redis/doctorTasks'),
	chat = require('../server/redis/doctorChat'), 
	moment = require('moment'), 
	createSendToken = require('../server/models/jwt'), 
	jwt = require('jsonwebtoken'),
	config = require('../server/config');

module.exports = function(app, redisClient, io) {
/* GET home page. */

	var info = null;

	app.use(function (req, res, next) {
	    res.renderWithData = function (view, model, data) {
	        model.data = JSON.stringify(data);
	        res.render(view, model);
	    };
	    next();
	});

	app.get('/index', function(req, res, next){
		res.render('index.html');
	});

	app.get('/frontPage', function(req, res, next){
		res.render('register.ejs');
	});

	app.post('/reg', passport.authenticate('local-temp-register', 
		{	successRedirect: '/user',
			failureRedirect: '/regUser',
			message: null,
			failureFlash: true
		}));

	app.get('/user', function(req, res, next){
		var thingToSend = { username: req.user.username, 
							authorization: req.user.authorization }; 
		res.render('user.ejs', thingToSend);
	});

	app.get('/frontPageDoctor', function(req, res, next){
		res.render('doctor_login.ejs');
	});

	app.get('/registerDoctor', function(req, res, next){
		res.render('doctor_register.ejs');
	});

	app.post('/register', passport.authenticate('local-register',
		{ 	successRedirect: '/doctor',
	        failureRedirect: '/frontPageDoctor',
	        message: null,
	        failureFlash: true
		}));

	app.post('/login', passport.authenticate('local-login',
		{ 	successRedirect: '/doctor',
	        failureRedirect: '/frontPageDoctor',
	        message: null,
	        failureFlash: true
		}));

	app.get('/doctor', function(req, res, next){
		console.log("DOCTOR");
		var thingToSend;
		if (req.user){
			var token = createSendToken(req.user, config.secret);
			thingToSend = {
				token: token,
				id: req.user._id,
				username: req.user.username,
				authorization: req.user.authorization
			};
			res.render('doctor.ejs', thingToSend);
		 } else {
		 	thingToSend = {
				token: undefined,
				id: undefined,
				username: undefined,
				authorization: undefined		 		
		 	}
		 	res.render('doctor.ejs', thingToSend);
		 }
		
	});


	function checkAuthentication(req, res, next){
	  if (!req.headers.authorization) {
    	 return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
      }
	  var token = req.headers.authorization.split(' ')[1];
	  var payload = null;
	  try {
	    payload = jwt.verify(token, config.secret);
	  }
	  catch (err) {
	    return false;
	  }
	  if (payload.exp <= moment().unix()) {
	    return false;
	  }
	  req.user = payload.sub;
	  return true;
	}

	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) {
	   	return next();
	  } else {
	  	var x = checkAuthentication(req, res, next);
	  	if (x === true){
	  		return next();
	  	}
	  	else 
	    	res.redirect('/frontPageDoctor');
	  }
	}

	app.post('/addDoctorInfo', ensureAuthenticated, function(req, res, next){
		return doctorDB.addDoctor(req.body.id, req.body.doc, req, res, next);
	});

	app.get('/findDoctor/:id', ensureAuthenticated, function(req, res, next){
		return doctorDB.doctorCheck(req.params.id, res, next);
	});

	app.get('/getDoctorInfo/:id', ensureAuthenticated, function(req, res, next){
		console.log("GET DOCTOR INFO");
		console.log(req.params.id);
		return doctorDB.getInfo(req.params.id, req, res, next);
	});

	app.post('/editDoctorInfo', ensureAuthenticated, function(req, res, next){
		return doctorDB.editDoctor(req.body.id, req.body.doc, req, res, next);
	});

	app.post('/newTask', ensureAuthenticated, function(req, res, next){
		return tasks.newTask(req.body.id, req.body.task, req.body.date, res, next);
	});

	app.get('/getTasks/:id', ensureAuthenticated, function(req, res, next){
		console.log("get tasks");
		console.log(req.params.id);
		tasks.getTasks(req.params.id, res, next);
	});	

	app.get('/getChats/:id/:time', ensureAuthenticated, function(req, res, next){
		chat.getChats(req.params.id, req.params.time, res, next);
	});

	app.get('/getChatRooms/:id', ensureAuthenticated, function(req, res, next){
		return chat.getChatRooms(req.params.id, res, next);
	});

	//Would this be better as app.get ???
	app.post('/disconnect', function(req, res, next){
		console.log("This works");
		res.send({success: true});
	});

	app.get('/unauthorized', function(req, res, next){
		res.status(401).render('unauthorized.html');
	});

	app.all('*', function (req, res, next) {
		res.render('index.html');
	});
}
