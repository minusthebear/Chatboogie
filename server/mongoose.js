var express = require('express') 
  , mongoose = require('mongoose');

module.exports = function(app) {

		

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


};
