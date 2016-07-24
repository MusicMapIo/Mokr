var fs = require('fs');
var readFixtures = require('./read-fixtures');
var Fixture = require('./fixture');
var addFixtureToState = require('./add-fixture-to-state');

module.exports = function loadState (state, path, done) {
	// Load the file
	fs.readFile(path, 'utf8', function (err, json) {
		// If the file doesnt exist, just read
		// the fixtures from the directory
		if (err) {
			return readFixtures(state, done);
		}

		// Parse the json
		try {
			var d = JSON.parse(json);
		} catch (err) {
			// Invalid state file, just read
			// from the fixtured directory
			// and log the error
			return readFixtures(state, done);
		}

		// Set the fixture data
		for (var i in d.fixtures) {
			addFixtureToState(state, new Fixture(i));
			state.fixtures[i].hasRun = d.fixtures[i].hasRun;
			state.fixtures[i].state = d.fixtures[i].state || {};
		}

		// Load the fixtures directory
		readFixtures(state, done);
	});
};
