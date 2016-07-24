var loadFixture = require('./load-fixture');

module.exports = function runDown (state, name, done) {
	// Fixture doesnt exist
	if (!state.fixtures[name]) {
		return done(new Error('No such fixture: ' + name));
	}

	// Fixture already run
	if (!state.fixtures[name].hasRun) {
		return done(null);
	}

	loadFixture(state.fixtures[name]);
	state.fixtures[name].down(function (err) {
		if (err) {
			return done(err);
		}
		state.fixtures[name].hasRun = false;
		done(null);
	});
};
