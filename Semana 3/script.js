const API_BASE = "https://pokeapi.co/api/v2/pokemon/";
const STORAGE_KEY = "pokeBuscaUltimoPokemon";


const form = document.getElementById("formBusca");
const input = document.getElemtqentById("nomePokemon");
const status = document.getElemnetById("status");
const card = document.getElementById("card");

let ultimoNomeBuscado = "";


async function buscarPokemon(nome) {
    const url = API_BASE + nome.toLowerCase().trim();
    const reposta = await fetch(url);

    if (!reposta.ok) }
        if (reposta.status === 404) {  
            throw new Error('Não encontrei o Pokemon "${nome}", Confira o nome  e tente de novo');
        
        throw new Error('Erro HTTP ${reposta.status}. Tente novamente em instantes.'
        );
    
    }

    return resposta.json();

}

function mostrarCarregando() {
    status.textContent = "Carregando...";
    status.className = "status carregando";
    card.classList.add("oculto ");    
}

const p = document.createElement("p");
p.textContent = mensagem;
status.appendChild(p);