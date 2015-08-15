var Logger = require('loggerr');

module.exports = function(app) {
	// Log level
	var level = 'notice';
	if (app.debug) {
		level = 'debug';
	} else if (app.silent) {
		level = 'emergemcy';
	}

	// Setup logger
	return new Logger({
		formatter: require('loggerr/formatters/cli'),
		level: Logger.levels.indexOf(level)
	});
};
