/* global describe, it, before, after */
var assert = require('assert');
var path = require('path');
var Fixture = require('../lib/fixture');

describe('fixture', function () {
	var cwd = process.cwd();
	before(function () {
		process.chdir(path.join(__dirname, 'fixtures'));
	});
	after(function () {
		process.chdir(cwd);
	});

	it('should setup a fixture instance', function () {
		var f = new Fixture('foo');
		assert.equal(f.name, 'foo');
		assert.equal(f.path, path.join(process.cwd(), 'mokr', 'fixtures', 'foo'));
		assert.equal(f.up, null);
		assert.equal(f.down, null);
	});

	it('should load a fixture', function () {
		var f = new Fixture('foo');
		f.load();
		assert.equal(typeof f.up, 'function');
		assert.equal(typeof f.down, 'function');
	});

	it('should load a fixtures dependencies', function () {
		var f = new Fixture('bar');
		f.load();
		assert.equal(f.dependsOn[0], 'foo');
	});

	it('should export the fixture as json', function () {
		var f = new Fixture('foo');
		assert.equal(f.toJSON().name, 'foo');
		assert.equal(f.toJSON().hasRun, false);
		assert.equal(typeof f.toJSON().state, 'object');
	});
});
