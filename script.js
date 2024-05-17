// REFERENTE AO CONSUMO
const url = "https://api-stg-catalogo.redeancora.com.br/superbusca/api/integracao/catalogo/v2/produtos/query/sumario";
let token = "";
const tokenType = "Bearer";

// URL e corpo da requisição de login
const loginUrl = 'https://sso-catalogo.redeancora.com.br/connect/token';
const loginData = {
    client_id: '65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx',
    client_secret: '9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn',
    grant_type: 'client_credentials'
};

// Configurações da requisição
const requestOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(loginData)
};

// Função para fazer a requisição de login e retornar o token
async function fetchToken() {
    try {
        const response = await fetch(loginUrl, requestOptions);
        const data = await response.json();
        token = data['access_token'];
        return token
    } catch (error) {
        console.error('Erro ao obter token:', error);
        return null;
    }
}

// CAPTURA DOS OBJETOS DO HTML
const formulario = document.querySelector('#formulario');
const inputBuscar = document.querySelector('#inputBuscar');
const listaOpcoes = document.querySelector('.produtos');
const carrinho = document.querySelector('.carrinho');
const modalCarrinho = document.querySelector('.modalCarrinho');

let precoOriginal = 0;
let promocao = 0;
let precoPromocao = 0;

lstOpcoes = [];
lstCarrinho = [];

// CONSULTA DA API
async function buscarProduto(pesquisa) {
    try {
        await fetchToken();
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
                            <img src="${i['imagemReal'] != null ? "https://catalogopdtstorage.blob.core.windows.net/imagens-prd/produto/" + i['imagemReal'] : "../assets/imageNotFound.png"}" alt="Imagem do produto não encontrada!"/>
                        </div>
                        <div class="card__informacoes">
                            <div class="spanNomeMarca">
                                <p class="spanNome">${i['nomeProduto']}</p>
                                <p class="spanMarca">por ${i['marca']}</p>
                            </div>
                            ${i['informacoesComplementares']? "<div class='infoComplementar'>"+i['informacoesComplementares']+"</div>" : ""} 
                            <div class="spanPrecos">
                                <p class="spanPrecoAnterior">R$ ${precoOriginal = geraValorPromocao()}</p>
                                <p class="spanPreco">R$ ${precoPromocao = (precoOriginal - (precoOriginal * ((promocao = geraPromocaoAleatorio()) / 100))).toFixed(2)}  <span style="color: #00a650">${promocao}% OFF</span></p>
                            </div>
                            <button onclick="adicionarCarrinho(${i['id']}, ${precoPromocao})">Adicionar ao Carrinho</button>
                        </div>
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
function geraValorPromocao() {
    return (Math.random() * (300 - 10 + 1) + 10).toFixed(2);
}

function geraPromocaoAleatorio() {
    return Math.floor(Math.random() * 40)
}

// Funcao que adiciona o produto ao carrinho a partir de seu ID
function adicionarCarrinho(id, valor) {
    let itemCarrinho = lstOpcoes.filter(item => (item['id'] == id))[0];
    lstCarrinho.push({
        id: itemCarrinho['id'],
        nome: itemCarrinho['nomeProduto'],
        preco: valor
    })
    console.log(lstCarrinho)
    alert('Adicionado ao Carrinho!')
}

// Preenche o carrinho com os produtos selecionados
function preencheListarCarrinho() {

    modalCarrinho.innerHTML = '';
    let valorFinal = 0;

    lstCarrinho.forEach((item, index) => {
        valorFinal += item['preco'];
        modalCarrinho.innerHTML +=
        `
        <div class="dadosImagem" style="display: flex; justify-content: space-between; border-bottom: 1px solid black;">
            <div class="produtoPreco">
                <p>Produto: ${item['nome']}</p>
                <p>Preço: R$ ${item['preco']}</p>
            </div>
            <img class="lixeira" src="../assets/trash-black.svg" style="cursor: pointer; width: 20px;" onclick="removerItemCarrinho(${index})"/>
        </div>
        `
    });
    if (lstCarrinho.length > 0) {
        modalCarrinho.innerHTML += `
        <p>Valor Final: R$ ${valorFinal.toFixed(2)}</p> 
        <button onclick="finalizaCompraModal()">Finalizar Compra</button>
        `
        modal.showModal();
    }
}

// Aparecer Modal
carrinho.addEventListener('click', preencheListarCarrinho)

// Remove itens do Carrinho
function removerItemCarrinho(index) {
    lstCarrinho.splice(index, 1);
    preencheListarCarrinho();
}

// Fecha e limpa a lista de compra do carrinho
function finalizaCompraModal () {
    modal.close();
    lstCarrinho = [];
}