// ---------- Seleção de elementos ----------
const form = document.getElementById("formVenda");
const campoProduto = document.getElementById("produto");
const campoQuantidade = document.getElementById("quantidade");
const campoCusto = document.getElementById("custo");           // NOVO
const campoPreco = document.getElementById("preco");
const campoCategoria = document.getElementById("categoria");
const mensagem = document.getElementById("mensagem");
const totalGeral = document.getElementById("totalGeral");
const totalItens = document.getElementById("totalItens");
const vazio = document.getElementById("vazio");
const listaVendas = document.getElementById("listaVendas");
const contador = document.getElementById("contador");
const botaoLimpar = document.getElementById("limparTudo");

// Bônus — meta
const campoMeta = document.getElementById("meta");
const avisoMeta = document.getElementById("avisoMeta");
const filtroCategoria = document.getElementById("filtroCategoria");
const blocoTotal = totalGeral.parentElement;

// Bônus — análise de lucro (NOVO)
const campoCapital = document.getElementById("capital");
const blocoAnalise = document.getElementById("analiseLucro");
const elReceitaTotal = document.getElementById("receitaTotal");
const elCustoTotal = document.getElementById("custoTotal");
const elLucroOperacional = document.getElementById("lucroOperacional");
const elCapitalExibido = document.getElementById("capitalExibido");
const elLucroFinal = document.getElementById("lucroFinal");
const elMargemFinal = document.getElementById("margemFinal");
const elRoiFinal = document.getElementById("roiFinal");
const elRotuloLucro = document.getElementById("rotuloLucro");

// ---------- Dados ----------
const nomesCategorias = {
  eletronicos: "Eletrônicos",
  roupas: "Roupas",
  alimentos: "Alimentos",
  livros: "Livros",
  outros: "Outros",
};

let vendas = JSON.parse(localStorage.getItem("vendas")) ?? [];

// Migração: vendas antigas (sem o campo custo) ganham custo = 0
vendas.forEach(function (v) {
  if (typeof v.custo !== "number") v.custo = 0;
});

let meta = Number(localStorage.getItem("meta")) || 0;
let capital = Number(localStorage.getItem("capital")) || 0;   // NOVO

// ---------- Funções auxiliares ----------
function formatar(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem";
  if (tipo) mensagem.classList.add(tipo);
}

function salvar() {
  localStorage.setItem("vendas", JSON.stringify(vendas));
}

function validar(produto, textoQtd, textoCusto, textoPreco, categoria) {
  if (produto === "") {
    return "Informe o nome do produto.";
  }
  if (textoQtd === "" || Number.isNaN(Number(textoQtd))) {
    return "Informe a quantidade vendida.";
  }
  if (Number(textoQtd) <= 0) {
    return "A quantidade deve ser maior que zero.";
  }
  if (!Number.isInteger(Number(textoQtd))) {
    return "A quantidade deve ser um número inteiro.";
  }
  // NOVO: valida o custo
  if (textoCusto === "" || Number.isNaN(Number(textoCusto))) {
    return "Informe o custo unitário.";
  }
  if (Number(textoCusto) < 0) {
    return "O custo unitário não pode ser negativo.";
  }
  if (textoPreco === "" || Number.isNaN(Number(textoPreco))) {
    return "Informe o preço de venda.";
  }
  if (Number(textoPreco) <= 0) {
    return "O preço de venda deve ser maior que zero.";
  }
  // NOVO: aviso se está vendendo abaixo do custo (permite, mas avisa)
  // — não bloqueia, porque pode ser promoção / queima de estoque
  if (categoria === "") {
    return "Selecione uma categoria.";
  }
  return "";
}

// ---------- Desenho da tela ----------
function criarLinha(venda) {
  const tr = document.createElement("tr");
  tr.dataset.id = venda.id;

  const tdProduto = document.createElement("td");
  tdProduto.textContent = venda.produto;

  const tdCategoria = document.createElement("td");
  const badge = document.createElement("span");
  badge.classList.add("badge", venda.categoria);
  badge.textContent = nomesCategorias[venda.categoria];
  tdCategoria.appendChild(badge);

  const tdQtd = document.createElement("td");
  tdQtd.classList.add("qtd");
  tdQtd.textContent = venda.quantidade;

  const tdCusto = document.createElement("td");
  tdCusto.classList.add("custo");
  tdCusto.textContent = formatar(venda.custo);

  const tdPreco = document.createElement("td");
  tdPreco.classList.add("preco");
  tdPreco.textContent = formatar(venda.preco);

  // NOVO: lucro da venda = qtd × (preço − custo)
  const tdLucro = document.createElement("td");
  tdLucro.classList.add("lucro");
  const lucro = venda.quantidade * (venda.preco - venda.custo);
  tdLucro.textContent = formatar(arredondar(lucro));
  if (lucro < 0) {
    tdLucro.classList.add("negativo");
  }

  const tdAcao = document.createElement("td");
  const botao = document.createElement("button");
  botao.type = "button";
  botao.classList.add("remover");
  botao.setAttribute("aria-label", "Remover " + venda.produto);
  botao.textContent = "Remover";
  tdAcao.appendChild(botao);

  tr.appendChild(tdProduto);
  tr.appendChild(tdCategoria);
  tr.appendChild(tdQtd);
  tr.appendChild(tdCusto);
  tr.appendChild(tdPreco);
  tr.appendChild(tdLucro);
  tr.appendChild(tdAcao);
  return tr;
}

function atualizarResumo() {
  const totais = {};
  for (const categoria in nomesCategorias) {
    totais[categoria] = 0;
  }

  let receita = 0;
  let custoMercadorias = 0;
  let qtdTotal = 0;

  for (const venda of vendas) {
    const subtotal = venda.quantidade * venda.preco;
    const custoItem = venda.quantidade * venda.custo;

    totais[venda.categoria] += subtotal;
    receita += subtotal;
    custoMercadorias += custoItem;
    qtdTotal += venda.quantidade;
  }

  totalGeral.textContent = formatar(arredondar(receita));
  totalItens.textContent = qtdTotal;

  for (const categoria in totais) {
    document.getElementById("total-" + categoria).textContent = formatar(
      arredondar(totais[categoria])
    );
  }

  // Meta (usa receita)
  if (meta > 0 && receita >= meta) {
    blocoTotal.classList.add("meta-batida");
    avisoMeta.textContent = "🎉 Meta batida! Você vendeu " + formatar(arredondar(receita - meta)) + " acima da meta.";
  } else {
    blocoTotal.classList.remove("meta-batida");
    if (meta > 0) {
      avisoMeta.textContent = "Faltam " + formatar(arredondar(meta - receita)) + " para atingir a meta.";
    } else {
      avisoMeta.textContent = "";
    }
  }

  // NOVO: análise de lucro (passa os totais já calculados)
  atualizarAnaliseLucro(receita, custoMercadorias);
}

// NOVO: calcula e exibe o lucro esperado a partir do capital investido
function atualizarAnaliseLucro(receita, custoMercadorias) {
  const lucroOperacional = receita - custoMercadorias; // lucro antes do capital
  const lucroFinal = lucroOperacional - capital;        // lucro depois do capital

  // Escreve os valores
  elReceitaTotal.textContent = formatar(arredondar(receita));
  elCustoTotal.textContent = "− " + formatar(arredondar(custoMercadorias));
  elLucroOperacional.textContent = formatar(arredondar(lucroOperacional));
  elCapitalExibido.textContent = "− " + formatar(arredondar(capital));
  elLucroFinal.textContent = formatar(arredondar(lucroFinal));

  // Rótulo muda conforme o sinal: "Lucro final" vs "Prejuízo"
  elRotuloLucro.textContent = lucroFinal < 0 ? "Prejuízo (capital ainda não voltou)" : "Lucro final";

  // Margem final = lucroFinal / receita (só se receita > 0)
  if (receita > 0) {
    const margem = (lucroFinal / receita) * 100;
    elMargemFinal.textContent = margem.toFixed(1) + "%";
  } else {
    elMargemFinal.textContent = "—";
  }

  // ROI = lucroFinal / capital (só se capital > 0)
  if (capital > 0) {
    const roi = (lucroFinal / capital) * 100;
    elRoiFinal.textContent = roi.toFixed(1) + "%";
  } else {
    elRoiFinal.textContent = "—";
  }

  // Aplica a cor certa no bloco inteiro
  blocoAnalise.classList.remove("positivo", "negativo", "neutro");
  if (lucroFinal > 0) {
    blocoAnalise.classList.add("positivo");
  } else if (lucroFinal < 0) {
    blocoAnalise.classList.add("negativo");
  } else {
    blocoAnalise.classList.add("neutro");
  }
}

function renderizar() {
  listaVendas.textContent = "";

  // Ordenado pelo maior lucro por linha (decrescente)
  const vendasOrdenadas = [...vendas].sort(function (a, b) {
    const lucroA = a.quantidade * (a.preco - a.custo);
    const lucroB = b.quantidade * (b.preco - b.custo);
    return lucroB - lucroA;
  });

  const filtro = filtroCategoria.value;
  for (const venda of vendasOrdenadas) {
    if (filtro === "" || venda.categoria === filtro) {
      listaVendas.appendChild(criarLinha(venda));
    }
  }

  contador.textContent = "(" + vendas.length + ")";
  vazio.classList.toggle("oculto", listaVendas.children.length > 0);
  atualizarResumo();
}

// ---------- Eventos ----------
form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const produto = campoProduto.value.trim();
  const textoQtd = campoQuantidade.value;
  const textoCusto = campoCusto.value;   // NOVO
  const textoPreco = campoPreco.value;
  const categoria = campoCategoria.value;

  const problema = validar(produto, textoQtd, textoCusto, textoPreco, categoria);
  if (problema !== "") {
    mostrarMensagem(problema, "erro");
    return;
  }

  vendas.push({
    id: Date.now(),
    produto: produto,
    quantidade: Number(textoQtd),
    custo: arredondar(Number(textoCusto)),  // NOVO
    preco: arredondar(Number(textoPreco)),
    categoria: categoria,
  });

  salvar();
  renderizar();
  form.reset();
  campoProduto.focus();
  mostrarMensagem("Venda registrada com sucesso!", "sucesso");
});

listaVendas.addEventListener("click", function (evento) {
  const botao = evento.target.closest(".remover");
  if (!botao) return;

  const id = Number(botao.closest("tr").dataset.id);
  vendas = vendas.filter(function (venda) {
    return venda.id !== id;
  });

  salvar();
  renderizar();
});

filtroCategoria.addEventListener("change", renderizar);

campoMeta.addEventListener("input", function () {
  meta = Number(campoMeta.value) || 0;
  localStorage.setItem("meta", meta);
  atualizarResumo();
});

// NOVO: capital investido
campoCapital.addEventListener("input", function () {
  capital = Number(campoCapital.value) || 0;
  localStorage.setItem("capital", capital);
  atualizarResumo();
});

botaoLimpar.addEventListener("click", function () {
  if (vendas.length === 0) return;
  if (confirm("Tem certeza que deseja apagar todas as vendas?")) {
    vendas = [];
    salvar();
    renderizar();
  }
});

// ---------- Início ----------
if (meta > 0) campoMeta.value = meta;
if (capital > 0) campoCapital.value = capital;
renderizar();