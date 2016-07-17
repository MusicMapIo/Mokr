/* global describe, it, before, after */
var assert = require('assert');
var path = require('path');
var State = require('../lib/state');

describe('state', function () {
	var cwd = process.cwd();
	var stateFile;
	before(function () {
		process.chdir(path.join(__dirname, 'fixtures'));
		stateFile = path.join(process.cwd(), 'mokr', '.mokr');
	});
	after(function () {
		process.chdir(cwd);
	});

	it('should setup a state', function () {
		var s = new State(stateFile);
		assert.equal(s.path, stateFile);
	});

	it('should check if the state file exists', function (done) {
		var s = new State(stateFile);
		s.exists(function (err, exists) {
			assert(!err);
			assert(exists);
			done();
		});
	});

	it('should load the state file', function (done) {
		var s = new State(stateFile);
		s.load(function (err) {
			assert(!err);
			assert(s.fixtures.foo);
			assert(s.fixtures.bar);
			done();
		});
	});

	it('should run up for a fixture', function (done) {
		var s = new State(stateFile);
		s.load(function (err) {
			assert(!err);
			var called = false;
			s.fixtures.foo.load();
			s.fixtures.foo.up = function (done2) {
				called = true;
				done2();
			};
			s.runUp('foo', function (err) {
				assert(!err);
				assert(called);
				assert(s.fixtures.foo.hasRun);
				done();
			});
		});
	});

	it('should run down for a fixture', function (done) {
		var s = new State(stateFile);
		s.load(function (err) {
			assert(!err);
			var called = false;
			s.fixtures.foo.load();
			s.fixtures.foo.hasRun = true;
			s.fixtures.foo.down = function (done2) {
				called = true;
				done2();
			};
			s.runDown('foo', function (err) {
				assert(!err);
				assert(called);
				assert(!s.fixtures.foo.hasRun);
				done();
			});
		});
	});
});
