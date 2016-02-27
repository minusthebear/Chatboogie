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
// 	,	RedisSocket = require('./routes/RedisSocket')

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
	// Working on this now
	// I tried cookieParser.signedCookie(parsedCookie['connect.sid'], config.secret) like one a Redis book
	// of mine said to try, but it kept breaking.
	// I'm exploring using a function I found on StackOverflow, parseCookies(), to get the cookie information
	// and then use that for authentication. If you know a better way, I'd love to know.
  var parseCookie = cookieParser(config.secret);

  var handshake = socket.request;
	var parsedCookie = handshake.headers.cookie;
	//console.log(parsedCookie);
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
	
	//console.log("parseCookie:");

	var func = cookieParser;

	cookieParser(config.secret)(req, null, function(){});

	var name = req.cookies.user;


  parseCookie(handshake, null, function (err, data) {
      sessionService.get(handshake, function (err, session) {
          //console.log(session);
          if (err)
              next(new Error(err.message));
          if (!session || (session == null || undefined || false))
              next(new Error("Not authorized"));
              
          if (!!session.isAuthenticated) {
            console.log("SESSION IS AUTHENTICATED!!!");
    			} else {
    				//console.log("No session to report");
    			}
		
          handshake.session = session;
//      //console.log(handshake);
//			//console.log(session);
//			//console.log(handshake.headers.cookie);
/*
* 			Find out a way to have this cookie be unique to this site.
* 			Currently this cookie is also sharing the cookie with IOI chat
* 			Make this cookie unique.
* 
*/
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
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message,
        error: {}
    });
});

// var SocketServer = server.listen(config.port);

server.listen(config.port);

module.exports = app;
