const express = require("express")
const fetch = require("node-fetch")
const request = require('request-promise')
const cheerio = require('cheerio')
const router = express.Router()

router.get("/item/:id", async (req, res) => {
	let api_item = {} // Objeto da API vazio

	// API
		const URL_api = `https://api.mercadolibre.com/items?ids=MLB${req.params.id}` // URL da do catálogo do produto pra utilizar a API do ML

		fetch(URL_api) // Consultando API do ML
			.then((res) => res.json())
			.then(async (data) => {
				let corpo = data[0]

				api_item.api = {
					"id_item": corpo.body.id,
					"title": corpo.body.title,
					"price": [{ iten_price: corpo.body.price }],
					"base_price": corpo.body.base_price,
					"currency_id": corpo.body.currency_id,
					"start_time": corpo.body.start_time,
					"permalink": corpo.body.permalink,
					"thumbnail": corpo.body.thumbnail,
				}

				// SCRAP
					const URL_scrap = `https://produto.mercadolivre.com.br/MLB-${req.params.id}`
					const response = await request(URL_scrap)
					let $ = cheerio.load(response)
					// Dados brutos
					const bruto_qtd_vendas = $("#root-app .ui-vip-core .ui-pdp-container .ui-pdp-header .ui-pdp-header__subtitle .ui-pdp-subtitle").eq(0).text()
					const bruto_qtd_estoque = $("#root-app .ui-pdp-container__col .ui-pdp-container__row--available-quantity .andes-tooltip__trigger .andes-button__content .ui-pdp-buybox__quantity__available").eq(0).text()	
					// Trabalhando dados
						// Quantidade de vendas
						const format_qtd_vendas = bruto_qtd_vendas.split(' ')
						// Quantidade de em estoque
						const format_qtd_estoque = Number(bruto_qtd_estoque.replace('(', '').replace(')', '').split(' ')[0])

					api_item.scrap = {
						"condition": format_qtd_vendas[0],
						"qtd_vendas": [{ nvendas: Number(format_qtd_vendas[4]) }],				
						"qtd_estoque": format_qtd_estoque
					}
				res.send([api_item])
			})
			.catch((error) => {
				console.log("Deu um erro: "+error)
			})
})

module.exports = router