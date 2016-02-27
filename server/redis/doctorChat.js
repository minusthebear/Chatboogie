var client = require('./index').redisClient,
  Q = require('q'),
  redisZadd = Q.nbind(client.zadd, client),
  redisHGetAll = Q.nbind(client.hgetall, client),
  redisRange = Q.nbind(client.zrange, client),
  redisZRv = Q.nbind(client.zrevrangebyscore, client),
  redisZR = Q.nbind(client.zrangebyscore, client),
  redisZCard = Q.nbind(client.zcard, client),
  dCon = require('../models/dateConverter');


var addChat = function addChat(chat, id, time){
	return client.zadd(id + ':rooms:' + time, Date.now(), JSON.stringify(chat));
};

var recordChatInfo = function recordChatInfo(id, time, partner){
	return redisZCard(id + ':allrooms').then(function(x){
		N = parseInt(x) + 1;
		return client.zadd(id + ':allrooms', N, time + ':' + partner);
	}, function (err) { console.log(err); });
}

var getChatRooms = function getChatRooms(id, res, next){
	return redisZRv(id + ':allrooms', '+inf', 0).then(function(x){
		var objArr = {};
		for (var i = 0; i < x.length; i++){
			var array = x[i].split(":");
			objArr[array[0]] = array[1];	
		}
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(objArr));
//		console.log(objArr);
//		res.send(objArr);
	}, function (err) { res.status(404); });
}

var getChats = function getChats(id, time, res, next){
	return redisZR(id + ':rooms:' + time, 0, '+inf').then(function(x){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(x));
	}, function (err) { res.status(404); });
}


var getChat = function getChat(room, cb){
  client.zrange('rooms:' + room + ':chats', 0, -1, function(err, chats){
    cb(chats);
  });
};


exports.addChat = addChat;
exports.getChats = getChats;
exports.recordChatInfo = recordChatInfo;
exports.getChatRooms = getChatRooms;