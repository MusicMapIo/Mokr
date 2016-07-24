var series = require('run-series');
var loadFixture = require('./load-fixture');

module.exports = function runUp (state, name, done) {
	// Fixture doesnt exist
	if (!state.fixtures[name]) {
		return done(new Error('No such fixture: ' + name));
	}

	// Has fixture already been run?
	loadFixture(state.fixtures[name]);
	if (state.fixtures[name].hasRun) {
		return done(null);
	}

	// Build dep loaders
	var fncs = state.fixtures[name].dependsOn.map(function (dep) {
		state.fixtures[name].dependencies[dep] = state.fixtures[dep];
		return function (done) {
			state.runUp(dep, done);
		};
	});

	// Load deps
	series(fncs, function (err) {
		if (err) {
			return done(err);
		}

		// Run the main fixture
		state.fixtures[name].up(function (err) {
			if (err) {
				return done(err);
			}
			state.fixtures[name].hasRun = true;
			done(null);
		});
	});
};
