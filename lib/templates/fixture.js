module.exports = function (data) {
	return [
		'var data = require(\'../data/' + data.name + '\');',
		'',
		'module.exports.up = function (next) {',
		'	next();',
		'};',
		'',
		'module.exports.down = function (next) {',
		'	next();',
		'};',
		''
	].join('\n');
};
