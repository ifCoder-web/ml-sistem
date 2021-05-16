const express = require("express")
const fetch = require("node-fetch")
const request = require('request-promise')
const cheerio = require('cheerio')
const handlebars = require('express-handlebars')
const hb = handlebars.create()
const path = require('path')
const bodyParser  = require('body-parser')
const app = express()

// BANCO DE DADOS
	const db = require('./db/db.js')
	// Models
		const User_model = require('./db/models/user.js')
		const Anuncio = require('./db/models/anuncio.js')

// CONFIG
	// View Engine
		app.set("views", path.join(__dirname, "views/"));
		app.engine('handlebars', handlebars({defaltLayout: 'main'}))
		app.set('view engine', 'handlebars')
	// Arquivos estáticos
		app.use(express.static(path.join(__dirname, '/public')));
	// Body-parser
		app.use(bodyParser.json())
		var urlencodedParser = bodyParser.urlencoded({ extended: false })



// ROTAS //


	// API
	const api = require("./routes/api.js")
	app.use('/api', api) // Cria as rotas "/api"
	// MONITOR
	const monitor = require("./routes/monitor.js")
	app.use('/monitor', monitor)
	// PRECIFIC
	const precific = require("./routes/precific.js")
	app.use('/precific', precific)

app.get('/login', (req, res) => {
	res.send("login")
})

app.get('/', (req, res) => {
	res.render("home")
})

app.get('/base', (req, res) => {
	//const URL = "https://api.mercadolibre.com/sites/MLB/search?nickname=PONTOCERTOELETRO"
	//const URL = "https://api.mercadolibre.com/items?ids=MLB877046844"
	const URL = "http://localhost:8081/api/item/1213067565"

	fetch(URL)
		.then((res) => res.json())
		.then((data) => {
			res.send(data)
		})
		.catch((error) => {
			console.log("Deu um erro: "+error)
		})
})

app.get('/banco', (req, res) => {
	Anuncio.find().then((data) => {
		// res.render("./monitor/dash_monitor",{
		// 	item: data.map(data => data.toJSON()),
		// })
		res.send(data)
	})
})


// SERVER
const PORT = process.env.PORT || 8081
app.listen(PORT, (err) => {
	console.log("Servidor ON, port: "+PORT)
})
