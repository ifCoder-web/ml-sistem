// Analise de concorrencia ML

let id_item_concor = document.querySelector("#id_item_concor")
let enviarConcor = document.querySelector("#enviarConcor")
let content_concor = document.querySelector("#content_concor")
let clean_concor = document.querySelector("#clean_concor")
let erros = []

function pesquisa_item(id){
	// Validação
	var id_valid = Number(id.trim())

	if(id_valid){
		// Consulta ajax
		var URI = `https://api.mercadolibre.com/items?ids=MLB${id_valid}`
		fetch(URI)
			.then((response) => { // FAZ A CONSULTA NA API DO ML PARA OBTER AS INFORMAÇÕES
				return response.json()
			})
			.then((response) => {			
				response.forEach((data) => {
					if(data.code == 200){
						// Guardando informações
						var start_time = data.body.start_time
						var price = data.body.price
						var title = data.body.title
						var permalink = data.body.permalink
						var thumbnail = data.body.thumbnail
						var warranty = data.body.warranty
						var health = data.body.health
						var tags = data.body.tags
						var listing_type_id = data.body.listing_type_id
						var shipping = data.body.shipping.free_shipping

						// Formatando data
						var start_time_bruto = new Date(start_time)
						var start_time_format = start_time_bruto.toLocaleDateString('pt-BR')

						// Frete
						var shipping_format = "Frete pago"
						if(shipping == true){
							shipping_format = "Frete grátis"
						}

						// Tipo de anúncio
						var tipo_anuncio = "Clássico"
						if(listing_type_id == "gold_special" || listing_type_id == "gold_pro"){
							tipo_anuncio = "Premium"
						}

						// Criando e inserindo CARD
						var card_insert = `
							<div class="card mb-2">
								<div class="card-body row">
									<div class="imgConcor col col-1">
										<img src="${thumbnail}" style="width: 80px">
									</div>
									<div class="linkConcor col col-4">
										<a href="${permalink}" target="blank">${title}</a>
									</div>
									<div class="col col-6 row">
										<div class="dataConcor col">Início: ${start_time_format}</div>
										<div class="price col text-success">R$${price}</div>
										<div class="garantia col">${warranty}</div>
										<div class="tipo col">
											<div>${tipo_anuncio}</div>
											<div>${shipping_format}</div>
										</div>
									</div>
									<div class="health col col-1">${health}</div>
								</div>
							</div>
						`
						content_concor.innerHTML += card_insert

						// Limpando campo de id
						id_item_concor.value = ""

					}else{
						erros.push("Item não encontrado! Code: "+ data.code)
					}
				})				
			});
	}else{
		erros.push("Informe um id válido!")
	}

	// PRINT ERROS
	if(erros.length > 0){
		console.log(erros)
		erros = []
	}
}


// EVENTOS

enviarConcor.addEventListener("click", function(){ // Add item
	if(id_item_concor.value.trim() != ""){
		pesquisa_item(id_item_concor.value)
	}
})

clean_concor.addEventListener("click", function(){ // Limpa itens
	content_concor.innerHTML = ""
})