// =========================
// VARIÁVEIS DO JOGO
// =========================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Recursos
let energia = 100;
let agua = 100;
let comida = 100;
let sustentabilidade = 100;

// Pontuação
let pontos = 0;

// Mensagem educativa
let mensagem = "";
let mensagemOpacity = 0;

// Animações
let solX = 0;
let nuvemX = 200;
let nuvem2X = 600;

// =========================
// FUNÇÃO PARA MENSAGENS EDUCATIVAS
// =========================
function mostrarMensagem(texto) {
    mensagem = texto;
    mensagemOpacity = 1;
}

// =========================
// AÇÕES DO JOGADOR
// =========================
function chooseAction(action) {
    switch (action) {
        case "banhoCurto":
            agua += 5;
            sustentabilidade += 3;
            pontos += 10;
            mostrarMensagem("Banhos curtos poupam até 80L de água!");
            break;

        case "banhoLongo":
            agua -= 10;
            sustentabilidade -= 5;
            pontos -= 5;
            mostrarMensagem("Banhos longos gastam MUITA água!");
            break;

        case "luzDesligada":
            energia += 5;
            sustentabilidade += 2;
            pontos += 10;
            mostrarMensagem("Desligar luzes economiza energia!");
            break;

        case "luzLigada":
            energia -= 10;
            pontos -= 5;
            mostrarMensagem("Luzes acesas à toa = desperdício!");
            break;

        case "refeicaoVeg":
            comida += 5;
            sustentabilidade += 4;
            pontos += 12;
            mostrarMensagem("Refeições vegetarianas reduzem emissões!");
            break;

        case "refeicaoCarne":
            comida -= 8;
            sustentabilidade -= 4;
            pontos -= 3;
            mostrarMensagem("Excesso de carne aumenta impacto ambiental.");
            break;
    }

    // Limitar valores
    energia = Math.max(0, Math.min(100, energia));
    agua = Math.max(0, Math.min(100, agua));
    comida = Math.max(0, Math.min(100, comida));
    sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));
}

// =========================
// DESENHAR BARRAS
// =========================
function drawBar(label, value, y) {
    ctx.fillStyle = "black";
    ctx.fillText(label, 20, y - 5);

    ctx.fillStyle = "white";
    ctx.fillRect(20, y, 200, 20);

    ctx.fillStyle = "green";
    ctx.fillRect(20, y, value * 2, 20);
}

// =========================
// LOOP DO JOGO
// =========================
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo muda consoante sustentabilidade
    const red = 255 - sustentabilidade * 2;
    const green = sustentabilidade * 2;
    ctx.fillStyle = `rgb(${red}, ${green}, 100)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sol
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(solX, 80, 40, 0, Math.PI * 2);
    ctx.fill();
    solX = (solX + 1) % 900;

    // Nuvens
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(nuvemX, 60, 30, 0, Math.PI * 2);
    ctx.arc(nuvemX + 40, 60, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(nuvem2X, 100, 25, 0, Math.PI * 2);
    ctx.arc(nuvem2X + 35, 100, 30, 0, Math.PI * 2);
    ctx.fill();

    nuvemX -= 0.5;
    nuvem2X -= 0.3;
    if (nuvemX < -100) nuvemX = 900;
    if (nuvem2X < -100) nuvem2X = 900;

    // Barras
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    drawBar("Energia", energia, 250);
    drawBar("Água", agua, 280);
    drawBar("Alimentação", comida, 310);
    drawBar("Sustentabilidade", sustentabilidade, 340);

    // Pontos
    ctx.fillStyle = "black";
    ctx.fillText("Pontuação: " + pontos, 650, 30);

    // Mensagem educativa com fade
    if (mensagemOpacity > 0) {
        ctx.fillStyle = `rgba(0,0,0,${mensagemOpacity})`;
        ctx.fillText(mensagem, 250, 200);
        mensagemOpacity -= 0.01;
    }

    // GAME OVER
    if (energia === 0 || agua === 0 || comida === 0 || sustentabilidade === 0) {
        ctx.fillStyle = "black";
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 280, 200);
        ctx.font = "20px Arial";
        ctx.fillText("Pontuação final: " + pontos, 320, 240);
        return; // parar o jogo
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

// =========================================================
// ML5.JS - RECONHECIMENTO DE VOZ
// =========================================================

let classifier;

function startML() {
    // OPÇÃO 1: Usar modelo pré-treinado do ml5.js
    classifier = ml5.soundClassifier('SpeechCommands18w', modelReady);
}

function modelReady() {
    console.log("Modelo de voz carregado!");
    //console.log("Diga as palavras para testar (ex: curto, longo, luzoff, luzon, vegetariana, carne)");
    console.log("Diga as palavras para testar (ex: up, down, left, right, go, stop)");
    classifier.classify(gotResult);
}

function gotResult(error, results) {
    if (error) {
        console.error(error);
        return;
    }

    const comando = results[0].label.toLowerCase();
    const confianca = results[0].confidence;
    
    console.log("Comando detectado:", comando, "Confiança:", confianca);

    // Mapear comandos do modelo pré-treinado para ações do jogo
    if (comando === "up") chooseAction("banhoCurto");
    if (comando === "down") chooseAction("banhoLongo");
    if (comando === "left") chooseAction("luzDesligada");
    if (comando === "right") chooseAction("luzLigada");
    if (comando === "go") chooseAction("refeicaoVeg");
    if (comando === "stop") chooseAction("refeicaoCarne");
}

// Iniciar o reconhecimento de voz
try {
    startML();
} catch (error) {
    console.error("Erro ao iniciar ML:", error);
    console.log("O jogo funcionará apenas com os botões");
}