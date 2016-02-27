var client = require('./index').redisClient,
  Q = require('q');  
var redisKeys = Q.nbind(client.keys, client);
var redisHGetAll = Q.nbind(client.hgetall, client);
var redisSMembers = Q.nbind(client.smembers, client);
var redisSIsMember = Q.nbind(client.sismember, client);

var addDoctor = function addDoctor(id, doc, req, res, next){
	var fields = Object.keys(doc.fields);

	function middleName(id, doc){
		if (doc.middleName){ return client.hset(id, "middleName", doc.middleName); }
		else { return; }
	}

	return Q.all([Q.ninvoke(client, 'sadd', 'Doctors', id),
					Q.ninvoke(client, 'hmset', id, "lastName", doc.lastName, "firstName", doc.firstName, "email", doc.email, "university", doc.university, "work", doc.work),
					Q.ninvoke(client, 'sadd', id + ':fields', fields),
					middleName(id, doc)]).then(function(x){
						return getInfo(id, req, res, next);
					}, function (err) { res.status(404); });
};

var editDoctor = function editDoctor(id, doc, req, res, next){
	var y, z, fields = Object.keys(doc.fields);

	return redisSMembers(id + ':fields').then(function(x){
		y = editFirstPart(x, fields);
		z = editFirstPart(fields, x);
		Q.ninvoke(client, 'hmset', id, "lastName", doc.lastName, "firstName", doc.firstName, "email", doc.email, "university", doc.university, "work", doc.work);
		if (y.uniques.length > 0){
			Q.ninvoke(client, 'sadd', id + ':fields', y.uniques);
		}
		if (z.uniques.length > 0){
			Q.ninvoke(client, 'srem', id + ':fields', z.uniques);			
		}
		if (doc.middleName){
			Q.ninvoke(client, 'srem', id + ':fields', z.uniques);			
			delete y; delete z;
			return getInfo(id, req, res, next);
		} else {
			delete y; delete z;
			return getInfo(id, req, res, next);
		}
	}, function (err) { res.status(404); });

//	return true;
};
// Fuck with this later.
var getInfo = function getInfo(id, req, res, next){
	console.log("IN GET INFO");
	console.log(id);
	redisHGetAll(id).then(function(x){
		return x;
	}, function (err) { res.status(404); }).then(function(data){
		redisSMembers(id + ':fields').then(function(reply){
			data['fields'] = reply;
			res.send(data);
		}, function (err) { res.status(404); });
	}, function (err) { res.status(404); });
};

var doctorCheck = function doctorCheck(id, res, next){
	return redisSIsMember("Doctors", id).then(function(reply){
		if (reply > 0){
			res.send({success: true});
		} else {
			res.send({success: false});
		}
	}, function (err) { res.status(404); });
};

var data = {
	lastName: null,
	firstName: null,
	middleName: null,
	email: null,
	university: null,
	work: null,
	fields: null
};

function editFirstPart(x, y){
	var array1 = [], array2 = [], array3 = [];	
	y.filter(findUniques);		

	function findUniques(obj){
		if (x.indexOf(obj) > -1){
			array1.push(obj);
		} else {
			array2.push(obj);
		}
	}
	var collection = {
		duplicates: array1,
		uniques: array2
	};
	return collection;
}

function findByMatchingProperties(x) {
	for (var y in x){
		checkData(y, x[y]);
	}		

	function checkData(y, z){
		for (var d in data){
			if (d === y){
				data[d] = z;
			}
		}
	}
}

exports.addDoctor = addDoctor;
exports.editDoctor = editDoctor;
exports.doctorCheck = doctorCheck;
exports.getInfo = getInfo;