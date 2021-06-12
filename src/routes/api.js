const express = require("express")
const fetch = require("node-fetch")
const request = require('request-promise')
const cheerio = require('cheerio')
const router = express.Router()


// ------ MONITOR ------

router.get("/item/:id", async (req, res) => {
	let api_item = {} // Objeto da API vazio

	// SCRAP
	const scrap_ct = async function(){
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
	}


	// API
	const api_ct = async function(){

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
					"status": corpo.body.status
				}
			}).catch((error) => {
				console.log("Deu um erro: "+error)
				res.redirect("/monitor/cadastro")
			})
	}

	var array = [scrap_ct(),api_ct()]

	await Promise.all(array).then(() => {
		res.send([api_item])
	}).catch((error) => {
		console.error("Erro ao resolver Promises "+ error)
		res.redirect("/")
	})

			
})


// ------ PRECIFIC ------

router.get('/child_category/:category_id', (req, res) => { // DEVOLVE AS CATEGORIAS FILHAS
	const URI_api = `https://api.mercadolibre.com/categories/${req.params.category_id}`
	fetch(URI_api) // Consultando API do ML
		.then((res) => res.json())
		.then(async (data) => {
			var child_category = [{
				"id": data.id,
				"name": data.name,
				"path_from_root": data.path_from_root,
				"children_categories": data.children_categories,
				"minimum_price": data.settings.minimum_price
			}]

			res.send(child_category)

		}).catch((error) => {
			console.log("Houve um erro ao consultar API de taxas do ML: "+error)
			res.redirect("/precific")
		})	
})

router.get('/fee/:category_id', (req, res) => { // DEVOLVE AS TAXAS DO MERCADO LIVRE
	const URI_api = `https://api.mercadolibre.com/sites/MLB/listing_prices?price=100&category_id=${req.params.category_id}`
	fetch(URI_api) // Consultando API do ML
		.then((res) => res.json())
		.then(async (data) => {
			var fee = []
			data.forEach((currentValue, index, arr) => {
				if(currentValue.listing_type_name == "Premium" || currentValue.listing_type_name == "Clássico"){
					fee.push({
						"listing_type_name": currentValue.listing_type_name,
						"sale_fee_amount": currentValue.sale_fee_amount,
						"currency_id": currentValue.currency_id
					})
				}
			})

			res.send(fee)

		}).catch((error) => {
			console.log("Houve um erro ao consultar API de taxas do ML: "+error)
			res.redirect("/precific")
		})
})

module.exports = router
