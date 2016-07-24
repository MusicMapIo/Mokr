var path = require('path');
var p;

module.exports = function getPaths (cwd) {
	if (!p && !cwd) {
		throw new Error('Must pass cwd when first calling paths');
	}

	if (!p) {
		cwd = cwd || process.cwd();
		var root = path.join(cwd, 'mokr');
		p = {
			root: root,
			stateFile: path.join(root, '.mokr'),
			fixtureDir: path.join(root, 'fixtures'),
			dataDir: path.join(root, 'data')
		};
	}

	return p;
};
