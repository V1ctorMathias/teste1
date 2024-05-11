// REFERENTE AO CONSUMO
const url = "https://api-stg-catalogo.redeancora.com.br/superbusca/api/integracao/catalogo/v2/produtos/query/sumario";
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkRFQkJDQUJBMjIwQjRGOTVDOTA5NTNFMURBMTlENEUzQzFDRDFGRDciLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiIzcnZLdWlJTFQ1WEpDVlBoMmhuVTQ4SE5IOWMifQ.eyJuYmYiOjE3MTUzOTU0MzYsImV4cCI6MTcxNTQ4MTgzNiwiaXNzIjoiaHR0cHM6Ly9zc28tY2F0YWxvZ28ucmVkZWFuY29yYS5jb20uYnIiLCJhdWQiOiJTZWFyY2hFbmdpbmVBcGkuc3RnIiwiY2xpZW50X2lkIjoiNjV0dmg2cnZuNGQ3dWVyM2hxcW0ycDhrMnB2bm01d3giLCJyb2xlIjoicmVhZCIsInNjb3BlIjpbInNlYXJjaGVuZ2luZWFwaS5zdGciXX0.HAOhUreTqfsLw8zBwVedRgeN-MOWlKH2cmkaQ7gNeOuLLzCuqoTUSTkpd05YTD_g4IWAZLjKPG7fYtXaXPuBu6Wjfv6rQ6ot1Z-7_WmqXlihmRyUuh5iPS--OF5GdQyoVhE1cLTbRC58bzb6CE3wNN0wGiDP6POlREC3TiCwwu97-JZk5ShYT9TYSzOYiOF6Tay1EXMipRIAgjejz3j58YQifkS9M-z0dCvH4ayDqh7YRvibS6kdQuaOAukvzWEq2zFMt4OLFvIhKH2872_9L9qnScJUpZyUCzKxfv9LEgXKUPkzQGLliXELb8mPZFEx874wBDpYZG8V4iUspfxPVP-6vzCYWrVKsh1HEt8GUbiUSJwWF9d82WBQjTuLQuQCtq3hVmMTSYkJW8ox2oTub5zf_N9_etfn3rUcWiGqQ95sLy6O4-AfMBwSIpQJFVdzUhS776sO5XzQU6A_9o4uOuazuJJyQSA2nNGD-URcQc5VTDUjYnpLjGMb4kFdwCqa_8rITdHSLg4eqcQAaLy2hyaqS2Y8bDRAH1mOQ310czYW2NZ4O2wJ2dwW6O5WvAD39smkVUuY0jSrw8sLPUw62i94pteOwJC9GglrbfcWIUqO2qURVU3n3abMJOAE5xVaW9Kh2epoFSym00vUpmjeNK3XHTTwW8jJSke-3eusbFk";
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