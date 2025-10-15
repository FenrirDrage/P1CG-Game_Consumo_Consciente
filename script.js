const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let energia = 100;
let agua = 100;
let alimentacao = 100;
let sustentabilidade = 100;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#3c6e47';
  ctx.font = '20px Arial';
  ctx.fillText(`Energia: ${energia}`, 50, 50);
  ctx.fillText(`Água: ${agua}`, 50, 80);
  ctx.fillText(`Alimentação: ${alimentacao}`, 50, 110);
  ctx.fillText(`Sustentabilidade: ${sustentabilidade}`, 50, 150);

  // Barra de sustentabilidade
  ctx.fillStyle = '#a5d6a7';
  ctx.fillRect(50, 180, sustentabilidade * 4, 20);
  ctx.strokeRect(50, 180, 400, 20);
}

function chooseAction(action) {
  switch(action) {
    case 'banhoCurto':
      agua -= 2;
      sustentabilidade += 3;
      break;
    case 'banhoLongo':
      agua -= 10;
      sustentabilidade -= 5;
      break;
    case 'luzDesligada':
      energia += 2;
      sustentabilidade += 4;
      break;
    case 'luzLigada':
      energia -= 5;
      sustentabilidade -= 3;
      break;
    case 'refeicaoVeg':
      alimentacao -= 3;
      sustentabilidade += 4;
      break;
    case 'refeicaoCarne':
      alimentacao -= 4;
      sustentabilidade -= 5;
      break;
  }

  // Limitar valores entre 0 e 100
  energia = Math.max(0, Math.min(100, energia));
  agua = Math.max(0, Math.min(100, agua));
  alimentacao = Math.max(0, Math.min(100, alimentacao));
  sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));

  draw();
  checkGameOver();
}

function checkGameOver() {
  if (energia <= 0 || agua <= 0 || alimentacao <= 0 || sustentabilidade <= 0) {
    alert("😢 O planeta não aguentou! Tenta ser mais sustentável!");
    resetGame();
  }
}

function resetGame() {
  energia = agua = alimentacao = sustentabilidade = 100;
  draw();
}

// Desenhar estado inicial
draw();