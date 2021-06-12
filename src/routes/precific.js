const express = require('express')
const app = express()
const router = express.Router()
const fetch = require("node-fetch")


router.get('/', (req, res) => {
	res.render('precific/home')
})


module.exports = router


// SELECIONAR CATEGORIAS	>>

// "https://api.mercadolibre.com/sites/MLB/categories"	>>

// MOSTRA LISTA DE CATEGORIAS NA TELA	>>

// SELECIONA UMA CATEGORIA   >>

// BUSCA POR CATEGORIAS FILHAS DA CATEGORIA SELECIONADA   >>

// "https://api.mercadolibre.com/categories/{CATEGORY_ID}"   >>

// ...

// ENCONTRA ULTIMA CATEGORIA (NÃO EXISTEM MAIS FILHOS)   >>

// BUSCA POR VALOR DA TAXA DO ML PARA TODOS OS TIPOS DE ANÚNCIO   >>

// "https://api.mercadolibre.com/sites/MLB/listing_prices?price=${PRICE_BASE}&category_id=${CATEGORY_ID}"

// EXIBE TAXAS NA TELA PARA CÁLCULO