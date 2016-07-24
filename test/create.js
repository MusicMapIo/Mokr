/* global describe, it, after, beforeEach, afterEach */
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var binPath = path.join(__dirname, '..', 'bin', 'mokr');
var fixture = path.join(__dirname, 'fixtures');
var paths = require('../lib/paths');

describe('mokr create', function () {
	var cwd = process.cwd();
	beforeEach(function () {
		process.chdir(fixture);
		paths(fixture);
	});
	afterEach(function () {
		process.chdir(cwd);
	});
	after(function () {
		fs.unlinkSync(path.join(fixture, 'mokr', 'fixtures', 'baz.js'));
		fs.unlinkSync(path.join(fixture, 'mokr', 'data', 'baz.js'));
	});

	it('should create a new fixture', function (done) {
		exec(binPath + ' create baz', function (err) {
			assert(!err, err);
			assert(fs.existsSync(path.join(fixture, 'mokr', 'fixtures', 'baz.js')));
			assert(fs.existsSync(path.join(fixture, 'mokr', 'data', 'baz.js')));

			var s = JSON.parse(fs.readFileSync(path.join(fixture, 'mokr', '.mokr')));
			assert.equal(typeof s.fixtures.baz, 'object');
			assert.equal(s.fixtures.baz.hasRun, false);

			done();
		});
	});
});
