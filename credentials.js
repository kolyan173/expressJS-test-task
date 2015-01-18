module.exports = {
	mongo: {
		development: {
			connectionString: 'mongodb://admin:admin' + 
				'@ds029630.mongolab.com:29630/first_db'
		},
		production: {
			connectionString: 'mongodb://admin:admin' + 
				'@ds029630.mongolab.com:29630/first_db'
		},
	}
};