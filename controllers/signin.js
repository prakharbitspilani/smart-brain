const handleSignin = (db, bcrypt) => (req, res) => {
	// DB.SELECT returns a promise
	const {email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('incorrect form submission');
	}
	db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			//Here when email is wrong it doesn't comes here
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				db.select('*').from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json('unable to get user'))
			}  else {
				res.status(400).json('wrong credentials');
			}
		})
		.catch(err => res.status(400).json('wrong credentials'));
}

module.exports = {
	handleSignin: handleSignin
}