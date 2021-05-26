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
	// BUSCA NO DB
	Anuncio.find().then((data) => {		
		res.render("./monitor/dash_monitor",{
			item: data.map(data => data.toJSON()),
		})
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
		
			Anuncio.findOne({ id_item: "MLB"+req.body.id_item }).then(async (dat) => {
				if(dat){
					console.log("Item já cadastrado!")
					res.redirect("/monitor")
				}else{
					const item = new Anuncio({
						id_item: data.api.id_item,
						title: data.api.title,
						price: [{ 
							iten_price: data.api.price[0].iten_price,
						 }],
						ant_price: data.api.price[0].iten_price,
						atu_price: data.api.price[0].iten_price,
						base_price: data.api.base_price,
						currency_id: data.api.currency_id,
						start_time: data.api.start_time,
						permalink: data.api.permalink,
						thumbnail: data.api.thumbnail,
						condition: data.scrap.condition,
						qtd_vendas:[{
							nvendas: data.scrap.qtd_vendas[0].nvendas
						}],
						qtd_base_vendas: data.scrap.qtd_vendas[0].nvendas,
						t_vendas: data.scrap.qtd_vendas[0].nvendas
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


router.get('/update-itens', async (req, res) => { // ADICIONA VALORES NOS ARRAYS DE PREÇO E QTD. DE VENDAS
	await Anuncio.find().then(async (data) => {
		const dados = data.map(data => data.toJSON())
		for(var cont = 0; cont < dados.length; cont++){ // Varre todos os itens do banco de dados
			// CONFIG
				let add_banco = []
			// PRECIFICAÇÃO
				let list_price = dados[cont].price // Array de valores registrado no item
			// QTD. VENDAS
				let list_vendas = dados[cont].qtd_vendas // Array de qtd de vendas registrados no item
			// Item ID/URI
				let ml_id = dados[cont].id_item.replace('MLB', '')
				const URI = "http://localhost:8081/api/item/"+ml_id

			// CONSULTANDO API PROPRIA	
				await fetch(URI)
					.then((res) => res.json())
					.then(async (dado) => {
						// Ultimo preço
							let atual_price = dado[0].api.price[0].iten_price
						// Ultimas vendas
							let atual_vendas = dado[0].scrap.qtd_vendas[0].nvendas

						// COMPARANDO VENDAS
						if(String(atual_price) != list_price[list_price.length -1].iten_price){
							add_banco.push({
								price: {iten_price: dado[0].api.price[0].iten_price}
							})
						}

						// COMPARANDO QTD. DE VENDAS
						if(atual_vendas != list_vendas[list_vendas.length -1].nvendas){
							add_banco.push({
								qtd_vendas: {nvendas: dado[0].scrap.qtd_vendas[0].nvendas}
							})
						}

						if(add_banco.length > 0){
							// PUSH NO BANCO DE DADOS
								await Anuncio.updateOne({ _id: dados[cont]._id }, {
									// Itens a serem atualizados
										// Adicionando itens novos nos arrays
										$push: add_banco[0],
										t_vendas: dado[0].scrap.qtd_vendas[0].nvendas,
										atu_price: dado[0].api.price[0].iten_price, // Preço atual
										ant_price: list_price[list_price.length -1].iten_price, // Preço anterior
								}).then(() => {
									console.log("Item atualizado com sucesso! "+dado[0].title)					
								}).catch((error) => {
									console.error("Erro ao atualizar o item: "+dado[0].id_item, error)
								})
						}
						
					})
					.catch((error) => {
						console.error("Erro ao consultar API propria: "+error)
					})

		}
		res.redirect('/monitor/update-period')
	}).catch((error) => {
		console.error("Houve um erro ao consultar o banco de dados: "+error)
	})
})

router.get('/update-period',async (req, res) => { // ATUALIZAR O PERIODO DA QTD. DE VENDAS E PREÇO (ORGANIZAÇÃO DOS DADOS DIA, SEMANA, MES...)
	// CONFIGURANDO ITEM
		let a_vendas = 0
		let m_vendas = 0
		let s_vendas = 0
		let d_vendas = 0
		let date_now = new Date()
	// functions
	function separaVendas(dataVenda, qtdVendasAtu, qtdVendasAnt){
		let dif_qtd_vendas = qtdVendasAtu - qtdVendasAnt
		let periodo = ((((date_now - dataVenda)/1000)/60)/60)/24 // Em dias

		if(periodo < 1){
			d_vendas = d_vendas + dif_qtd_vendas // DIAS
		}
		if(periodo < 7) {
			s_vendas = s_vendas + dif_qtd_vendas // SEMANA
		}
		if(periodo < 30) {
			m_vendas = m_vendas + dif_qtd_vendas // MÊS
		} 
		if(periodo < 365) {
		  	a_vendas = a_vendas + dif_qtd_vendas // ANO
		}				
	}

	await Anuncio.find().then(async (data) => {
		const dados = data.map(data => data.toJSON())

		for(var cont = 0; cont < dados.length; cont++){
			// Verifica horario da ultima atualização
			let tempo = (((date_now - dados[cont].last_update)/1000)/60) // Em minutos
			if(tempo >= 0.5){
				// CONSULTA ITEM DO BANCO DE DADOS
					const list_price = dados[cont].price // Array de valores registrado no item
					const list_vendas = dados[cont].qtd_vendas // Array de qtd de vendas registrados no item

				// ATUALIZANDO CADA VENDA NO SEU RESPECTIVO PERIODO
					for(var i = 1; i < list_vendas.length; i++){ 
						await separaVendas(list_vendas[i].data, list_vendas[i].nvendas, list_vendas[i - 1].nvendas)	
					}

				// ATUALIZANDO ITEM NO BANCO DE DADOS
				await Anuncio.updateOne({ _id: dados[cont]._id }, {
					// Itens a serem atualizados
						// Adicionando itens novos nos arrays
						a_vendas: a_vendas,
						m_vendas: m_vendas,
						s_vendas: s_vendas,
						d_vendas: d_vendas,
						last_update: new Date()
				}).then(() => {
					console.log("Item atualizado com sucesso!")					
				}).catch((error) => {
					console.error("Erro ao atualizar o item: "+error)
				})

				// RESET DADOS
				a_vendas = 0
				m_vendas = 0
				s_vendas = 0
				d_vendas = 0
				date_now = new Date()
			}		
		}

	}).catch((error) => {
		console.error("Erro ao consultar itens: "+error)
	})

	res.redirect("/monitor")
})


module.exports = router
