// ---------- Seleção de elementos ----------
const form = document.getElementById("formGasto");
const campoDescricao = document.getElementById("descricao");
const campoValor = document.getElementById("valor");
const campoCategoria = document.getElementById("categoria");
const campoData = document.getElementById("data");            // NOVO
const mensagem = document.getElementById("mensagem");
const totalGeral = document.getElementById("totalGeral");
const vazio = document.getElementById("vazio");
const listaGastos = document.getElementById("listaGastos");
const contador = document.getElementById("contador");        // NOVO
const botaoLimpar = document.getElementById("limparTudo");   // NOVO

// Bônus
const campoOrcamento = document.getElementById("orcamento");
const avisoOrcamento = document.getElementById("avisoOrcamento");
const filtroCategoria = document.getElementById("filtroCategoria");
const blocoTotal = totalGeral.parentElement;

// ---------- Dados ----------
const nomesCategorias = {
  alimentacao: "Alimentação",
  transporte: "Transporte",
  lazer: "Lazer",
  estudos: "Estudos",
  financas: "Finanças", // NOVO
  outros: "Outros",
};

// A "fonte da verdade": a tela é sempre desenhada a partir deste array.
let gastos = JSON.parse(localStorage.getItem("gastos")) ?? [];
let orcamento = Number(localStorage.getItem("orcamento")) || 0;

// ---------- Funções auxiliares ----------
function formatar(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// NOVO: transforma "2026-11-02" em "02/11/2026"
function formatarData(isoString) {
  if (!isoString) return "";
  const [ano, mes, dia] = isoString.split("-");
  return dia + "/" + mes + "/" + ano;
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem";
  if (tipo) {
    mensagem.classList.add(tipo);
  }
}

function salvar() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}

function validar(descricao, textoValor, categoria, data) {
  if (descricao === "") {
    return "Informe a descrição do gasto.";
  }
  if (textoValor === "" || Number.isNaN(Number(textoValor))) {
    return "Informe um valor numérico.";
  }
  if (Number(textoValor) <= 0) {
    return "O valor deve ser maior que zero.";
  }
  if (categoria === "") {
    return "Selecione uma categoria.";
  }
  if (data === "") {
    return "Informe a data do gasto.";
  }
  return "";
}

// ---------- Desenho da tela ----------
function criarLinha(gasto) {
  const tr = document.createElement("tr");
  tr.dataset.id = gasto.id;

  const tdDescricao = document.createElement("td");
  tdDescricao.textContent = gasto.descricao;

  const tdCategoria = document.createElement("td");
  const badge = document.createElement("span");
  badge.classList.add("badge", gasto.categoria);
  badge.textContent = nomesCategorias[gasto.categoria];
  tdCategoria.appendChild(badge);

  // NOVO: célula de data
  const tdData = document.createElement("td");
  tdData.textContent = formatarData(gasto.data);

  const tdValor = document.createElement("td");
  tdValor.classList.add("valor");
  tdValor.textContent = formatar(gasto.valor);

  const tdAcao = document.createElement("td");
  const botao = document.createElement("button");
  botao.type = "button";
  botao.classList.add("remover");
  botao.setAttribute("aria-label", "Remover " + gasto.descricao);
  botao.textContent = "Remover";
  tdAcao.appendChild(botao);

  tr.appendChild(tdDescricao);
  tr.appendChild(tdCategoria);
  tr.appendChild(tdData);
  tr.appendChild(tdValor);
  tr.appendChild(tdAcao);
  return tr;
}

function atualizarResumo() {
  const totais = {};
  for (const categoria in nomesCategorias) {
    totais[categoria] = 0;
  }

  let geral = 0;
  for (const gasto of gastos) {
    totais[gasto.categoria] += gasto.valor;
    geral += gasto.valor;
  }

  totalGeral.textContent = formatar(geral);
  for (const categoria in totais) {
    document.getElementById("total-" + categoria).textContent = formatar(totais[categoria]);
  }

  // Bônus: alerta de orçamento
  if (orcamento > 0 && geral > orcamento) {
    blocoTotal.classList.add("estourou");
    avisoOrcamento.textContent = "Atenção: você ultrapassou o orçamento em " + formatar(geral - orcamento) + ".";
  } else {
    blocoTotal.classList.remove("estourou");
    avisoOrcamento.textContent = "";
  }
}

function renderizar() {
  listaGastos.textContent = "";

  // NOVO: cópia ordenada do maior para o menor (não muta o array original)
  const gastosOrdenados = [...gastos].sort(function (a, b) {
    return b.valor - a.valor;
  });

  const filtro = filtroCategoria.value;
  for (const gasto of gastosOrdenados) {
    if (filtro === "" || gasto.categoria === filtro) {
      listaGastos.appendChild(criarLinha(gasto));
    }
  }

  // NOVO: contador mostra o total real (não muda com o filtro)
  contador.textContent = "(" + gastos.length + ")";

  vazio.classList.toggle("oculto", listaGastos.children.length > 0);
  atualizarResumo();
}

// ---------- Eventos ----------
form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const descricao = campoDescricao.value.trim();
  const textoValor = campoValor.value;
  const categoria = campoCategoria.value;
  const data = campoData.value; // NOVO

  const problema = validar(descricao, textoValor, categoria, data);
  if (problema !== "") {
    mostrarMensagem(problema, "erro");
    return;
  }

  gastos.push({
    id: Date.now(),
    descricao: descricao,
    valor: Math.round(Number(textoValor) * 100) / 100,
    categoria: categoria,
    data: data, // NOVO
  });

  salvar();
  renderizar();
  form.reset();
  campoDescricao.focus();

  // NOVO: depois do reset, pré-preenche a data com "hoje"
  campoData.value = new Date().toISOString().split("T")[0];

  mostrarMensagem("Gasto adicionado com sucesso!", "sucesso");
});

listaGastos.addEventListener("click", function (evento) {
  const botao = evento.target.closest(".remover");
  if (!botao) {
    return;
  }

  const id = Number(botao.closest("tr").dataset.id);
  gastos = gastos.filter(function (gasto) {
    return gasto.id !== id;
  });

  salvar();
  renderizar();
});

filtroCategoria.addEventListener("change", renderizar);

campoOrcamento.addEventListener("input", function () {
  orcamento = Number(campoOrcamento.value) || 0;
  localStorage.setItem("orcamento", orcamento);
  atualizarResumo();
});

// NOVO: botão Limpar tudo
botaoLimpar.addEventListener("click", function () {
  if (gastos.length === 0) return;

  if (confirm("Tem certeza que deseja apagar todos os gastos?")) {
    gastos = [];
    salvar();
    renderizar();
  }
});

// ---------- Início ----------
if (orcamento > 0) {
  campoOrcamento.value = orcamento;
}

// NOVO: data já vem preenchida com "hoje" ao abrir a página
campoData.value = new Date().toISOString().split("T")[0];

renderizar();