// App designed by Matthew Hamann, matt.hamann1982@gmail.com

var express = require('express') 
  , app = express()
  , sess = require('express-session')
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , redis = require('redis')
  , RedisClient = require('./server/redis')
  , config = require('./server/config')
  , cookieParser = require('cookie-parser')
  , sessionService = require('./server/redis/session-service')
  , cookie = require('cookie');

// Redis and Socket-related connections
var redisStore = require('connect-redis')(sess);
var RedisStore = new redisStore(RedisClient);
var Room = require('./server/models/Room');
var SocketFunc = require('./server/socket/SocketFunc');


sessionService.initializeRedis(RedisClient, RedisStore);

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    console.log(list);

    return list;
}

SocketFunc(io, Room);
var socketConnection = require('./server/socket/Socket');
socketConnection(io, Room, SocketFunc);
require('./server/express')(app, RedisStore);
require('./routes/index')(app, RedisClient, io);


io.use(function (socket, next) {
  var parseCookie = cookieParser(config.secret);

  var handshake = socket.request;
	var parsedCookie = handshake.headers.cookie;
	var Cookies = parseCookies(socket.request);

  console.log("parsedCookie");
  console.log(parsedCookie);
  console.log("Cookies");
  console.log(Cookies);
	var req = {
		"headers": {
			"cookie": parsedCookie
		}
	};
	
	var func = cookieParser;

	cookieParser(config.secret)(req, null, function(){});

	var name = req.cookies.user;


  parseCookie(handshake, null, function (err, data) {
      sessionService.get(handshake, function (err, session) {
          if (err)
              next(new Error(err.message));
          if (!session || (session == null || undefined || false))
              next(new Error("Not authorized"));
              
          if (!!session.isAuthenticated) {
            console.log("SESSION IS AUTHENTICATED!!!");
    			} 
		
          handshake.session = session;
          next();
      });
  });
});



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production'){
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error.html', {
          message: err.message,
          error: {}
      });
  });
}

server.listen(config.port);

module.exports = app;
