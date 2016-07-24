/* global describe, it, beforeEach, afterEach */
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var binPath = path.join(__dirname, '..', 'bin', 'mokr');
var fixture = path.join(__dirname, 'fixtures');
var paths = require('../lib/paths');
var State = require('../lib/state');
var loadState = require('../lib/load-state');
var saveState = require('../lib/save-state');

describe('mokr clean', function () {
	var cwd = process.cwd();
	beforeEach(function () {
		process.chdir(fixture);
		paths(fixture);
	});
	afterEach(function () {
		process.chdir(cwd);
	});

	it('should clean the state', function (done) {
		var state = new State();
		loadState(state, path.join(fixture, 'mokr', '.mokr'), function (err) {
			console.log(fixture, err);
			assert(!err);

			// modify foo

			saveState(state, path.join(fixture, 'mokr', '.mokr'), function (err) {
				assert(!err);

				exec(binPath + ' clean', function (err) {
					assert(!err);
					assert(fs.existsSync(path.join(fixture, 'mokr', '.mokr')));

					var s = JSON.parse(fs.readFileSync(path.join(fixture, 'mokr', '.mokr')));
					assert.equal(s.fixtures.foo.hasRun, false);

					done();
				});
			});
		});
	});
});
