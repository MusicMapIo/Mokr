/* global describe, it, before, beforeEach, afterEach */
var assert = require('assert');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var binPath = path.join(__dirname, '..', 'bin', 'mokr');

describe('mokr init', function () {
	var cwd = process.cwd();
	var tmp;
	before(function () {
		tmp = path.join(__dirname, 'fixtures', 'tmp');
		rimraf.sync(tmp);
	});
	beforeEach(function () {
		mkdirp.sync(tmp);
		process.chdir(tmp);
	});
	afterEach(function () {
		process.chdir(cwd);
		rimraf.sync(tmp);
	});

	it('should build a fully working mokr environment', function (done) {
		var p = exec(binPath + ' init', function (err) {
			assert(!err);
			assert(fs.existsSync(path.join(tmp, 'mokr')));
			assert(fs.existsSync(path.join(tmp, 'mokr', 'fixtures')));
			assert(fs.existsSync(path.join(tmp, 'mokr', 'data')));
			assert(fs.existsSync(path.join(tmp, 'mokr', '.mokr')));

			var s = JSON.parse(fs.readFileSync(path.join(tmp, 'mokr', '.mokr')));
			assert.equal(typeof s.fixtures, 'object');
			assert.equal(s.version, 1);

			done();
		});

		// Answer prompts
		var npmInitAnswered = false;
		var installFakerAnswered = false;
		p.stdout.on('data', function (d) {
			if (!npmInitAnswered && d.indexOf('npm init') !== -1) {
				npmInitAnswered = true;
				setTimeout(function () {
					p.stdin.write('n\n');
				}, 10);
			}

			if (!installFakerAnswered && d.indexOf('install faker') !== -1) {
				installFakerAnswered = true;
				setTimeout(function () {
					p.stdin.write('n\n');
				}, 10);
			}
		});
	});
});
