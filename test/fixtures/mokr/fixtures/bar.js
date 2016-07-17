module.exports.dependsOn = ['foo'];

module.exports.up = function (next) {
	next();
};

module.exports.down = function (next) {
	next();
};
