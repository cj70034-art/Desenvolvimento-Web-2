
// - Importação do prompt-sync para entrada de dados no terminal

const prompt = require('prompt-sync')();

// - Avaliação de Risco de Crédito

function avaliarRiscoDeCredito(rendaMensal, dividaAtual) {
  const renda  = parseFloat(rendaMensal);
  const divida = parseFloat(dividaAtual);

  const TE = (divida / renda) * 100;

  if (TE < 10) {
    return "Risco Baixo";
  } else if (TE < 30) {
    return "Risco Moderado";
  } else {
    return "Risco Alto";
  }
}

console.log("\n===== QUESTÃO 1 - Risco de Crédito =====");
const rendaInput  = prompt("Informe a renda mensal (R$): ");
const dividaInput = prompt("Informe a dívida atual (R$): ");
const classificacao = avaliarRiscoDeCredito(rendaInput, dividaInput);
console.log(`Renda: R$ ${rendaInput} | Dívida: R$ ${dividaInput} → ${classificacao}`);


// - Manipulação de arrayj

console.log("\n===== QUESTÃO 2 - Manipulação de Array =====");
const numeros = [];
let continuar = true;

while (continuar) {
  const entrada = prompt("Digite um número (ou pressione Enter para finalizar): ");
  if (entrada.trim() === "") {
    continuar = false;
  } else {
    const n = parseFloat(entrada);
    if (!isNaN(n)) numeros.push(n);
    else console.log("⚠️ Valor inválido, tente novamente.");
  }
}

if (numeros.length === 0) {
  console.log("Nenhum número foi informado.");
} else {
  // a) Maior e menor
  console.log(`Array digitado: [${numeros.join(", ")}]`);
  console.log(`Maior valor: ${Math.max(...numeros)}`);
  console.log(`Menor valor: ${Math.min(...numeros)}`);

  // b) Dobro usando map()
  const dobro = numeros.map(n => n * 2);
  console.log(`Dobro de cada número: [${dobro.join(", ")}]`);

  // c) Maiores que 5 usando filter()
  const maioresQue5 = numeros.filter(n => n > 5);
  console.log(`Números maiores que 5: [${maioresQue5.join(", ")}]`);
}

// - Objeto literal "carro"

console.log("\n===== QUESTÃO 3 - Objeto Carro =====");
const carro = {
  marca: "Toyota",
  modelo: "Corolla",
  ano: 2020,
  exibirInfo() {
    console.log(`Marca: ${this.marca} | Modelo: ${this.modelo} | Ano: ${this.ano}`);
  }
};

// a) Chamar exibirInfo
carro.exibirInfo();

// b) Adicionar cor
carro.cor = "Preto";

// c) Atualizar ano
carro.ano = 2025;

// d) Exibir objeto completo
console.log(carro);
