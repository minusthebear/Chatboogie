var passport = require('passport');

module.exports = function(app) {
/* GET home page. */

	app.get('/partials/*', function(req, res) {
		res.render('/public/partials/' + req.params[0]);
		console.log("Coming to check it out");
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
				console.log('This is true');
			});
		});
		auth(req, res, next);
	});
	
	app.get('*', function(req, res){
		res.render('index.html');
		console.log("Coming to check it out");
	});

	
}
