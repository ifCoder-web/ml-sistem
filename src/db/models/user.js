const mongoose = require('mongoose');
const { Schema } = mongoose;

const user_schema = new Schema({
	nome: {
		type: String,
		required: true
	},
	sobrenome: {
		type: String,
		required: true
	},
	lista: [
		{
			date: { type: Date, default: Date.now },
			nvendas: Number
		}
	]
})

const User = mongoose.model('User', user_schema)

module.exports = User