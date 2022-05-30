// Meta dados dinâmicos - HOME

const url_atual_ = window.location.href;

// TITLE
document.title = "Precificação de produtos para MercadoLivre | ML Sistem"

// DESCRIPTION
var meta = document.createElement('meta');
meta.setAttribute('name', 'description')
meta.setAttribute('content', `Descubra qual o preço certo para anunciar produtos no MercadoLivre, calcule todos os custos, taxas e evite prejuizos.`)
document.getElementsByTagName('head')[0].appendChild(meta);