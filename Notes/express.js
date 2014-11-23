var express = require('express');
var passport = require('passport');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = ('express-session');
var errorHandler = require('errorhandler');
//var redis = require('socket.io-redis');

module.exports = function(app, sessionStore) {

		app.use(morgan('dev'));
		app.use(cookieParser());
		app.use(bodyParser.json());
		app.use(express.methodOverride());
		app.use(express.session({store:sessionStore, key:'jsessionid', secret: 'wednesday night meat bandits'}));
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(express.static(rootPath + '/public'));
		app.use('/components', express.static(rootPath + '/components'));
		app.use('/public', express.static(rootPath + '/public'));		
		app.use('/js', express.static(rootPath + '/js'));
		app.use('/icons', express.static(rootPath + '/icons'));
		app.set('views', rootPath + '/views/');
		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');







};
