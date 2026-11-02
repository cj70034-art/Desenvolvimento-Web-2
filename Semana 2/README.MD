# 📊 Controle de Vendas 

## 1. Sobre o projeto

Página de controle de vendas feita em **JavaScript puro** (sem frameworks),
aplicando o padrão ensinado em sala: **estado centralizado + renderização
derivada** ("o array é o caderno, a tela é a fotocópia").

Adaptei o domínio de **Gastos** (aula 2) para **Vendas** para (1) reforçar o
padrão sem copiar código, (2) introduzir cálculo derivado (`qtd × preço`) e
(3) aproximar de um cenário real de negócio.


**Fluxo:** toda ação do usuário altera o array `vendas` e chama
`renderizar()`, que reconstrói a tabela do zero a partir do estado. Não há
manipulação incremental de DOM — garante que array e tela nunca fiquem
dessincronizados.

---

## 2. Requisitos do enunciado — todos implementados

| Código | Implementação |
|---|---|
| R1  | `evento.preventDefault()` no submit |
| R2  | `validar()` retorna a primeira mensagem de erro (ordem definida) |
| R3  | `className = "mensagem"` reseta antes de aplicar `erro`/`sucesso` |
| R4  | `criarLinha()` com `createElement` + `appendChild` |
| R5  | `toLocaleString("pt-BR", { style: "currency", currency: "BRL" })` |
| R6  | Soma acumulada em `atualizarResumo()` |
| R7  | Categorias inicializadas em `0` → `R$ 0,00` quando vazias |
| R8  | Delegação: listener no `#listaVendas` + `closest(".remover")` |
| R9  | `classList.toggle("oculto", ...)` |
| R10 | `JSON.stringify` / `JSON.parse` no `localStorage` |
| R11 | `form.reset()` + `focus()` no primeiro campo |
| R12 | Todo DOM via `textContent`; helpers evitam repetição |
| B1–B4 | Meta, filtro, ordenação por lucro, contador de itens |

---

## 3. Funcionalidades além do escopo

Três adições que **não foram pedidas**, mas fazem sentido no domínio:

### 3.1 Custo unitário por venda
Cada venda tem `custo` e `preco`. Lucro por linha = `(preco − custo) × qtd`.
Exibido em coluna própria; **vermelho quando negativo** (venda abaixo do custo).

### 3.2 Capital investido → lucro final
O usuário informa quanto investiu no negócio. Exibo em cascata


Diferença importante: um negócio pode ter **lucro operacional positivo** e
ainda **não ter recuperado o capital** — exatamente o cenário de qualquer
negócio nos primeiros meses. Deixar isso explícito no design do site é didático.

Também calculo **margem** (`lucroFinal/receita × 100`) e **ROI**
(`lucroFinal/capital × 100`).

### 3.3 Migração de dados antigos
Vendas salvas antes de eu adicionar `custo` ganham `custo = 0` no carregamento:
