module.exports = function(app) {
/* GET home page. */
	app.get('../public/partials', function(req, res) {
		res.render('../public/partials/' + req.params[0]);
		console.log("It's being read.");
	});


	app.get('/', function(req, res) {
		res.render('index.html');
		console.log("Hey");
	});
	
}
