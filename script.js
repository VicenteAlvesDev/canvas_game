
// // --- MEMORY LEAK SOLVE ---
// let moveAnimationFrame = null;

// --- CANVAS E CONTEXTO ---
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

// --- PONTUAÇÃO E TEMPO ---
let score = parseInt(document.querySelector("#score").innerHTML);
let time = parseInt(document.querySelector("#time").innerHTML);
let timeCheck = 30;

// --- ÁUDIO ---
const music = new Audio("./music/I'm a believer - Richard Salter.mp3");
music.loop = true;
music.volume = 1;

function pararMusica() {
    music.pause();
    music.currentTime = 0;
}

// --- VARIÁVEIS DE INTERVALOS ---
let timerInterval = null;
let carro1Interval = null;
let carro2Interval = null;

// --- SPRITES ---
// Player
const player_spr = new Image();
player_spr.src = "assets/player.png";

let animationTimer = 0; // contador de tempo para troca de frame

let currentFrame = 0; // Quadro atual da animação
let currentRow = 0;

let totalFrames = 4; // Total de quadros na spritesheet

let spriteWidth = 1334 / totalFrames; // Largura de um frame da spritesheet
let spriteHeight = 1997 / totalFrames; // Altura do frame (supondo uma linha só)

// Carro
let carro_spr = new Image();
let carroN_spr = new Image();

const carro1_spr = "./assets/truck.png";
const carro2_spr = "./assets/truck2.png";

carro_spr.src = carro1_spr;
carroN_spr.src = carro2_spr;

let carro1_currentFrame = 0; // Quadro atual da animação
let carro1_currentRow = 2;

let carro2_currentFrame = 0; // Quadro atual da animação
let carro2_currentRow = 1;

let carro_spriteWidth = 376 / totalFrames; // Largura de um frame da spritesheet
let carro_spriteHeight = 348 / totalFrames; // Altura do frame (supondo uma linha só)

// Coletável / Lixo
let trash_spr = new Image();
trash_spr.src = "assets/trash.png";

// Lixeira
let bin_spr = new Image();
bin_spr.src = "assets/bin.png";

// --- OBJETOS DE JOGO ---
let game = {
    width: 800,
    height: 600,
    state : "start"
};

let player = {
    x: 400,
    y: 470,
    width: 50,
    height: 50,
    speed: 5,

    with_trash: false,
    dead: false,

    spr_x: 400,
    spr_y: 450,
    spr_width: 50,
    spr_height: 75
};

let keys = {
    up: false, 
    down: false,
    left: false, 
    right: false,
};

let trash = {
    x: Math.random() * (game.width - 50),
    y: Math.random() * (game.height - 50),
    width: 50,
    height: 50
}


let bin  = {
    x: 120,
    y: 440,
    width: 60,
    height: 80,

    spr_x: 100,
    spr_y: 430,
    spr_width: 100,
    spr_height: 100
}

let carro1 = {
    x: 0, // posicao inicial em X
    y: 160, // posicao inicial em Y 188
    width: 94 * 1.5, // largura do carro
    height: 87 * 1.1, // altura do carro
    speed: 3,

    spr_x: 0,
    spr_y: 150,
    spr_width: 94 * 1.5,
    spr_height: 87 * 1.5
};

let carro2 = {
    x: 600,
    y: 340,
    width: 94 * 1.5,
    height: 87 * 1.1,
    speed: -3,

    spr_x: 600,
    spr_y: 320,
    spr_width: 94 * 1.5,
    spr_height: 87 * 1.5
};

// --- MENU ---
let menu_spr = new Image();
menu_spr.src = "assets/tdScreen/tree.png";

let menu = {
    x: 530,
    y: 400,
    width: 200,
    height: 200
}

let menu2_spr = new Image();
menu2_spr.src = "assets/tdScreen/tree.png";

let menu2 = {
    x: 50,
    y: 400,
    width: 200,
    height: 200
}

let nuvem_spr = new Image();
nuvem_spr.src = "assets/tdScreen/cloud.png";

let nuvem = {
    x: 150,
    y: 70,
    width: 200,
    height: 200
}

let nuvem2_spr = new Image();
nuvem2_spr.src = "assets/tdScreen/cloud.png";

let nuvem2 = {
    x: 400,
    y: 70,
    width: 200,
    height: 200
}

let fogo_spr = new Image();
fogo_spr.src = "assets/tdScreen/fireTree.png";

let fogo = {
    x: 530,
    y: 400,
    width: 200,
    height: 200
}

let fogo2_spr = new Image();
fogo2_spr.src = "assets/tdScreen/fireTree.png";

let fogo2 = {
    x: 50,
    y: 400,
    width: 200,
    height: 200
}

let audioPlayed = false;
let deathAudioPlayed = false;

// --- FUNÇÕES ---

// // --- PARAR TODOS OS LOOPS E TIMERS ---
// function pararLoopsEanimacoes() {
//     if (moveAnimationFrame) {
//         cancelAnimationFrame(moveAnimationFrame);
//         moveAnimationFrame = null;
//     }

//     if (timerInterval) {
//         clearInterval(timerInterval);
//         timerInterval = null;
//     }

//     pararAnimacoesCarros();
// }

// Controla animação dos carros (loop de frames)
function iniciarAnimacoesCarros() {
    carro1Interval = setInterval(() => {
        carro1_currentFrame++;
        if (carro1_currentFrame > 3) {
            carro1_currentFrame = 0;
        }
    }, 200);

    carro2Interval = setInterval(() => {
        carro2_currentFrame++;
        if (carro2_currentFrame > 3) {
            carro2_currentFrame = 0;
        }
    }, 200);
}

function pararAnimacoesCarros() {
    clearInterval(carro1Interval);
    clearInterval(carro2Interval);
}

// Movimento dos carros com looping na tela
function moverCarro(carro) {
    carro.x += carro.speed;

    if (carro.speed > 0 && carro.x > canvas.width) {
        carro.x = -carro.width;
        trocarCorCarro();
    } else if (carro.speed < 0 && carro.x + carro.width < 0) {
        carro.x = canvas.width;
        trocarCorCarro();
    }
}

function trocarCorCarro() {
    if (Math.random() < 0.5) {
        carro_spr.src = carro1_spr;
    } else {
        carro_spr.src = carro2_spr;
    }

    if (Math.random() < 0.5) {
        carroN_spr.src = carro1_spr;
    } else {
        carroN_spr.src = carro2_spr;
    }

}

// Temporizador do jogo
function temporizador() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        time--;
        document.querySelector("#time").textContent = time;

        if (time <= 0) {
            game.state = "end";
            clearInterval(timerInterval);
        }
    }, 1000);
}

// Checa colisão entre dois objetos
function checarColisao(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Reinicia o jogo
function reiniciarJogo() {
    clearInterval(timerInterval);
    pararAnimacoesCarros();
    pararMusica();
    // pararLoopsEanimacoes();

    player.x = 400;
    player.y = 470;
    player.with_trash = false;
    player.dead = false;
    deathAudioPlayed = false;

    trash.x = Math.random() * (game.width - trash.width);
    trash.y = Math.random() * (game.height - trash.height);

    player.spr_x = 400;
    player.spr_y = 450;

    score = 0;
    time = 30;
    timeCheck = 30;

    carro1.x = 0;
    carro1.y = 160;

    carro2.x = 600;
    carro2.y = 340;

    document.querySelector("#score").textContent = score;
    document.querySelector("#time").textContent = time;

    game.state = "start";
}

// Desenho do cenário
function desenharMapa() {
    const blocos = [
        { color: "green", y: 0, height: 75 },
        { color: "darkgray", y: 75, height: 75 },
        { color: "gray", y: 150, height: 225 },  // 4 pistas juntas, 75 * 3
        { color: "darkgray", y: 450, height: 75 },
        { color: "green", y: 525, height: 75 },
    ];

    blocos.forEach(({ color, y, height }) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, y, game.width, height);
    });

    // Dividir as pistas cinzas em 4 camadas fica mais elegante?
    ctx.fillStyle = "gray";
    for (let i = 0; i < 4; i++) {
        ctx.fillRect(0, 150 + i * 75, game.width, 75);
    }
}

// Desenha tela inicial
function desenharTelaStart() {
    // ctx.font = "30px Arial";
    // ctx.fillStyle = "black";
    // ctx.textAlign = "center";
    // ctx.fillText("Pressione Enter para começar", game.width / 2, game.height / 2);
    const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
    gradient.addColorStop(0, "#89f7fe");
    gradient.addColorStop(1, "#66a6ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, game.width, game.height);
    
    ctx.drawImage(
        menu_spr,
        menu.x,      // Posicao X
        menu.y,      // Posicao Y
        menu.width,
        menu.height
    );
    ctx.drawImage(
        menu2_spr,
        menu2.x,      // Posicao X
        menu2.y,      // Posicao Y
        menu2.width,
        menu2.height
    );
    ctx.drawImage(
        nuvem_spr,
        nuvem.x,
        nuvem.y,
        nuvem.width,
        nuvem.height
    );
    ctx.drawImage(
        nuvem2_spr,
        nuvem2.x,
        nuvem2.y,
        nuvem2.width,
        nuvem2.height
    );
    ctx.font = "30px 'Silkscreen'";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Pressione Enter para começar", game.width / 2, game.height / 2);
    return;
}

// Desenha tela de fim de jogo
function desenharTelaFim() {
    // pararLoopsEanimacoes();

    // ctx.font = "30px Arial";
    // ctx.fillStyle = "red";
    // ctx.textAlign = "center";
    // ctx.fillText("Fim de Jogo!", game.width / 2, game.height / 2 - 20);

    // ctx.font = "20px Arial";
    // ctx.fillStyle = "black";
    // ctx.fillText(`Pontuação: ${score}`, game.width / 2, game.height / 2 + 40);
    // ctx.fillText("Pressione R para reiniciar", game.width / 2, game.height / 2 + 10);

    const gradient = ctx.createLinearGradient(0, 0, 0, game.height);
    gradient.addColorStop(0, "#FF0000");   
    gradient.addColorStop(0.5, "#FF8000"); 
    gradient.addColorStop(1, "#552200");   
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, game.width, game.height);

    
    ctx.drawImage(
        fogo_spr,
        fogo.x,
        fogo.y,
        fogo.width,
        fogo.height
    );
    ctx.drawImage(
        fogo2_spr,
        fogo2.x,
        fogo2.y,
        fogo2.width,
        fogo2.height
    );
    ctx.drawImage(
        nuvem_spr,
        nuvem.x,
        nuvem.y,
        nuvem.width,
        nuvem.height
    );
    ctx.drawImage(
        nuvem2_spr,
        nuvem2.x,
        nuvem2.y,
        nuvem2.width,
        nuvem2.height
    );
    ctx.font = "30px 'Silkscreen'";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Fim de Jogo!", game.width / 2, game.height / 2 - 40);
    ctx.fillStyle = "black";
    ctx.font = "20px 'Silkscreen'";
    ctx.fillText("Pontuação: " + score, game.width / 2, game.height / 2 + 20);
    ctx.fillText("Pressione R para reiniciar", game.width / 2, game.height / 2 - 5);

    pararMusica();
}

// --- EVENTOS DE TECLADO ---
window.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
        case "arrowup": case "w": keys.up = true; break;
        case "arrowdown": case "s": keys.down = true; break;
        case "arrowleft": case "a": keys.left = true; break;
        case "arrowright": case "d": keys.right = true; break;

        case "enter":
            if (game.state === "start") {
                game.state = "game";
                temporizador();
                iniciarAnimacoesCarros();
                music.play();
            }
            break;

        case "r":
            if (game.state === "end") {
                reiniciarJogo();
            }
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key.toLowerCase()) {
        case "arrowup": case "w": keys.up = false; break;
        case "arrowdown": case "s": keys.down = false; break;
        case "arrowleft": case "a": keys.left = false; break;
        case "arrowright": case "d": keys.right = false; break;
    }
});

// DESENHA O JOGO
function draw() {
    // LIMPA A TELA
    ctx.clearRect(0, 0, game.width, game.height); 

     if (game.state === "start") {
        desenharTelaStart();
        return;
    }

    if (game.state === "end") {
        desenharTelaFim();
        return;
    }

    if (player.dead) {
        game.state = "end";
        return;
    }

    // DESENHAR O MAPA
    desenharMapa();

    // CHECA COLISÃO DO PLAYER COM O LIXO
    if (checarColisao(player, trash)) {
        player.with_trash = true;

         // APAGA O LIXO
        trash.x = -100;
        trash.y = -100;

        //evita tocar infinitamente... 
        if (!audioPlayed) {
            const audio = new Audio('./music/collect.mp3');
            audio.play();
            audioPlayed = true;
        }
    }

    // DESENHA O LIXO
    ctx.drawImage(trash_spr, trash.x, trash.y, trash.width, trash.height);

    // CHECA COLISÃO DO PLAYER COM A LIXEIRA E REPOSICIONA O LIXO
    if (player.with_trash) {
        if (checarColisao(player, bin)) {
            player.with_trash = false;
            
            // REPOSICIONA O LIXO
            trash.x = Math.random() * (game.width - trash.width);
            trash.y = Math.random() * (game.height - trash.height);

            // ADICIONA A PONTUAÇÃO
            score++;

            // ADICIONA O TEMPO
            if (timeCheck > 5) {
                timeCheck--;
            }
            time = timeCheck;

            //evita tocar infinitamente... 
            if (audioPlayed) {
                const audio = new Audio('./music/collect2.wav');
                audio.play();
                audioPlayed = true;
            }

            document.querySelector("#time").innerHTML = time;
            document.querySelector("#score").innerHTML = score;
            audioPlayed = false;
        }
    }
    // DESENHA A LIXEIRA
    ctx.drawImage (
        bin_spr,
        bin.spr_x, bin.spr_y,                    // dx, dy: onde desenhar no canvas
        bin.spr_width, bin.spr_height            // dw, dh: tamanho final no canvas
    );

    // DESENHA O PLAYER
    ctx.drawImage (
        player_spr,
        currentFrame * spriteWidth,            // sx:  recorte linha
        currentRow * spriteHeight,             // sy:  recorte coluna
        spriteWidth, spriteHeight,             // sw, sh: tamanho do recorte
        player.spr_x, player.spr_y,                    // dx, dy: onde desenhar no canvas
        player.spr_width, player.spr_height            // dw, dh: tamanho final no canvas
    );

    // DESENHA O CARRO 1
    ctx.drawImage (
        carro_spr,
        carro1_currentFrame * carro_spriteWidth,            // sx:  recorte linha
        carro1_currentRow * carro_spriteHeight,             // sy:  recorte coluna
        carro_spriteWidth, carro_spriteHeight,             // sw, sh: tamanho do recorte
        carro1.x, carro1.spr_y,                    // dx, dy: onde desenhar no canvas
        carro1.spr_width, carro1.spr_height            // dw, dh: tamanho final no canvas
    );

    // DESENHA O CARRO 2
    ctx.drawImage (
        carroN_spr,
        carro2_currentFrame * carro_spriteWidth,            // sx:  recorte linha
        carro2_currentRow * carro_spriteHeight,             // sy:  recorte coluna
        carro_spriteWidth, carro_spriteHeight,             // sw, sh: tamanho do recorte
        carro2.x, carro2.spr_y,                    // dx, dy: onde desenhar no canvas
        carro2.spr_width, carro2.spr_height            // dw, dh: tamanho final no canvas
    );

    
    // === QUADRADOS DE COLISÃO ===

    // // PLAYER (vermelho)
    // ctx.strokeStyle = "red";
    // ctx.strokeRect(player.x, player.y, player.width, player.height);

    // // CARRO 1 (azul)
    // ctx.strokeStyle = "blue";
    // ctx.strokeRect(carro1.x, carro1.y, carro1.width, carro1.height);

    // // CARRO 2 (green)
    // ctx.strokeStyle = "green";
    // ctx.strokeRect(carro2.x, carro2.y, carro2.width, carro2.height);

    // // Contorno do LIXO
    // ctx.strokeStyle = "yellow";
    // ctx.strokeRect(trash.x, trash.y, trash.width, trash.height);

    // // Contorno da LIXEIRA
    // ctx.strokeStyle = "purple";
    // ctx.strokeRect(bin.x, bin.y, bin.width, bin.height);

    // ATUALIZA O DESENHO
    anim = requestAnimationFrame(draw);
}
    
// MOVE O PLAYER
function move() {
  let isMoving = false;

   if (keys.up && player.y > 0) {
        player.y -= player.speed
        player.spr_y -= player.speed;
        currentRow = 1;
        isMoving = true;
    };

    if (keys.down && player.y + player.height < game.height) {
        player.y += player.speed
        player.spr_y += player.speed;
        currentRow = 0;
        isMoving = true;
    };

    if (keys.left && player.x > 0) {
        player.x -= player.speed
        player.spr_x -= player.speed;
        currentRow = 2; // ajuste se quiser mudar linha para esquerda
        isMoving = true;
    };

    if (keys.right && player.x + player.width < game.width) {
        player.x += player.speed
        player.spr_x += player.speed;
        currentRow = 3; // ajuste se quiser mudar linha para direita
        isMoving = true;
    };

    if (isMoving) {
        animationTimer++;
        if (animationTimer > 10) {  // Ajuste o valor para velocidade da animação
            animationTimer = 0;
            currentFrame++;
            if (currentFrame > 3) {
                currentFrame = 0;
            }
        }
    } else {
        currentFrame = 0;  // player parado, animação resetada
        animationTimer = 0;
    }

    // COLISÃO COM PAREDES
    if (player.x < 0) {
        player.x = 0 
        player.spr_x = 0
    };

    if (player.y < 0) {
        player.y = 0
        player.spr_y = player.y- 20
    };

    if (player.x + player.width > game.width) {
        player.x = game.width - player.width
        player.spr_x = player.x
    };

    if (player.y + player.height > game.height) {
         player.y = game.height - player.height;
         player.spr_y = player.y - 20
    }

    // COLISÃO CARRO 1
    if (checarColisao(player, carro1)) {
        player.dead = true;
        
        if (!deathAudioPlayed) {
            const audio = new Audio('./music/wrong.mp3'); // Mesmo som do lixo (ou troque o arquivo)
            audio.play();
            deathAudioPlayed = true;
        }
    }

    // COLISÃO COM CARRO 2
    if (checarColisao(player, carro2)) {
        player.dead = true;

        if (!deathAudioPlayed) {
            const audio = new Audio('./music/wrong.mp3'); // Mesmo som do lixo (ou troque o arquivo)
            audio.play();
            deathAudioPlayed = true;
        }
    }

     // mover carros
    moverCarro(carro1);
    moverCarro(carro2);

    draw();      
    requestAnimationFrame(move);                         
}

requestAnimationFrame(move);
