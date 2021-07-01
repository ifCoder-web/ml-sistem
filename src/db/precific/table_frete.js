// ****** falta tabela de categorias especiais

const mongoose = require('mongoose');
const { Schema } = mongoose;

const table_frete = new Schema({
	data: { type: Date, default: Date.now },
	table_sul: [
		{
			a500: {
				full: { type: String },
				outros: { type: String }
			},
			d500a1: {
				full: { type: String },
				outros: { type: String }
			},
			d1a2: {
				full: { type: String },
				outros: { type: String }
			},
			d2a5: {
				full: { type: String },
				outros: { type: String }
			},
			d5a9: {
				full: { type: String },
				outros: { type: String }
			},
			d9a13: {
				full: { type: String },
				outros: { type: String }
			},
			d13a17: {
				full: { type: String },
				outros: { type: String }
			},
			d17a23: {
				full: { type: String },
				outros: { type: String }
			},
			d23a29: {
				full: { type: String },
				outros: { type: String }
			},
			d29: {
				full: { type: String },
				outros: { type: String }
			}
		}
	],
	table_outros: [
		{
			a500: {
				full: { type: String },
				outros: { type: String }
			},
			d500a1: {
				full: { type: String },
				outros: { type: String }
			},
			d1a2: {
				full: { type: String },
				outros: { type: String }
			},
			d2a5: {
				full: { type: String },
				outros: { type: String }
			},
			d5a9: {
				full: { type: String },
				outros: { type: String }
			},
			d9a13: {
				full: { type: String },
				outros: { type: String }
			},
			d13a17: {
				full: { type: String },
				outros: { type: String }
			},
			d17a23: {
				full: { type: String },
				outros: { type: String }
			},
			d23a29: {
				full: { type: String },
				outros: { type: String }
			},
			d29: {
				full: { type: String },
				outros: { type: String }
			}
		}
	],
	descontos: {
		nivel1: { type: Number },
		nivel2: { type: Number },
		nivel3: { type: Number }
	}
})

const User = mongoose.model('Frete', table_frete)

module.exports = User