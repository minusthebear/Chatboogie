var express = require('express') 
  , path = require('path') 
  , rootPath = path.normalize(__dirname + '/../../')
  , favicon = require('static-favicon') 
  , logger = require('morgan') 
  , cookieParser = require('cookie-parser') 
  , bodyParser = require('body-parser') 
  , http = require('http');

module.exports = function(app) {

	app.use(favicon());
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(express.static(path.join(rootPath + '/public')));
	app.use('/components', express.static(path.join(rootPath + '/components')));			
	app.use('/js', express.static(path.join(rootPath + '/js')));
	app.use('/css', express.static(path.join(rootPath + '/css')));
	app.set('views', rootPath + '/views/');
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');

};
