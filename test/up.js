/* global describe, it, beforeEach, afterEach */
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var binPath = path.join(__dirname, '..', 'bin', 'mokr');
var fixture = path.join(__dirname, 'fixtures');
var paths = require('../lib/paths');

describe('mokr down', function () {
	var cwd = process.cwd();
	beforeEach(function () {
		process.chdir(fixture);
		paths(fixture);
	});
	afterEach(function () {
		var s = JSON.parse(fs.readFileSync(path.join(fixture, 'mokr', '.mokr')));
		s.fixtures.foo.hasRun = false;
		fs.writeFileSync(path.join(fixture, 'mokr', '.mokr'), JSON.stringify(s));

		process.chdir(cwd);
	});

	it('should run a fixture', function (done) {
		exec(binPath + ' up foo', function (err) {
			assert(!err, err);
			var s = JSON.parse(fs.readFileSync(path.join(fixture, 'mokr', '.mokr')));
			assert.equal(s.fixtures.foo.hasRun, true);
			done();
		});
	});
});