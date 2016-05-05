// App designed by Matthew Hamann, matt.hamann1982@gmail.com

var client = require('./index').redisClient,
  Q = require('q');  

var redisZR = Q.nbind(client.zrevrangebyscore, client);
var redisScan = Q.nbind(client.scan, client);
var redisHGetall = Q.nbind(client.hgetall, client);
var redisGet = Q.nbind(client.get, client);

var newTask = function newTask(id, task, dt, res, next){
	console.log("IN NEW TASK");
	var ID = id + ':tasks';
	var dTiD = id + ':time:' + dt;
	return Q.all(
		[Q.ninvoke(client, 'zadd', ID, dt, task.heading),
			Q.ninvoke(client, 'set', dTiD, task.info)])
			.then(function(x){
				res.send({success: true})
			}, function(err) { res.status(404); });
};

var getTasks = function getTasks(id, res, next) {
		var arr = {};
		var IDTasks = id + ':tasks';

		redisZR(IDTasks, '+inf', 0, 'withscores').then(function (data) {
			var obj = {}, val;
			for (var i = 0, j = 0; i < data.length; i++){
				if (j === 0){
					val = data[i];
					j++;
				} else {
					obj[data[i]] = val;
					j = 0;
				}
			}
			return obj;
		}, function (err) { /* handle error */ }).then(function (x) {
			var times = Object.keys(x);
			return Q.all(times.map(processKeysFunc(arr, x, id)));
		}, function (err) { /* handle error */ }).then(function () {
		   res.send({arr: arr});
		});
};

function findByMatchingProperties(x, key, obj, arr) {
	var f = {}, g = {};
	for (var y in x){
		if (y === key){
			g['title'] = x[y];
			g['message'] = obj;
			arr[key] = g;
		}
	}		
}

function processKeysFunc(arr, x, id) {
	return function (key) {
		var IDTime = id + ':time:' + key;
		return redisGet(IDTime).then(function (obj) {
			findByMatchingProperties(x, key, obj, arr);
		});
	}
}
exports.newTask = newTask;
exports.getTasks = getTasks;