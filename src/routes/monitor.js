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
	Anuncio.find().sort({createdAt: "desc"})
	.then((data) => {		
		res.render("./monitor/dash_monitor",{
			item: data.map(data => data.toJSON()),
		})
	})
	.catch((error) => {
		console.log(error)
		res.send("Houve um erro ao consultar dados")
	})
	
})

router.get("/cadastro", (req, res) => {
	res.render("./monitor/cadastro")
})

router.post("/save", urlencodedParser, (req, res) => {
	const item = Number(req.body.id_item.trim().replace("#", ""))
	if(item){
		if(item != null && item != undefined && item != ""){
			const URL = "https://ml-sistem.herokuapp.com/api/item/"+item
			fetch(URL)
				.then((res) => {
					return res.json()
				})
				.then((dado) => {
					console.log(dado)
					const data = dado[0]			
					Anuncio.findOne({ id_item: "MLB"+item }).then(async (dat) => {
						if(dat){
							console.log("Item já cadastrado!")
							res.redirect("/monitor")
						}else{
							const item = new Anuncio({
								id_item: data.api.id_item,
								status: data.api.status,
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
						res.redirect("/")
					})
				})
				.catch((error) => {
					console.log("Erro ao consultar produto: "+error)
					res.redirect("/monitor")
				})
		}
	}else{
		res.redirect("/monitor")
	}
	
})


router.get("/update-itens", async (req, res) => {
	// CONSULTA DB
	await Anuncio.find().then(async (data) => {
		const dados = data.map(data => data.toJSON())
		const ids_prom = dados.map(async function(bancoAtu, idx, array, thisArg){ // MAPEIA TODOS OS ITENS DO BANCO E GUARDA O ID DE CADA UM NO ARRAY "ids"
			// CONFIG
				let add_banco = []
			// PRECIFICAÇÃO
				let list_price = bancoAtu.price // Array de valores registrado no item
			// QTD. VENDAS
				let list_vendas = bancoAtu.qtd_vendas // Array de qtd de vendas registrados no item
			// Item ID/URI
				let ml_id = bancoAtu.id_item.replace('MLB', '')
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

						// TRABALHANDO PREÇO ANTERIOR
						if(list_price.length > 1){
							var preco_anterior = list_price[list_price.length - 2].iten_price
						}else{
							var preco_anterior = list_price[list_price.length - 1].iten_price
						}
						var dif_preco =  Number(dado[0].api.price[0].iten_price) - Number(preco_anterior)
						var status_price = "price_static"
						if(dif_preco < 0){
							dif_preco =  -1 * dif_preco
							status_price = "price_down"
						}else if(dif_preco > 0){
							status_price = "price_up"
						}

						// Atualiza o status do anúncio
						if(dado[0].api.status != bancoAtu.status){
							await Anuncio.updateOne({ _id: bancoAtu._id }, {
									// Atualizando status
										status: dado[0].api.status
								}).then(() => {
									console.log("Mudança de status! "+ bancoAtu.title)					
								}).catch((error) => {
									console.error("Erro ao atualizar status: "+bancoAtu.title, error)
								})
						}

						// Atualiza demais parâmentros do anúncio
						if(add_banco.length > 0){
							// PUSH NO BANCO DE DADOS
								await Anuncio.updateOne({ _id: bancoAtu._id }, {
									// Itens a serem atualizados
										// Adicionando itens novos nos arrays
										$push: add_banco[0],
										t_vendas: dado[0].scrap.qtd_vendas[0].nvendas,
										atu_price: Number(dado[0].api.price[0].iten_price).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2}), // Preço atual
										ant_price: Number(preco_anterior).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2}), // Preço anterior
										dif_price: dif_preco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2}),
										price_status: status_price
								}).then(() => {
									console.log("Item adicionado no banco de dados! "+ bancoAtu.title)					
								}).catch((error) => {
									console.error("Erro ao atualizar o item: "+bancoAtu.title, error)
								})
						}
						
					})	
					.catch((error) => {
						console.error("Erro ao consultar API propria: "+error)
					})

		})
		await Promise.all(ids_prom).then(() => { // AGUARDA TODAS AS PROMISES RESOLVEREM
			res.redirect('/monitor/update-period')
		})
	}).catch((error) => {
		console.log("Erro ao consultar DB "+error)
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

// DELETANDO ITENS
router.get('/delete/:id', async (req, res) => {
	await Anuncio.deleteOne({_id: req.params.id}).then(() => {
		console.log("Anuncio deletado com sucesso!")
		res.redirect('/monitor')
	}).catch((error) => {
		console.error("Houve um erro ao deletar o  anuncio! "+error)
		res.redirect('/monitor')
	})
})


module.exports = router
