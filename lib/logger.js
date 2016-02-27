var Logger = require('loggerr');

var logger;
module.exports = function (app) {
	if (!logger) {
		// Log level
		var level = 'notice';
		if (app.debug) {
			level = 'debug';
		} else if (app.silent) {
			level = 'emergency';
		}

		// Setup logger
		logger = new Logger({
			formatter: require('loggerr/formatters/cli'),
			level: Logger.levels.indexOf(level)
		});
	}
	return logger;
};
