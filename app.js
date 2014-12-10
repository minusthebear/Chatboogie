var express = require('express') 
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , mongoose = require('mongoose')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

require('./server/express')(app);
var Room = require('./routes/Room');
require('./routes/Socket')(io, Room);






// Run with nodemon app.js
// It should be in development mode. If not, type in export NODE_ENV=development
// To run in production mode, type in export NODE_ENV=production then run nodemon server.js
// Database name is doctorchat

/*
 *	You will need to start a new database. Follow these instructions.
 *  Open a terminal, find the mongo folder and in the command prompt enter " mongod ". Mongod should open. 
 *  Open a new terminal and type in mongo. Type in "use doctors", then "db.users.find()"
 *  If there is a doctorchat database, enter db.users.remove() into the command prompt.
 *  Shut down Mongo. 
 *  Save this server.js file. 
 *  Restart mongod
 *  Run nodemon server.js, then after it gets up and running shut it down.
 *  Restart Mongo. Type in "use doctorchat" and "db.users.find()". You should see the new database there.
 * 
 * 
 * */


require('./server/routes')(app);


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

server.listen(3000);


module.exports = app;
