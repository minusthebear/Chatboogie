var passport = require('passport')
, session = require('express-session');

module.exports = function(app, sessionSockets) {
	
	app.get('/partials/*', function(req, res) {
		res.render('public/partials/' + req.params[0]);
	});
	
	app.post('/peopleLogin', function(req, res, next) {
		if(err) {
			console.log('An error'); 
			return next(err);
		}
		req.session.user = req.body.user;
		res.json({"error":""});
		console.log("This is being read.");
	});
	
	app.post('/login', function(req, res, next) {
		var auth = passport.authenticate('local', function(err, user){
			if(err) {
				console.log('An error'); 
				return next(err);
			}
			if(!user) { 
				res.send({success:false}); 
				console.log('This is false');
			}
			req.logIn(user, function(err) {
				
				if(err) { return next(err); }
				res.send({ success:true, user: user });
				req.session.user = req.body.user;
				console.log('This is true');
			});
		});
		auth(req, res, next);
	});

	app.get('*', function(req, res){
		res.render('index.html');
	});

};
