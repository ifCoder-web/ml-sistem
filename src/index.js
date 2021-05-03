const express = require("express")
const fetch = require("node-fetch")
const app = express()



app.get('/', (req, res) => {
	//const URL = "https://api.mercadolibre.com/sites/MLB/search?nickname=PONTOCERTOELETRO"
	const URL = "https://api.mercadolibre.com/items?ids=MLB1852800178"

	fetch(URL)
		.then((res) => res.json())
		.then((data) => {
			res.send(data)
		})
		.catch((error) => {
			console.log("Deu um erro: "+error)
		})

})



const PORT = process.env.PORT || 8082
app.listen(PORT, (err) => {
	console.log("Servidor ON, port: "+PORT)
})