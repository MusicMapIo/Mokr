var each = require('each-async'),
	request = require('request'),
	users = require('../data/users');

module.exports.up = function(next) {
	each(users, function(user, i, done) {
		request({
			method: 'POST',
			url: 'http://localhost:3456/api/users',
			json: true,
			body: user
		}, done);
	}, next);
};

module.exports.down = function(next){
	each(users, function(user, i, done) {
		request({
			method: 'DELETE',
			url: 'http://localhost:3456/api/users/' + user.id
		}, done);
	}, next);
};
