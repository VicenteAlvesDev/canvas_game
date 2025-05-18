
// CANVAS E CONTEXTO
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

// PONTUAÇÃO E TEMPO
let score = parseInt(document.querySelector("#score").innerHTML);
let time = parseInt(document.querySelector("#time").innerHTML);
let timeCheck = 30;

// SPRITES
let player_spr = new Image();
player_spr.src = "assets/player.png";

let currentFrame = 0; // Quadro atual da animação
let currentRow = 0;

let totalFrames = 4; // Total de quadros na spritesheet

let spriteWidth = 1334 / totalFrames; // Largura de um frame da spritesheet
let spriteHeight = 1997 / totalFrames; // Altura do frame (supondo uma linha só)

setInterval(() => {
    currentFrame++

    if (currentFrame > 3) {
        currentFrame = 0;
    }
}, 200); 



// let trash_spr = new Image();
// trash_spr.src = "assets/trash.png";
// let bin_spr = new Image();
// bin_spr.src = "assets/bin.png";

// JOGO
let game = {
    width: 800,
    height: 600,
    state : "start"
};

// PLAYER
let player = {
    x: 100,
    y: 300,
    width: 50,
    height: 75,
    speed: 5,
    with_trash: false,
    dead: false
};

// CONTROLES
let keys = {
    up: false, 
    down: false,
    left: false, 
    right: false
};

// COLETÁVEL / LIXO
let trash = {
    x: Math.random() * game.width,
    y: Math.random() * game.height,
    radius: 25, // Tamanho do circulo
    startAngle: 0,
    endAngle: Math.PI * 2,
    anticlockwise: true,
}

// LIXEIRA
let bin  = {
    x: 100,
    y: 450,
    width: 50,
    height: 50
}
function temporizador() {
    setInterval(function () {
        time--;
        document.querySelector("#time").innerHTML = time;

        if (time <= 0) {
            game.state = "end";
            time = 1;
        }
    }, 1000);
}

// EVENTOS DAS TECLAS
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") keys.up = true;
    if (e.key === "ArrowDown")  keys.down = true;
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;

    // BOTÃO DE INICIAR
    if (e.key === "Enter" && game.state === "start") {
        game.state = "game"
        temporizador();
    } else if (game.state === "end") {
        player.x = 100;
        player.y = 300;
        player.with_trash = false;
        player.dead = false;
        score = 0;
        time = 30;
        timeCheck = 30;
        trash.endAngle = Math.PI * 2;
        document.querySelector("#score").innerHTML = score;
        document.querySelector("#time").innerHTML = time;
        game.state = "start";
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp") keys.up = false;
    if (e.key === "ArrowDown") keys.down = false;
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
});

// DESENHA O JOGO
function draw() {
    // LIMPA A TELA
    ctx.clearRect(0, 0, game.width, game.height); 

     if (game.state === "start") {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("Pressione Enter para começar", game.width / 2, game.height / 2);
        return;
    }

    if (game.state === "end") {
        ctx.font = "30px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText("Fim de Jogo!", game.width / 2, game.height / 2 - 20);
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Pontuação: " + score, game.width / 2, game.height / 2 + 20);
        return;
    }

    // MAPA
    // Grama
    // ctx.fillStyle = "green"; 
    // ctx.fillRect(0, 0, game.width, 75);

    // Calçada de azulejo
    // ctx.fillStyle = "darkgray"; 
    // ctx.fillRect(0, 75, game.width, 75);

    // Pista
    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 150, game.width, 75);

    // Pista
    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 225, game.width, 75);

    // Pista
    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 300, game.width, 75);

    // Pista
    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 375, game.width, 75);

    // Calçada de azulejo
    // ctx.fillStyle = "darkgray"; 
    // ctx.fillRect(0, 450, game.width, 75);

    // Grama
    // ctx.fillStyle = "green"; 
    // ctx.fillRect(0, 525, game.width, 75);

    // CHECA COLISÃO E REPOSICIONA O LIXO
    if (trash.x < player.x + player.width && trash.x + trash.radius > player.x && trash.y < player.y + player.height && trash.y + trash.radius > player.y) {
        player.with_trash = true;

        // APAGA O LIXO
        trash.endAngle = 0;
    }

    // COR E DESENHO DO LIXO
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(trash.x, trash.y, trash.radius, trash.startAngle, trash.endAngle, trash.anticlockwise);
    ctx.fill();

    // CHECA COLISÃO E REPOSICIONA O LIXO
    if (player.with_trash) {
        if (bin.x < player.x + player.width && bin.x + bin.width > player.x && bin.y < player.y + player.height && bin.y + bin.height > player.y) {
            player.with_trash = false;

            // TRAZ O LIXO DEVOLTA
            trash.endAngle = Math.PI * 2;
            
            // REPOSICIONA O LIXO
            trash.x = Math.random() * game.width;
            trash.y = Math.random() * game.height;

            // ADICIONA A PONTUAÇÃO
            score++;

            // ADICIONA O TEMPO
            if (timeCheck > 5) {
                timeCheck--;
            }
            time = timeCheck;

            document.querySelector("#time").innerHTML = time;
            document.querySelector("#score").innerHTML = score;
        }
    }

    // COR E DESENHO DA LIXEIRA
    ctx.fillStyle = "red";
    ctx.fillRect(bin.x, bin.y, bin.width, bin.height);

    // COR E DESENHO DO PLAYER
    // ctx.fillStyle = "black"; 
    // ctx.fillRect(player.x, player.y, player.width, player.height);

    // DESENHA O PLAYER
    ctx.drawImage (
        player_spr,
        currentFrame * spriteWidth,            // sx:  recorte linha
        currentRow * spriteHeight,             // sy:  recorte coluna
        spriteWidth, spriteHeight,             // sw, sh: tamanho do recorte
        player.x, player.y,                    // dx, dy: onde desenhar no canvas
        player.width, player.height            // dw, dh: tamanho final no canvas
    );

    // ATUALIZA O DESENHO
    anim = requestAnimationFrame(draw);
}
    
// MOVE O PLAYER
function move() {

    // CHECA SE O JOGO ESTÁ EM EXECUÇÃO PARA MOVIMENTAR O PLAYER
    if (keys.up) {
        player.y -= player.speed;
        currentRow = 1; // Linha da sprite para cima
    }

    if (keys.down) {
        player.y += player.speed;
        currentRow = 0; // Linha da sprite para baixo
    }

    if (keys.left) {
        player.x -= player.speed;
        currentRow = 2; // Linha da sprite para esquerda
    }

    if (keys.right) {
        player.x += player.speed;
        currentRow = 3; // Linha da sprite para direita
    }

    // COLISÃO COM PAREDES
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > game.width) player.x = game.width - player.width;
    if (player.y + player.height > game.height) player.y = game.height - player.height;

    draw();                               
    requestAnimationFrame(move);
}

requestAnimationFrame(move); 