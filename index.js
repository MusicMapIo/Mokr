var loadState = require('./lib/load-state');

module.exports = function (opts) {
	opts = opts || {};
	opts.cwd = opts.cwd || process.cwd();

	var loaded = false;
	var state;

	function load (done) {
		loadState(opts.cwd, function (err, s) {
			if (err) {
				return done(err);
			}
			loaded = true;
			state = s;
			done(null, state);
		});
	}

	function run (direction, name, done) {
		if (!loaded) {
			return load(function (err) {
				if (err) {
					return done(err);
				}
				run(direction, name, done);
			});
		}

		state['run' + direction](name, done);
	}

	return {
		runUp: run.bind(null, 'Up'),
		runDown: run.bind(null, 'Down')
	};
};
