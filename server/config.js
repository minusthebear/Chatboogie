var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

module.exports = {
	development: {
		db: 'mongodb://localhost/doctors',
		rootPath: rootPath,
		port: process.env.PORT || 3000
	},
	production: {
		rootPath: rootPath,
		db: 'mongodb://mattdoescomputers:SeaweedIsDelicious@ds061370.mongolab.com:61370/doctors',
		port: process.env.PORT || 80
	}
}
