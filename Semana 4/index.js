
// Atividade: criar a própria API com Express

const express = require("express");
const app = express();
const PORT = 3000;

//  MIDDLEWARE GLOBAL DE LOG
// Registrado antes de todas as rotas, conforme exigido.
// Mostra no terminal: data/hora + método + URL de cada requisição.
app.use((req, res, next) => {
  const agora = new Date().toLocaleString("pt-BR");
  console.log(`[${agora}] ${req.method} ${req.url}`);
  next(); // sempre chamar next() para a requisição continuar
});

//  DADOS (array em memória — sem banco de dados)
// Cada item: id, nome, categoria + 2 campos próprios (ano, plataforma, nota)
const jogos = [
  { id: 1,  nome: "The Witcher 3",     categoria: "rpg",          ano: 2015, plataforma: "PC",    nota: 9.8 },
  { id: 2,  nome: "God of War",        categoria: "acao",         ano: 2018, plataforma: "PS4",   nota: 9.5 },
  { id: 3,  nome: "Hollow Knight",     categoria: "metroidvania", ano: 2017, plataforma: "PC",    nota: 9.4 },
  { id: 4,  nome: "Elden Ring",        categoria: "rpg",          ano: 2022, plataforma: "PC",    nota: 9.6 },
  { id: 5,  nome: "Minecraft",         categoria: "sandbox",      ano: 2011, plataforma: "Multi", nota: 9.0 },
  { id: 6,  nome: "Stardew Valley",    categoria: "simulacao",    ano: 2016, plataforma: "PC",    nota: 9.2 },
  { id: 7,  nome: "The Last of Us",    categoria: "acao",         ano: 2013, plataforma: "PS3",   nota: 9.7 },
  { id: 8,  nome: "Celeste",           categoria: "plataforma",   ano: 2018, plataforma: "PC",    nota: 9.3 },
  { id: 9,  nome: "Baldur's Gate 3",   categoria: "rpg",          ano: 2023, plataforma: "PC",    nota: 9.9 },
  { id: 10, nome: "Hades",             categoria: "roguelike",    ano: 2020, plataforma: "PC",    nota: 9.1 },
];

//  ROTA RAIZ  mensagem de boas-vindas
app.get("/", (req, res) => {
  res.json({
    mensagem: "Bem-vindo à API Jogos!",
    rotas: [
      "GET /jogos",
      "GET /jogos/:id",
      "GET /jogos?categoria=rpg",
      "GET /jogos?anoMin=2015",
      "GET /jogos?limite=5",
      "GET /jogos?ordem=nota",
      "GET /jogos/total",
      "GET /jogos/aleatorio"
    ]
  });
});


// REQUISITO PRÓPRIO #1 — contagem total
// GET /jogos/total
app.get("/jogos/total", (req, res) => {
  res.json({ total: jogos.length });
});


// 5) REQUISITO PRÓPRIO #2 — item sorteado
// GET /jogos/aleatorio

app.get("/jogos/aleatorio", (req, res) => {
  const indice = Math.floor(Math.random() * jogos.length);
  res.json(jogos[indice]);
});

// =========================================================
// 6) LISTA COMPLETA + FILTROS OPCIONAIS
// GET /jogos
//   ?categoria=rpg    → filtra por categoria (case-insensitive)
//   ?anoMin=2015      → filtra por ano mínimo (numérico, validado)
//   ?limite=5         → limita quantidade (numérico, validado)
//   ?ordem=nota|ano   → ordena (requisito próprio #3)
// =========================================================

app.get("/jogos", (req, res) => {
  let resultado = [...jogos]; // cópia pra não mutar o original

  // Filtro por categoria (query string) — case-insensitive
  if (req.query.categoria) {
    const cat = req.query.categoria.toLowerCase();
    resultado = resultado.filter((j) => j.categoria.toLowerCase() === cat);
  }

  // Filtro numérico: anoMin — validado com parseInt + isNaN
  if (req.query.anoMin !== undefined) {
    const anoMin = parseInt(req.query.anoMin);
    if (isNaN(anoMin)) {
      return res.status(400).json({
        erro: "O parâmetro 'anoMin' deve ser um número."
      });
    }
    resultado = resultado.filter((j) => j.ano >= anoMin);
  }

  // Ordenação opcional (requisito próprio #3)
  if (req.query.ordem === "nota") {
    resultado.sort((a, b) => b.nota - a.nota); // decrescente
  } else if (req.query.ordem === "ano") {
    resultado.sort((a, b) => b.ano - a.ano);
  }

  // Limite (numérico, validado)
  if (req.query.limite !== undefined) {
    const limite = parseInt(req.query.limite);
    if (isNaN(limite) || limite <= 0) {
      return res.status(400).json({
        erro: "O parâmetro 'limite' deve ser um número positivo."
      });
    }
    resultado = resultado.slice(0, limite);
  }

  res.json(resultado);
});

// =========================================================
//  BUSCA POR ID (parâmetro de rota) — DEPOIS das rotas específicas
// GET /jogos/:id
//   id não numérico → 400
//   id numérico inexistente → 404
// =========================================================
app.get("/jogos/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // 1) id não é número
  if (isNaN(id)) {
    return res.status(400).json({ erro: "O id deve ser um número." });
  }

  // 2) id numérico mas não existe
  const jogo = jogos.find((j) => j.id === id);
  if (!jogo) {
    return res.status(404).json({ erro: "Jogo não encontrado." });
  }

  // 3) encontrou
  res.json(jogo);
});


// FALLBACK 404 (rota inexistente)
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});


//  INICIALIZAÇÃO
app.listen(PORT, () => {
  console.log(`🚀 API Jogos rodando em http://localhost:${PORT}`);
});