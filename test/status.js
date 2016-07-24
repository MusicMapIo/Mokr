/* global describe, it, beforeEach, afterEach */
var assert = require('assert');
var path = require('path');
var exec = require('child_process').exec;
var paths = require('../lib/paths');
var binPath = path.join(__dirname, '..', 'bin', 'mokr');
var fixture = path.join(__dirname, 'fixtures');

describe('status', function () {
	var cwd = process.cwd();
	beforeEach(function () {
		process.chdir(fixture);
		paths(fixture);
	});
	afterEach(function () {
		process.chdir(cwd);
	});

	it('should show status', function (done) {
		exec(binPath + ' status', function (err, stdout, stderr) {
			assert(!err, err);
			assert.notEqual(stdout.indexOf('✘  foo'), -1);
			assert.notEqual(stdout.indexOf('✘  bar'), -1);
			done();
		});
	});
});
