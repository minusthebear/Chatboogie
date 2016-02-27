var jwt = require('jsonwebtoken'),
	moment = require('moment');

module.exports = function (user, secret) {
	var payload = {
		sub: user.id,
		exp: moment().add(10, 'days').unix()
	}

	var token = jwt.sign(payload, secret);

	return token;
}