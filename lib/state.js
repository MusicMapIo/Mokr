var Fixture = require('./fixture');
var addFixtureToState = require('./add-fixture-to-state');
var saveState = require('./save-state');
var runDown = require('./run-down');
var runUp = require('./run-up');
var currentStateVersion = 1;

module.exports = function stateFactory (initialState) {
	initialState = initialState || {fixtures: {}};

	if (initialState.version !== currentStateVersion) {
		// migrate to formats
	}

	var state = new State();
	state.path = initialState.path;

	// Set the fixture data
	for (var i in initialState.fixtures) {
		var fixture = new Fixture(i);
		var f = initialState.fixtures[i];

		// Update the fixture state
		fixture.hasRun = !!f.hasRun;
		fixture.state = f.state || {};
		fixture.dateRun = f.dateRun ? new Date(f.dateRun) : null;

		addFixtureToState(state, fixture);
	}

	return state;
};

var State = module.exports.State = function State () {
	this.version = currentStateVersion;
	this.fixtures = {};
	this.path = '';
};

State.prototype.save = function (done) {
	saveState(this, done);
};

State.prototype.runDown = function (name, done) {
	runDown(this, name, done);
};

State.prototype.runUp = function (name, done) {
	runUp(this, name, done);
};

State.prototype.toJSON = function () {
	return {
		version: this.version,
		path: this.path,
		fixtures: this.fixtures
	};
};
