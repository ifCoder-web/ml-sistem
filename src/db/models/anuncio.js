const mongoose = require('mongoose')
const { Schema } = mongoose

// Model
const anuncio_schema = new Schema({
	"id_item": { type: String, require: true },
	"title": { type: String, require: true },
	"price": [
		{
			"data": { type: Date, default: Date.now },
			"iten_price": { type: String }
		}
	],
	"ant_price": { type: String },
	"atu_price": { type: String },
	"base_price": { type: String, require: true },
	"currency_id": { type: String, require: true },
	"start_time": { type: String, require: true },
	"permalink": { type: String, require: true },
	"thumbnail": { type: String, require: true },
	"condition": { type: String, require: true },
	"qtd_vendas":[
		{
			"data": { type: Date, default: Date.now },
			"nvendas": { type: Number }
		}
	],
	"t_vendas": { type: Number },
	"m_vendas": { type: Number, default: 0 },
	"s_vendas": { type: Number, default: 0 },
	"d_vendas": { type: Number, default: 0 },
	"qtd_estoque": { type: String, require: true }
})

const Anuncio = mongoose.model('Anuncio', anuncio_schema)

module.exports = Anuncio