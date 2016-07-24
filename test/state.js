/* global describe, it, before */
var assert = require('assert');
var path = require('path');
var State = require('../lib/state');
var loadState = require('../lib/load-state');
var loadFixture = require('../lib/load-fixture');
var paths = require('../lib/paths');
var cwd = path.join(__dirname, 'fixtures');
var stateFile = path.join(cwd, 'mokr', '.mokr');

describe('state', function () {
	before(function () {
		paths(cwd);
	});

	it('should setup a state', function () {
		var s = new State();
		assert.equal(s.path, undefined);
		assert.equal(s.version, 1);
		assert.equal(typeof s.fixtures, 'object');
	});

	it('should load the state file', function (done) {
		var s = new State();
		loadState(s, stateFile, function (err) {
			assert(!err, err);
			assert(s.fixtures.foo);
			assert(s.fixtures.bar);
			done();
		});
	});

	it('should run up for a fixture', function (done) {
		var s = new State();
		loadState(s, stateFile, function (err) {
			assert(!err);
			var called = false;
			loadFixture(s.fixtures.foo);
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
		var s = new State();
		loadState(s, stateFile, function (err) {
			assert(!err);
			var called = false;
			loadFixture(s.fixtures.foo);
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
