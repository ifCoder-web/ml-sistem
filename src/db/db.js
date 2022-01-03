const mongoose = require('mongoose');
const { Schema } = mongoose;
const db = require('./config.js');

// CONNECT
const banco = async () => {
	await mongoose.connect(
		db.mongoURI, 
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	).then(() => {
		console.log("Banco de dados conectado! ")
	}).catch((error) => {
		console.error("Um erro ao se conectar com o banco de dados: "+error)
	})
}

mongoose.connection.on('error', err => {
	console.error(err)
})

module.exports = banco()