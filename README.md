# Mokr - A data fixture and mock framework

Mokr is a CLI tool for creating and running mock data sets.  These mocks can be for unit testing or feature development.

## Setup

To get started you need to install the mokr cli tool globally:

```
$ npm install -g mokr
```

This will give you the mokr cli tools which can scaffold out and create your first fixtures for you. To setup for fixtures directory run:

```
$ mokr init
```

This will setup the fixtures and data directories, as well as install [Faker](https://github.com/Marak/faker.js) which is a helpful tool for generating fake data for your fixtures.  Now that the directories are in place you can create your first fixture:

```
$ mokr create my-awesome-fixture
```

This will create two files for you, `./mokr/fixtures/my-awesome-fixture.js` and `./mokr/data/my-awesome-fixture.js`.  The file in data is where your mock data should live.  This is stored separately from the fixture itself to allow for reuse across other fixtures, there is no need to use this file if you already have the mock data you need.  The fixture file should export `up` and `down` methods which should implement setup and teardown logic.

## Using Your Fixtures

To use the fixtures you have setup all you have to do is run them:

```
$ mokr up my-awesome-fixture
```

This will run through the fixtures of the given name(s).  To see which fixtures have been run you can always check the fixture status with:

```
$ mokr status

Fixture Status:
=====================

my-awesome-fixture: Run
```

You can tear down a fixture with the `down` command.

## Dependencies

You can declare dependencies between your fixtures with the `dependsOn` key in the fixture exports.  This means that Mokr will ensure that the proper fixtures will be run first, thus giving you access to their state.

Here is an example of using dependencies to create posts for users created in a `users` fixture:

```javascript
var data = require('../data/posts'),
	request = require('request');

module.exports.dependsOn = ['users'];

module.exports.up = function() {
	data.forEach(function(post) {
		request({
			method: 'POST',
			url: 'http://localhost:1234/api/posts',
			json: true,
			body: {
				// users.state is the user state setup in the users fixtures
				user: this.dependencies.users.state[0].id,
				post: post
			}
		}, function() {

		}.bind(this));
	}.bind(this));
};

```

## Keeping State

When generating random data, it is helpful to store state across fixture runs.  This can be done on any fixture with the `state` key.  Here is an example of generating a bunch of random users and keeping their unique id's for teardown:

```javascript
var data = require('../data/users'),
	request = require('request');

module.exports.up = function(next) {
	var run = 0;
	var errors = null;

	// Save the user id's for teardown
	this.state.userIds = [];

	data.forEach(function(user) {
		request({
			method: 'POST',
			url: 'http://localhost:1234/api/users',
			json: true,
			body: user
		}, function(err, resp, body) {
			if (!err && resp.statusCode > 300) {
				err = new Error('Non 200 response');
			}
			if (err) {
				if (errors === null) {
					errors = [err];
				} else {
					errors.push(err);
				}
			}

			if (!err && body) {
				this.state.userIds.push(body.id);
			}

			run++;
			if (run === data.length) {
				next(errors);
			}
		}.bind(this));
	}.bind(this));
};

module.exports.down = function(next) {
	var users = this.state.userIds || [];
	var run = 0;
	var errors = null;

	users.forEach(function(id) {
		request({
			method: 'DELETE',
			url: 'http://localhost:1234/api/users/' + id
		}, function(err, resp, body) {
			if (!err && resp.statusCode > 300) {
				err = new Error('Non 200 response');
			}
			if (err) {
				if (errors === null) {
					errors = [err];
				} else {
					errors.push(err);
				}
			}

			if (!err) {
				this.state.userIds.splice(this.state.userIds.indexOf(id), 1);
			}

			run++;
			if (run === data.length) {
				next(errors);
			}
		}.bind(this));
	}.bind(this));
};
```
