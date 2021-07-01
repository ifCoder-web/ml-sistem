// CÁLCULO TABELA DE PRECIFICAÇÃO

	// INVESTIMENTO TOTAL
	function total_invest(){
		let custo_qtd_prod = document.querySelector("#custo_qtd_prod")
		let custo_invest_total = document.querySelector("#custo_invest_total")

		let custo_soma = document.querySelectorAll("#custos .custo_soma")
		let custo_array = []
		let erros = []
		let custo_array_total = 0
		let invest_total_soma = 0

		custo_soma.forEach((currentValue, index, arr) => {
			custo_array.push(currentValue.value)
		})

		if(custo_array.length > 0){
			custo_array.forEach((currentValue, index, arr) => {
				if(currentValue.trim() != ""){
					if(Number(currentValue.replace(/\./g,'').replace(',','.').trim())){ // Validação
						custo_array_total = custo_array_total + Number(currentValue.replace(/\./g,'').replace(',','.'))
					}else{
						erros.push("Informe somente valores válidos!")
					}
				}
				
			})
		}

		if(erros.length > 0){
			console.log(erros)
			custo_invest_total.value = 0;
			erros = []
		}else{
			invest_total_soma = custo_array_total * custo_qtd_prod.value
			custo_invest_total.value = invest_total_soma.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
		}

		return [custo_array_total, invest_total_soma]
	}


	// Totais
	function lucro_cash(lista_valores){
		// Quantidades
		let resp_class_qtd = document.querySelector("#resp_class_qtd")
		let resp_prem_qtd = document.querySelector("#resp_prem_qtd")
		let resp_class_qtd_frete = document.querySelector("#resp_class_qtd_frete")
		let resp_prem_qtd_frete = document.querySelector("#resp_prem_qtd_frete")
		// Totais
		let resp_cash = document.querySelector("#resp_cash")
		let resp_lucro_total = document.querySelector("#resp_lucro_total")
		let array_cash = []
		let array_lucro = []

		// Somatório
			//Clássico
			if(resp_class_qtd.value != ""){
				// valor
				let valor = Number(resp_class_qtd.value) * lista_valores[0].valor
				array_cash.push(valor)
				// lucro
				let lucro = Number(resp_class_qtd.value) * lista_valores[0].lucro
				array_lucro.push(lucro)
			}

			// Premium
			if(resp_prem_qtd.value != ""){
				// valor
				let valor = Number(resp_prem_qtd.value) * lista_valores[1].valor
				array_cash.push(valor)
				// lucro
				let lucro = Number(resp_prem_qtd.value) * lista_valores[1].lucro
				array_lucro.push(lucro)
			}

			// Clássico frete gratis
			if(resp_class_qtd_frete.value != ""){
				// valor
				let valor = Number(resp_class_qtd_frete.value) * lista_valores[2].valor
				array_cash.push(valor)
				// lucro
				let lucro = Number(resp_class_qtd_frete.value) * lista_valores[2].lucro
				array_lucro.push(lucro)
			}

			// Premium frete gratis
			if(resp_prem_qtd_frete.value != ""){
				// valor
				let valor = Number(resp_prem_qtd_frete.value) * lista_valores[3].valor
				array_cash.push(valor)
				// lucro
				let lucro = Number(resp_prem_qtd_frete.value) * lista_valores[3].lucro
				array_lucro.push(lucro)
			}

		// Mostrando na tela
		if(array_cash.length > 0){
			let total_cash = 0
			array_cash.forEach((currentValue, index, arr) => {
				total_cash += currentValue
			})
			// Print
			resp_cash.value = total_cash.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
		}else{
			resp_cash.value = ""
		}

		if(array_lucro.length > 0){
			let total_lucro = 0
			array_lucro.forEach((currentValue, index, arr) => {
				total_lucro += currentValue
			})
			// Print
			resp_lucro_total.value = total_lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
		}else{
			resp_lucro_total.value = ""
		}
	}

	// Função de totais (RESPOSTA)
	function total_resp(){
		// Erros
		let erros = []
		// Custo
		let total_invest_value = total_invest()
		let custo_unitario = total_invest_value[0] // Number
		let custo_invest_total = total_invest_value[1] // Number
		let custo_lucro_pretend = document.querySelector("#custo_lucro_pretend")
		let custo_qtd_prod = document.querySelector("#custo_qtd_prod")
		// Config.
		let classic = document.querySelector("#classic")
		let premium = document.querySelector("#premium")
		let taxa_fixa = document.querySelector("#taxa_fixa")
		let limite_frete = document.querySelector("#limite_frete")
		let min_valor = document.querySelector("#min_valor")
		let frete_fixo = document.querySelector("#frete_fixo")
		// Resposta
		let resp_class_valor = document.querySelector("#resp_class_valor")
		let resp_class_lucro = document.querySelector("#resp_class_lucro")
		let resp_prem_valor = document.querySelector("#resp_prem_valor")
		let resp_prem_lucro = document.querySelector("#resp_prem_lucro")
		let resp_class_valor_frete = document.querySelector("#resp_class_valor_frete")
		let resp_class_lucro_frete = document.querySelector("#resp_class_lucro_frete")
		let resp_prem_valor_frete = document.querySelector("#resp_prem_valor_frete")
		let resp_prem_lucro_frete = document.querySelector("#resp_prem_lucro_frete")
		let resp_cash = document.querySelector("#resp_cash")
		let resp_lucro_total = document.querySelector("#resp_lucro_total")
		// No frete group
		let no_frete_group = document.querySelector("#no_frete_group")

		// Variaveis
		let result_classic_no_frete, result_premium_no_frete, result_classic_frete, result_premium_frete;

		// Functions
			// sem frete grátis
			function result_geral(taxaFixa, freteFixo, limiteFrete, custoUnitario, lucroPretend, taxaML){
				// Tratando valores
				let taxaFixa_format = Number(taxaFixa.replace(/\./g,'').replace(',','.'))
				let frete_fixo_format = Number(freteFixo.replace(/\./g,'').replace(',','.'))
				let lucroPretend_format = Number(lucroPretend)
				let taxaML_format = Number(taxaML)
				let limite_frete_format = Number(limiteFrete.replace(/\./g,'').replace(',','.'))
				let limite_test = false

				let result_total = (100*taxaFixa_format + 100*frete_fixo_format + custoUnitario*(100 + lucroPretend_format))/(100 - taxaML_format)
				let lucro_unitario = (custoUnitario * (lucroPretend_format/100))
				if(result_total > limite_frete_format){
					limite_test = true
				}

				// console.log(taxaFixa_format,custoUnitario,lucroPretend_format,taxaML_format)
				return [result_total, lucro_unitario, limite_test]
			}


		// Validação
		if(custo_unitario != "" && custo_invest_total != "" && custo_lucro_pretend.value != "" && classic.value != "" && premium.value != "" && taxa_fixa.value != "" && frete_fixo.value != ""){

			// Clássico
			result_classic_no_frete = result_geral(taxa_fixa.value, "0", limite_frete.value, custo_unitario, custo_lucro_pretend.value, classic.value)
			resp_class_valor.value = result_classic_no_frete[0].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
			resp_class_lucro.value = result_classic_no_frete[1].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})

			// Premium
			result_premium_no_frete = result_geral(taxa_fixa.value, "0", limite_frete.value, custo_unitario, custo_lucro_pretend.value, premium.value)
			resp_prem_valor.value = result_premium_no_frete[0].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
			resp_prem_lucro.value = result_premium_no_frete[1].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})

			// Clássico frete grátis
			result_classic_frete = result_geral(taxa_fixa.value, frete_fixo.value, limite_frete.value, custo_unitario, custo_lucro_pretend.value, classic.value)
			if(result_classic_frete[2] == true){
				result_classic_frete = result_geral("0", frete_fixo.value, limite_frete.value, custo_unitario, custo_lucro_pretend.value, classic.value)
			}
			resp_class_valor_frete.value = result_classic_frete[0].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
			resp_class_lucro_frete.value = result_classic_frete[1].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})

			// Premium frete grátis
			result_premium_frete = result_geral(taxa_fixa.value, frete_fixo.value, limite_frete.value, custo_unitario, custo_lucro_pretend.value, premium.value)
			if(result_premium_frete[2] == true){
				result_premium_frete = result_geral("0", frete_fixo.value, limite_frete.value, custo_unitario, custo_lucro_pretend.value, premium.value)
			}
			resp_prem_valor_frete.value = result_premium_frete[0].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
			resp_prem_lucro_frete.value = result_premium_frete[1].toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2})
		}else{
			erros.push("Preencha todos os campos!")
		}

		

		// Erros
		if(erros.length > 0){
			console.log(erros)
			return erros
		}else{
			// Valores brutos
			let val_brutos = [
				{
					tipo: "Clássico",
					valor: result_classic_no_frete[0],
					lucro: result_classic_no_frete[1],
				},
				{
					tipo: "Premium",
					valor: result_premium_no_frete[0],
					lucro: result_premium_no_frete[1],
				},
				{
					tipo: "Clássico Frete Grátis",
					valor: result_classic_frete[0],
					lucro: result_classic_frete[1],
				},
				{
					tipo: "Premium Frete Grátis",
					valor: result_premium_frete[0],
					lucro: result_premium_frete[1],
				}
			]
			lucro_cash(val_brutos)
			return val_brutos
		}
	}


	



// EVENTS

const custo_container = document.querySelector("#custo_container")
const btn_calc = document.querySelector("#btn_calc")
const resposta_container = document.querySelector("#resposta_container")


custo_container.addEventListener('blur', event => total_invest(), true)
btn_calc.addEventListener('click', event => total_resp())
resposta_container.addEventListener('blur', event => {
	if(event.target.classList.contains('qtd_camp')){
		total_resp()
	}
}, true)