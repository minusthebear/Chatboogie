var redis = require('redis');
var config = require('../config');

var RedisClient = redis.createClient(config.redisPort, config.redisHost);

RedisClient.on("error", function(err) {
  console.error("Error within Redis: ", err);
});

exports.redisClient = RedisClient;
