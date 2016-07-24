var fs = require('fs');

module.exports = function saveState (state, path, done) {
	fs.writeFile(path, JSON.stringify(state), done);
};
