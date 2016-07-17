var path = require('path');
var State = require('./state');

module.exports = function (cwd, done) {
	var state = new State(path.join(cwd, 'mokr', '.mokr'));
	state.load(function (err) {
		done(err, state);
	});
};
