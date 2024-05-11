// REFERENTE AO CONSUMO
const url = "https://api-stg-catalogo.redeancora.com.br/superbusca/api/integracao/catalogo/v2/produtos/query/sumario";
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkRFQkJDQUJBMjIwQjRGOTVDOTA5NTNFMURBMTlENEUzQzFDRDFGRDciLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiIzcnZLdWlJTFQ1WEpDVlBoMmhuVTQ4SE5IOWMifQ.eyJuYmYiOjE3MTUzMDgyNDAsImV4cCI6MTcxNTM5NDY0MCwiaXNzIjoiaHR0cHM6Ly9zc28tY2F0YWxvZ28ucmVkZWFuY29yYS5jb20uYnIiLCJhdWQiOiJTZWFyY2hFbmdpbmVBcGkuc3RnIiwiY2xpZW50X2lkIjoiNjV0dmg2cnZuNGQ3dWVyM2hxcW0ycDhrMnB2bm01d3giLCJyb2xlIjoicmVhZCIsInNjb3BlIjpbInNlYXJjaGVuZ2luZWFwaS5zdGciXX0.Ai0b0tQW8nXpW_7ENpEpEShCCCtfGSVVwE_kIJZtHxYxlQSfgCeTrBlobSTc39xIQ3XGD0D98Plabsjloby3UQvfUXJi7QSOFmfKxDORxJ7syk9M0T3iWCz6tEuWWRjuCE7KtPvpvK47R921Sf8DhM5N_zo0DRfx_YjCxdlSsU5DLEtb49cib3WFC-bQNNnapf5gxWlIawkm1lPPsvmT7HpSmYnrXooFGIhD8acKqLQIztVBH6TViVr5IKn9d4M92hj89-C3xAeueosd8ZIfMdqu2pcXeSjjkjCiqse73Y9ZrGitkRnBpYiBGJXbFtScArWHNFSOfRIJyYuQz_4AOHSHR3Hs-bbJmjvlSwGxkLoKXdrzEny89wU05eytRIUQUFCpfzOTyCIxG1CM12HjqDMT_LJnZNjljU-SUOTnHLAstAhG8fRkVdZsdDWZEfyv-olP_SclxlpKEurhx1DnudsKcJTsSGJWu6xGs1vplpo3kZVUCiGI2SRN9GgLszMRUqYcB5bTVaXDWxYFPqYCu-ytzK2u9xKY1jkyoF0GnAKrneedwr4cYGnQ-z6Gfs-41p8QimSpurex0ZYISADlQUXk9bVQebjN4bY1NSA4_3PPveMX2INJLiHmv14TfeoV556Xmsj2fxILNfQcaSx8it1jcRXSeHgY2-mXGE1SV3w";
const tokenType = "Bearer";

// CAPTURA DOS OBJETOS DO HTML
const formulario = document.querySelector('#formulario');
const inputBuscar = document.querySelector('#inputBuscar');
const listaOpcoes = document.querySelector('.produtos')

lstOpcoes = [];
lstTextos = [];



// CONSULTA DA API
async function buscarProduto(pesquisa) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${tokenType} ${token}`
            },
            body: JSON.stringify({
                veiculoFiltro: {
                    veiculoPlaca: "DME8I14",
                },
                superbusca: `${pesquisa}`,
                pagina: 0,
                itensPorPagina: 9,
            }),
        });
        // reset lista
        lstOpcoes = [];
        const data = await response.json();
        for (let item of data['pageResult']['data']) {
            lstOpcoes.push(item)
        }
        console.log("Resposta da solicitação:", lstOpcoes);
        mostrarOpcoes();
    } catch (error) {
        console.error("Erro ao fazer a solicitação:" + error);
    }
};


function mostrarOpcoes() {
    // reset innerHTML
    listaOpcoes.innerHTML = ''
    let count = 0;
    if (lstOpcoes.length > 0) {
        for (let i of lstOpcoes) {
            count += 1;
            listaOpcoes.innerHTML +=
                `<div class="div${count}"'>
                <div class="card" id="${i['id']}">
                    <img src="https://catalogopdtstorage.blob.core.windows.net/imagens-prd/produto/${i['imagemReal']}"/>
                    <span class="span${count}">${i['nomeProduto']}</span>
                    <button onclick="">Comprar</button>
                </div>
            </div>`;
            // lstTextos.push(`span${count}`)
        }
        const divs = document.querySelectorAll('.card');
        divs.forEach(div => {
            div.addEventListener('click', () => {
                const span = div.querySelector('span');
                const texto = span.textContent;
                console.log(texto);
                adicionarCarrinho(div);
            });
        });

    } else {
        listaOpcoes.innerHTML = "<h1>Sua busca não houve retorno!</h1>"
    }
}

formulario.addEventListener('submit', (e) => {
    buscarProduto(inputBuscar.value);
    e.preventDefault();
})


function adicionarCarrinho (obj) {
    let id = obj.getAttribute("id");
    alert(id);
}