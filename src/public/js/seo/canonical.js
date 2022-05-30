// URL CANONICAL

var url_atual = window.location.href;
var meta = document.createElement('meta');
meta.setAttribute('rel', 'canonical')
meta.setAttribute('href', url_atual)
document.getElementsByTagName('head')[0].appendChild(meta);
