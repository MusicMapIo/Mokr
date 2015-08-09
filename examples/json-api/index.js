var app = require('express')();

var db = {
	users: []
};

app.use(require('body-parser').json());

app.get('/api/users', function(req, res) {
	res.status(200).json(db.users);
});

app.post('/api/users', function(req, res) {
	db.users.push(req.body);
	res.status(200).json(req.body);
});

app.delete('/api/users/:id', function(req, res) {
	db.users = db.users.filter(function(user) {
		return user.id !== req.params.id;
	});
	res.status(204).send();
});

app.listen(3456);
