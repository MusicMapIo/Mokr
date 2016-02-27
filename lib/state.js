var fs = require('fs');
var path = require('path');
var series = require('run-series');
var Logger = require('./logger');
var Fixture = require('./fixture');
var logger = null;

var State = module.exports = function State (path) {
	this.fixtures = {};
	this.path = path;
	if (!logger) {
		logger = Logger();
	}
};

State.prototype.save = function (done) {
	var json = JSON.stringify(this);
	fs.writeFile(this.path, json, done);
};

State.prototype.exists = function (done) {
	if (!this.path) {
		return done(new Error('No path'));
	}
	fs.exists(this.path, done);
};

State.prototype.load = function (done) {
	if (!this.path) {
		return done(new Error('No path'));
	}

	this.exists(function (exists) {
		if (!exists) {
			return done(new Error('State file does not exist'));
		}

		// Load the file
		fs.readFile(this.path, 'utf8', function (err, json) {
			// If the file doesnt exist, just read
			// the fixtures from the directory
			if (err) {
				return this.readFixtures(done);
			}

			// Parse the json
			try {
				var d = JSON.parse(json);
			} catch (err) {
				// Invalid state file, just read
				// from the fixtured directory
				// and log the error
				logger.error('Invalid state file', err);
				return this.readFixtures(done);
			}

			// Set the fixture data
			for (var i in d.fixtures) {
				this.add(i);
				this.fixtures[i].hasRun = d.fixtures[i].hasRun;
				this.fixtures[i].state = d.fixtures[i].state || {};
			}

			// Load the fixtures directory
			this.readFixtures(done);
		}.bind(this));
	}.bind(this));
};

State.prototype.readFixtures = function (done) {
	var dir = path.join(path.dirname(this.path), 'fixtures');
	fs.readdir(dir, function (err, files) {
		if (err) {
			return done(err);
		}

		files.forEach(function (file) {
			this.add(path.basename(file, path.extname(file)));
		}.bind(this));
		done(null);
	}.bind(this));
};

State.prototype.add = function (name) {
	if (this.fixtures[name]) {
		return;
	}
	this.fixtures[name] = new Fixture(name);
};

State.prototype.runDown = function (name, done) {
	if (!this.fixtures[name]) {
		return done(new Error('No such fixture: ' + name));
	}

	if (!this.fixtures[name].hasRun) {
		return done(null);
	}

	this.fixtures[name].load();
	logger.notice('Tearing down fixture: ' + name);
	this.fixtures[name].down(function (err) {
		if (err) {
			return done(err);
		}
		this.fixtures[name].hasRun = false;
		done(null);
	}.bind(this));
};

State.prototype.runUp = function (name, done) {
	if (!this.fixtures[name]) {
		return done(new Error('No such fixture: ' + name));
	}

	this.fixtures[name].load();
	if (this.fixtures[name].hasRun) {
		logger.debug('Fixture already run');
		return done(null);
	}

	// Run deps
	var fncs = this.fixtures[name].dependsOn.map(function (dep) {
		this.fixtures[name].dependencies[dep] = this.fixtures[dep];
		return function (done) {
			this.runUp(dep, done);
		}.bind(this);
	}.bind(this));

	series(fncs, function (err) {
		if (err) {
			return done(err);
		}

		// Run the main fixture
		logger.notice('Setting up fixture: ' + name);
		this.fixtures[name].up(function (err) {
			if (err) {
				return done(err);
			}
			this.fixtures[name].hasRun = true;
			done(null);
		}.bind(this));
	}.bind(this));
};
