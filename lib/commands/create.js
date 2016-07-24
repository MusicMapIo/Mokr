var fs = require('fs');
var path = require('path');
var fixtureTmpl = require('../templates/fixture');
var dataTmpl = require('../templates/data');

module.exports = {
	createFixtureFile: createFixtureFile,
	createDataFile: createDataFile
};

function createFixtureFile (cwd, name, done) {
	var p = path.join(cwd, 'mokr', 'fixtures', name + '.js');
	fs.exists(p, function (exists) {
		if (exists) {
			return done(new Error('Fixture already exists'));
		}

		fs.writeFile(p, fixtureTmpl({
			name: name
		}), function (err) {
			if (err) {
				return done(err);
			}
			done(null, p);
		});
	});
}

function createDataFile (cwd, name, done) {
	var p = path.join(cwd, 'mokr', 'data', name + '.js');
	fs.exists(p, function (exists) {
		if (exists) {
			return done(new Error('Data file already exists'));
		}

		fs.writeFile(p, dataTmpl(), function (err) {
			if (err) {
				return done(err);
			}
			done(null, p);
		});
	});
}
