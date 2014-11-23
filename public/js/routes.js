module.exports = function(app) {
/* GET home page. */

	app.get('/partials/*', function(req, res) {
		res.render('/public/partials/' + req.params[0]);
	});

	
	app.get('*', function(req, res){
		res.render('index.html');
	});

	
}
