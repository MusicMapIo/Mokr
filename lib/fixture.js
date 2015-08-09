var path = require('path');

var Fixture = module.exports = function Fixture(name) {
	this.name = name;
	this.path = path.join(process.cwd(), 'mokr', 'fixtures', this.name);
	this.hasRun = false;
};

Fixture.prototype.load = function() {
	// Already loaded?
	if (this.up && this.down) {
		return;
	}

	var m = require(this.path);
	this.up = m.up;
	this.down = m.down;
};

Fixture.prototype.toJSON = function() {
	return {
		name: this.name,
		hasRun: this.hasRun
	};
};
