// REFERENTE AO CONSUMO
const url = "https://api-stg-catalogo.redeancora.com.br/superbusca/api/integracao/catalogo/v2/produtos/query/sumario";
const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkRFQkJDQUJBMjIwQjRGOTVDOTA5NTNFMURBMTlENEUzQzFDRDFGRDciLCJ0eXAiOiJhdCtqd3QiLCJ4NXQiOiIzcnZLdWlJTFQ1WEpDVlBoMmhuVTQ4SE5IOWMifQ.eyJuYmYiOjE3MTU1MjgyOTAsImV4cCI6MTcxNTYxNDY5MCwiaXNzIjoiaHR0cHM6Ly9zc28tY2F0YWxvZ28ucmVkZWFuY29yYS5jb20uYnIiLCJhdWQiOiJTZWFyY2hFbmdpbmVBcGkuc3RnIiwiY2xpZW50X2lkIjoiNjV0dmg2cnZuNGQ3dWVyM2hxcW0ycDhrMnB2bm01d3giLCJyb2xlIjoicmVhZCIsInNjb3BlIjpbInNlYXJjaGVuZ2luZWFwaS5zdGciXX0.AXyBqG5VL6wbYVpunASsTbabHrguXTq6kf6HsD97Wfp6t-2TLPRYuvjkA81LAoc-T98YgToGwGTBUWPZ7lckuCXct_ZxCfh8GYLqcHX4HG-08Qzu3BfJlth-CL-16ac1VRmF82sGZMqch82bOG5MfBoyW_NexuAhtLjX5MhUgY2sUFurYn1H0qaxCvePRdvujfI-aQ1XyOqsMJTXhvFDwNZIfHO5ejdK-J5XWKYBfRFeMo8pnWUXGnHO3TkN2cXdlTdK55AcO_qVnpoIlcCv_D603a67fkxWtHj1KAG1ZjCp6aoa7r4hzKbq7yMEsPTrQ5njCiAqD6AGKjw3b1Rb2PdC0Pa8xgGZDGYv5Dg5GkQaDP_Jsq3UeR45TL7eieCnqU6jSuXdT5IeL8E5op1nncn_Sf8WMg2MnDEMB0xNQBIM--YHWmont68fhiuQ50MhTBRme8SUN_MXBniKJFe20KcvUvdLb_6VX41MOPeOlDyEd7ALA_H_yEZM9AGFmqO6fa-rEINs2DW8pSOCiYWKC21ZZRPox4k6cVKheuZ3tC8-nlG_INcFLLNiCJOPeDxrRA73lOyruINA2WA2aKVswG3lgLhyiIS8ZrvjFh0qWzt-NN1zwku8Movrz2322OK4emrNqJWWUdMT2fxyYfcd08FmCHOEVhnSZbSVRUnbnr8";
const tokenType = "Bearer";

// CAPTURA DOS OBJETOS DO HTML
const formulario = document.querySelector('#formulario');
const inputBuscar = document.querySelector('#inputBuscar');
const listaOpcoes = document.querySelector('.produtos')

lstOpcoes = [];
lstCarrinho = [];

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

// Funcao que consulta em forma de pesquisa de produtos a API 
function mostrarOpcoes() {
    // reset innerHTML
    listaOpcoes.innerHTML = ''
    let count = 0;
    if (lstOpcoes.length > 0) {
        for (let i of lstOpcoes) {
            count += 1;
            listaOpcoes.innerHTML +=
                `<div class="div${count} divCard">
                <div class="card">
                    <div class="img-card">
                        <img src="https://catalogopdtstorage.blob.core.windows.net/imagens-prd/produto/${i['imagemReal']}"/>
                    </div>
                    <div class="card__informacoes">
                        <span class="spanNome">${i['nomeProduto']}</span>
                        <span class="spanMarca">Por ${i['marca']}</span>
                        <span class="spanPrecoAnterior">R$ ${geraValorAleatorio()},00</span>
                        <span class="spanPreco">R$ ${geraValorAleatorio()},00    <span style="color: #00a650">${geraPromocaoAleatorio()}% OFF</span></span>
                    </div>
                    <button onclick="adicionarCarrinho(${i['id']})">Comprar</button>
                </div>
            </div>`;
        }
    } else {
        listaOpcoes.innerHTML = "<h1>Sua busca não houve retorno!</h1>"
    }
}

// Ao apertar em 'enviar' funcao 'buscarProduto' recebe o valor do input
formulario.addEventListener('submit', (e) => {
    buscarProduto(inputBuscar.value);
    e.preventDefault();
})

// Funcao de precos aleatorios
function geraValorAleatorio () {
    return Math.floor(Math.random()*200)
}

function geraPromocaoAleatorio () {
    return Math.floor(Math.random()*40)
}

// Funcao que adiciona o produto ao carrinho a partir de seu ID
function adicionarCarrinho(id) {
    lstCarrinho = lstOpcoes.filter(item => (item['id'] == id));
    console.log(lstCarrinho[0])
}