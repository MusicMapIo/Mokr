var path = require('path');
var paths = require('./paths');

var Fixture = module.exports = function Fixture (name) {
	this.name = name;
	this.path = path.join(paths().fixtureDir, this.name);
	this.hasRun = false;
	this.dateRun = null;
	this.dependsOn = [];
	this.dependencies = {};
	this.state = {};
	this.up = null;
	this.down = null;
};

Fixture.prototype.toJSON = function () {
	return {
		name: this.name,
		hasRun: this.hasRun,
		dateRun: this.dateRun ? this.runDown.toString() : undefined,
		state: this.state
	};
};
