var faker = require('faker');
var range = require('lodash.range');

module.exports = range(0, 20).map(function (id) {
	var user = faker.helpers.userCard();
	user.id = id;
	return user;
});
