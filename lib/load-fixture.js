module.exports = function loadFixture (fixture) {
	// Already loaded?
	if (fixture.up && fixture.down) {
		return;
	}

	var m = require(fixture.path);
	fixture.dependsOn = m.dependsOn || [];
	fixture.up = m.up;
	fixture.down = m.down;
};
