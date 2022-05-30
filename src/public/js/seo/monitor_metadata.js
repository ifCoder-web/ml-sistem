// Meta dados dinâmicos - HOME

const url_atual_ = window.location.href;

// TITLE
document.title = "Monitoramento de anúncios do MercadoLivre | ML Sistem"

// DESCRIPTION
var meta = document.createElement('meta');
meta.setAttribute('name', 'description')
meta.setAttribute('content', `Monitore os anúncios dos concorrentes no MercadoLivre e saia na frente, saiba quantas vendas por dia, alteração de preços e muito mais.`)
document.getElementsByTagName('head')[0].appendChild(meta);