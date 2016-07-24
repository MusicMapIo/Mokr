var fs = require('fs');
var path = require('path');
var paths = require('./paths');
var Fixture = require('./fixture');
var addFixtureToState = require('./add-fixture-to-state');

module.exports = function readFixtures (state, done) {
	fs.readdir(paths().fixtureDir, function (err, files) {
		if (err) {
			return done(err);
		}

		files.forEach(function (file) {
			addFixtureToState(state, new Fixture(path.basename(file, path.extname(file))));
		});
		done(null);
	});
};
