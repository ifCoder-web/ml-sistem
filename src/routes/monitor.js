const express = require("express")
const router = express.Router()
const fetch = require("node-fetch")
const request = require('request-promise')
const cheerio = require('cheerio')
const bodyParser  = require("body-parser")
const app = express()

// CONFIG
	app.use(bodyParser.json())
	var urlencodedParser = bodyParser.urlencoded({ extended: false })
// DB
	// Models
	const Anuncio = require('../db/models/anuncio.js')

	// ROTAS //

router.get("/", (req, res) => {
	Anuncio.find().then((data) => {

		const dados = data.map(data => data.toJSON())[0]

		// TOTAL DE VENDAS

		const t_vendas = () => {
			return dados.qtd_vendas
		}
		console.log(t_vendas)
		item = {
			title: dados.title,

		}


		res.render("./monitor/dash_monitor",{
			item: data.map(data => data.toJSON()),
		})
		// res.send(dados)
	})
	
})

router.get("/cadastro", (req, res) => {
	res.render("./monitor/cadastro")
})

router.post("/save", urlencodedParser, (req, res) => {
	const URL = "http://localhost:8081/api/item/"+req.body.id_item

	fetch(URL)
		.then((res) => res.json())
		.then((dado) => {
			const data = dado[0]
			//console.log(data)
			Anuncio.findOne({id_item: "MLB"+req.body.id_item}).then(async (dat) => {
				if(dat){
					console.log("item já cadastrado")
					res.redirect("/monitor")
				}else{
					const item = new Anuncio({
						id_item: data.api.id_item,
						title: data.api.title,
						price: [{ 
							iten_price: data.api.price[0].iten_price,
						 }],
						base_price: data.api.base_price,
						currency_id: data.api.currency_id,
						start_time: data.api.start_time,
						permalink: data.api.permalink,
						thumbnail: data.api.thumbnail,
						condition: data.scrap.condition,
						qtd_vendas:[{
							nvendas: data.scrap.qtd_vendas[0].nvendas
						}]
					})

					await item.save((err, dados) => {
						if(err){
							res.redirect("/monitor")
							return console.log("falha ao salvar o anuncio "+ err)
						}

						console.log("Anuncio salvo com sucesso!")
						res.redirect("/monitor")

					})
				}
				
			}).catch(async (error) => {
				console.log("Deu ruim: "+error)
			})
			 
			// res.send(data)
		})
		.catch((error) => {
			console.log("Deu um erro: "+error)
		})
})


app.get('/update', async (req, res) => {
	

	await Anuncio.updateOne({_id: '609d98eb5e75e324089f8e26'}, {
		$push: {qtd_vendas: {nvendas: 189}}
		
	}).then(async () => {
		await Anuncio.find().then((data) => {
			res.send(data)
		})
	})
	
	

})

module.exports = router
