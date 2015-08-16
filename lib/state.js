var fs = require('fs'),
	path = require('path'),
	Fixture = require('./fixture');

var State = module.exports = function State(path) {
	this.fixtures = {};
	this.path = path;
};

State.prototype.save = function(done) {
	var json = JSON.stringify(this);
	fs.writeFile(this.path, json, done);
};

State.prototype.exists = function(done) {
	if (!this.path) {
		return done(new Error('No path'));
	}
	fs.exists(this.path, done);
};

State.prototype.load = function(done) {
	if (!this.path) {
		return done(new Error('No path'));
	}

	this.exists(function(err, exists) {
		if (err) {
			return done(new Error('No path'));
		}
		if (!exists) {
			return done(new Error('State file does not exist'));
		}

		// Load the file
		fs.readFile(this.path, 'utf8', function(err, json){
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
				console.error('Invalid state file', err);
				return this.readFixtures(done);
			}

			// Set the fixture data
			for (var i in d.fixtures) {
				this.add(i);
				this.fixtures[i].hasRun = d.fixtures[i].hasRun;
			}

			// Load the fixtures directory
			this.readFixtures(done);
		}.bind(this));
	}.bind(this));
};

State.prototype.readFixtures = function(done) {
	var dir = path.join(path.dirname(this.path), 'fixtures');
	fs.readdir(dir, function(err, files) {
		if (err) {
			return done(err);
		}

		files.forEach(function(file) {
			this.add(path.basename(file, path.extname(file)));
		}.bind(this));
		done(null);
	}.bind(this));
};

State.prototype.add = function(name) {
	if (this.fixtures[name]) {
		return;
	}
	this.fixtures[name] = new Fixture(name);
};

State.prototype.run = function(name, direction, done) {
	if (!this.fixtures[name]) {
		return done(new Error('No such fixture: ' + name));
	}

	if (direction === 'up' && this.fixtures[name].hasRun) {
		return done(new Error('Cowardly refusing to re-run fixture. Use --force'));
	}

	this.fixtures[name].load();
	this.fixtures[name][direction](function(err) {
		if (err) {
			return done(err);
		}
		this.fixtures[name].hasRun = direction === 'up';
		done(null);
	}.bind(this));
};

State.prototype.runDown = function(name, done) {
	this.run(name, 'down', done);
};

State.prototype.runUp = function(name, done) {
	this.run(name, 'up', done);
};
