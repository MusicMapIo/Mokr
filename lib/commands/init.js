var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var mkdirp = require('mkdirp');
var inquirer = require('inquirer');
var saveState = require('../save-state');
var State = require('../state');
var initPackage = require('init-package-json');

module.exports = {
	buildAndRunPrompts: buildAndRunPrompts,
	npmInit: npmInit,
	installFaker: installFaker,
	createMokrStuff: createMokrStuff
};

function buildAndRunPrompts (cwd, done) {
	var prompts = [];
	fs.exists(path.resolve(cwd, './package.json'), function (exists) {
		// Only ask to npm init when package.json doesn't exist
		if (!exists) {
			prompts.push({
				name: 'npmInit',
				type: 'confirm',
				message: 'It looks like this is not a node package yet, would you like to run npm init?',
				default: 'Y'
			});
		}

		// Ask if you want to install faker for data generation
		prompts.push({
			name: 'installFaker',
			type: 'confirm',
			message: 'Would you like to install faker for random data generation?',
			default: 'Y'
		});

		// Run user prompts
		inquirer.prompt(prompts).then(function (answers) {
			done(null, answers);
		}, function (err) {
			done(err);
		});
	});
}

function npmInit (cwd, done) {
	initPackage(cwd, path.resolve(process.env.HOME, '.npm-init'), {}, function (err, data) {
		if (err) {
			return done(err);
		}
		done();
	});
}

function installFaker (cwd, done) {
	exec('npm install --save faker', {
		cwd: cwd
	}, function (err, stdout, stderr) {
		if (err) {
			return done(new Error(err.message + '\n' + stderr));
		}
		done();
	});
}

function createMokrStuff (cwd, done) {
	mkdirp(path.resolve(cwd, './mokr'), function (err) {
		if (err) {
			return done(err);
		}
		mkdirp(path.resolve(cwd, './mokr/data'), function (err) {
			if (err) {
				return done(err);
			}

			mkdirp(path.resolve(cwd, './mokr/fixtures'), function (err) {
				if (err) {
					return done(err);
				}

				// Create state file
				var state = new State();
				saveState(state, path.join(cwd, 'mokr', '.mokr'), function (err) {
					if (err) {
						return done(err);
					}
					done();
				});
			});
		});
	});
}
