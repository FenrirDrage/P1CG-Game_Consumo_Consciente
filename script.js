const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Recursos iniciais
let energia = 100;
let agua = 100;
let alimentacao = 100;
let sustentabilidade = 100;

// Variáveis para animação
let sunX = 100;
let cloudX1 = 0;
let cloudX2 = 300;

// Atualização automática (tempo)
let frame = 0;

function drawBackground() {
  // Muda o fundo com base na sustentabilidade
  let greenValue = Math.min(255, Math.max(100, sustentabilidade * 2));
  let redValue = 255 - greenValue;
  ctx.fillStyle = `rgb(${redValue}, ${greenValue}, 150)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sol
  ctx.beginPath();
  ctx.arc(sunX, 80, 40, 0, Math.PI * 2);
  ctx.fillStyle = "#FFD54F";
  ctx.fill();

  // Nuvens
  drawCloud(cloudX1, 100);
  drawCloud(cloudX2, 60);
}

function drawCloud(x, y) {
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.ellipse(x, y, 40, 20, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 25, y - 10, 35, 18, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 50, y, 40, 20, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawStats() {
  ctx.fillStyle = '#3c6e47';
  ctx.font = '18px Arial';
  ctx.fillText(`Energia: ${energia}`, 50, 300);
  ctx.fillText(`Água: ${agua}`, 50, 325);
  ctx.fillText(`Alimentação: ${alimentacao}`, 50, 350);
  ctx.fillText(`Sustentabilidade: ${sustentabilidade}`, 50, 375);

  // Barra de sustentabilidade
  ctx.fillStyle = '#a5d6a7';
  ctx.fillRect(250, 355, sustentabilidade * 3, 15);
  ctx.strokeRect(250, 355, 300, 15);
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

  limitarValores();
}

function limitarValores() {
  energia = Math.max(0, Math.min(100, energia));
  agua = Math.max(0, Math.min(100, agua));
  alimentacao = Math.max(0, Math.min(100, alimentacao));
  sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));
}

function checkGameOver() {
  if (energia <= 0 || agua <= 0 || alimentacao <= 0 || sustentabilidade <= 0) {
    alert("😢 O planeta não aguentou! Tenta ser mais sustentável!");
    resetGame();
  }
}

function resetGame() {
  energia = agua = alimentacao = sustentabilidade = 100;
}

function update() {
  frame++;

  // Movimento do sol e nuvens
  sunX += 0.2;
  if (sunX > canvas.width + 40) sunX = -40;

  cloudX1 += 0.3;
  cloudX2 += 0.2;
  if (cloudX1 > canvas.width + 60) cloudX1 = -100;
  if (cloudX2 > canvas.width + 60) cloudX2 = -200;

  // Recursos decaem lentamente com o tempo
  if (frame % 120 === 0) { // a cada ~2 segundos
    energia -= 1;
    agua -= 1;
    alimentacao -= 1;
    sustentabilidade -= 0.5;
  }

  limitarValores();
  checkGameOver();

  drawBackground();
  drawStats();

  requestAnimationFrame(update);
}

// Iniciar o jogo
update();