// ======= LISTAR CATEGORIS E TAXAS DO MERCADO LIVRE =======

	// CONFIG
		const btn = document.querySelector("#btn_send");
		const itens = document.querySelector("#itens");
		const categ = document.querySelector("#categ");
		const taxa_class = document.querySelector("#classic");
		const taxa_premi = document.querySelector("#premium");
		const clateg_list = document.querySelector("#clateg_list");
		const btn_close_class_list = document.querySelector("#btn_close_class_list");
		const taxa_fixa = document.querySelector("#taxa_fixa");
		const min_valor = document.querySelector("#min_valor");
		let arr_categorias = []

	// FUNCTIONS
		// Função que busca as categorias base
		function categ_base(URI){
			fetch(URI)
				.then((response) => { // FAZ A CONSULTA NA API DO ML PARA OBTER AS CATEGORIAS BASE
					return response.json()
				})
				.then((response) => {			
					response.forEach((data) => {
						let item = document.createElement("div");
						item.classList.add("list-group")
						item.innerHTML = `<a class="sub_categoria list-group-item list-group-item-action" href="https://api.mercadolibre.com/categories/${data.id}">${data.name}</a>`
						itens.appendChild(item)
					})				
				});
		}

		// Função que busca as categorias filhas
		function categ_child(URI){
			fetch(URI)
				.then((response) => {
					return response.json()
				})
				.then((response) => {
					// ZERAR A LISTA ANTERIOR
					itens.innerHTML = ""
					if(response.children_categories.length == 0){ // ULTIMA CATEGORIA
						// Preço minimo para anunciar
						min_valor.value = Number(response.settings.minimum_price)
						// CONSULTA NA API DE TAXA
						const URI = `/api/fee/${response.id}`;
						fetch(URI)
							.then((response) => {
								return response.json()
							})
							.then((response) => {
								response.forEach((data) => {
									if(data.listing_type_name == "Premium"){
										taxa_premi.value = data.sale_fee_amount;
									}else{
										taxa_class.value = data.sale_fee_amount;
									}
								})
							})
							io_class_list("close")
					}
					response.children_categories.forEach((data) => {
						let item = document.createElement("li");
						item.classList.add("list-group")
						item.innerHTML = `<a class="sub_categoria list-group-item list-group-item-action" href="https://api.mercadolibre.com/categories/${data.id}">${data.name}</a>`
						itens.appendChild(item)
					})
					path_categ(response.path_from_root)						
				});
		}

		// Função que controla a lista de categorias selecionadas
		function path_categ(id){
			// Limpando lista
			arr_categorias = []
			taxa_premi.value = "";
			taxa_class.value = "";
			//Adicionando itens a lista
			id.forEach((data) => {
				var category_select = `<a href="https://api.mercadolibre.com/categories/${data.id}" class="category_click">${data.name}</a>`;
				arr_categorias.push(category_select)
			})	
			// Printando itens na tela
			categ.innerHTML = arr_categorias;	
		}

		// Abre e fecha a lista de categorias
		function io_class_list(cmd){
			if(cmd == "open"){
				clateg_list.style.display = "block"
			}else{
				clateg_list.style.display = "none"
			}
		}

	// EVENTS
		// CATEGORIAS BASE
			btn.addEventListener('click', function(event){ // CLICANDO NO BTN DE CATEGORIAS
				// event.preventDefault()
				const URI = "https://api.mercadolibre.com/sites/MLB/categories";
				// ZERAR A LISTA ANTERIOR, CATEGORIAS SELECIONADAS E TAXAS
				arr_categorias = [];
				itens.innerHTML = "";
				taxa_premi.value = "";
				taxa_class.value = "";
				min_valor.value = "";
				categ.innerHTML = arr_categorias; // PASSA O ARRAY VAZIO PARA A TELA
				categ_base(URI) // chamando função
				io_class_list("open") // mostra a lista
			},false);

		// ITENS DA LISTA DE CATEGORIAS
			itens.addEventListener('click', function(event){ // CLICANDO EM ALGUMA CATEGORIA BASE
				event.preventDefault()
				var cat = event.target
				if(cat.classList.contains("sub_categoria")){
					// CONSULTA CATEGORIAS FILHAS
					const URI = cat.getAttribute("href")
					categ_child(URI) // chamada da função
				}
			}, false);

		// LISTA DE CATEGORIAS ESCOLHIDAS
			categ.addEventListener('click', function(event){ // RETORNANDO ALGUMA CATEGORIA
				event.preventDefault()
				const element = event.target
				if(element.classList.contains("category_click")){
					// CONSULTA CATEGORIAS FILHAS
					const URI = element.getAttribute("href")
					categ_child(URI) // chamada da função	de consulta
				}
				io_class_list("open")
			});

		// FECHAR A LISTA DE CATEGORIAS
			btn_close_class_list.addEventListener('click', function(){
				io_class_list("close")
			});