module.exports = function addFixtureToState (state, fixture) {
	// Only allow one fixture with a given name
	if (state.fixtures[fixture.name]) {
		return;
	}
	state.fixtures[fixture.name] = fixture;
};
