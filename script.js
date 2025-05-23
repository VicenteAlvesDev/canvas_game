
// CANVAS E CONTEXTO
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

// PONTUAÇÃO E TEMPO
let score = parseInt(document.querySelector("#score").innerHTML);
let time = parseInt(document.querySelector("#time").innerHTML);
let timeCheck = 30;

// SPRITE PLAYER
let player_spr = new Image();
player_spr.src = "assets/player.png";

let animationTimer = 0; // contador de tempo para troca de frame

let currentFrame = 0; // Quadro atual da animação
let currentRow = 0;

let totalFrames = 4; // Total de quadros na spritesheet

let spriteWidth = 1334 / totalFrames; // Largura de um frame da spritesheet
let spriteHeight = 1997 / totalFrames; // Altura do frame (supondo uma linha só)

//SPRITE CARRO
let carroSpr = new Image();
carroSpr.src = "./assets/truck.png";

let carro1_currentFrame = 0; // Quadro atual da animação
let carro1_currentRow = 2;

let carro2_currentFrame = 0; // Quadro atual da animação
let carro2_currentRow = 1;

let carro_spriteWidth = 376 / totalFrames; // Largura de um frame da spritesheet
let carro_spriteHeight = 348 / totalFrames; // Altura do frame (supondo uma linha só)


setInterval(() => {
    carro1_currentFrame++

    if (carro1_currentFrame > 3) {
        carro1_currentFrame = 0;
    }
}, 200); 


setInterval(() => {
    carro2_currentFrame++

    if (carro2_currentFrame > 3) {
        carro2_currentFrame = 0;
    }
}, 200); 

// SPRITE COLETÁVEL/LIXO
let trash_spr = new Image();
trash_spr.src = "assets/trash.png";

// SPRITE LIXEIRA
let bin_spr = new Image();
bin_spr.src = "assets/bin.png";

// JOGO
let game = {
    width: 800,
    height: 600,
    state : "start"
};

// PLAYER
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

// CONTROLES
let keys = {
    up: false, 
    down: false,
    left: false, 
    right: false,
};

// COLETÁVEL / LIXO
let trash = {
    x: Math.random() * game.width,
    y: Math.random() * game.height,
    width: 50,
    height: 50
}

// LIXEIRA
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

// CARRO 1  
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

// CARRO 2
let carro2 = {
    x: 520,
    y: 340,
    width: 94 * 1.5,
    height: 87 * 1.1,
    speed: -3,

    spr_x: 520,
    spr_y: 320,
    spr_width: 94 * 1.5,
    spr_height: 87 * 1.5
};


// funcao para mover os carros
function moverCarro(carro) {
    carro.x += carro.speed; // muda posicao x do carro

    // se sair da tela pela direita, volta pra esquerda
    if (carro.speed > 0 && carro.x > canvas.width) {
        carro.x = -carro.width;
    }

    // se sair da tela pela esquerda, volta pra direita
    if (carro.speed < 0 && carro.x + carro.width < 0) {
        carro.x = canvas.width;
    }
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
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = true;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S")  keys.down = true;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = true;

    // BOTÃO DE INICIAR
    if (e.key === "Enter" && game.state === "start") {
        game.state = "game"
        temporizador();
    } 
    
    if ((e.key === "R" || e.key === "r") && game.state === "end") {
        player.x = 400,
        player.y = 450,
        player.with_trash = false;
        player.dead = false;
        score = 0;
        time = 30;
        timeCheck = 30;
        // trash.endAngle = Math.PI * 2;
        document.querySelector("#score").innerHTML = score;
        document.querySelector("#time").innerHTML = time;
        game.state = "start";
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") keys.up = false;
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") keys.down = false;
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keys.right = false;
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
        ctx.fillText("Pontuação: " + score, game.width / 2, game.height / 2 + 40);
        ctx.fillText("Pressione R para reiniciar", game.width / 2, game.height / 2 + 10);
        return;
    }

    if (player.dead) {
        game.state = "end";
        return;
    }

    // MAPA
    ctx.fillStyle = "green"; 
    ctx.fillRect(0, 0, game.width, 75);

    // Calçada de azulejo
    ctx.fillStyle = "darkgray"; 
    ctx.fillRect(0, 75, game.width, 75);

    // Pista
    ctx.fillStyle = "gray"; 
    ctx.fillRect(0, 150, game.width, 75);

    // Pista
    ctx.fillStyle = "gray"; 
    ctx.fillRect(0, 225, game.width, 75);

    // Pista
    ctx.fillStyle = "gray"; 
    ctx.fillRect(0, 300, game.width, 75);

    // Pista
    ctx.fillStyle = "gray"; 
    ctx.fillRect(0, 375, game.width, 75);

    // Calçada de azulejo
    ctx.fillStyle = "darkgray"; 
    ctx.fillRect(0, 450, game.width, 75);

    // Grama
    ctx.fillStyle = "green"; 
    ctx.fillRect(0, 525, game.width, 75);


    // CHECA COLISÃO E REPOSICIONA O LIXO
    if (trash.x < player.x + player.width && trash.x + trash.width > player.x && trash.y < player.y + player.height && trash.y + trash.height > player.y) {
        player.with_trash = true;

        // APAGA O LIXO
        trash.width = 0;
        trash.height = 0
    }

    // DESENHA O LIXO
    ctx.drawImage(trash_spr, trash.x, trash.y, trash.width, trash.height);
    // ctx.fillStyle = "green";
    // ctx.beginPath();
    // ctx.arc(trash.x, trash.y, trash.radius, trash.startAngle, trash.endAngle, trash.anticlockwise);
    // ctx.fill();

    // CHECA COLISÃO E REPOSICIONA O LIXO
    if (player.with_trash) {
        if (bin.x < player.x + player.width && bin.x + bin.width > player.x && bin.y < player.y + player.height && bin.y + bin.height > player.y) {
            player.with_trash = false;

            // TRAZ O LIXO DEVOLTA
            trash.width = 50;
            trash.height = 50
            
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
    // ctx.fillStyle = "red";
    // ctx.fillRect(bin.x, bin.y, bin.width, bin.height);

    // DESENHA A LIXEIRA
    ctx.drawImage (
        bin_spr,
        bin.spr_x, bin.spr_y,                    // dx, dy: onde desenhar no canvas
        bin.spr_width, bin.spr_height            // dw, dh: tamanho final no canvas
    );

    // COR E DESENHO DO PLAYER
    // ctx.fillStyle = "black"; 
    // ctx.fillRect(player.x, player.y, player.width, player.height);

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
        carroSpr,
        carro1_currentFrame * carro_spriteWidth,            // sx:  recorte linha
        carro1_currentRow * carro_spriteHeight,             // sy:  recorte coluna
        carro_spriteWidth, carro_spriteHeight,             // sw, sh: tamanho do recorte
        carro1.x, carro1.spr_y,                    // dx, dy: onde desenhar no canvas
        carro1.spr_width, carro1.spr_height            // dw, dh: tamanho final no canvas
    );

    // DESENHA O CARRO 2
    ctx.drawImage (
        carroSpr,
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

    if (keys.up) {
        player.y -= player.speed;
        player.spr_y -= player.speed;
        currentRow = 1;
        isMoving = true;
    }

    if (keys.down) {
        player.y += player.speed;
        player.spr_y += player.speed;
        currentRow = 0;
        isMoving = true;
    }

    if (keys.left) {
        player.x -= player.speed;
        player.spr_x -= player.speed;
        currentRow = 2; // ajuste se quiser mudar linha para esquerda
        isMoving = true;
    }

    if (keys.right) {
        player.x += player.speed;
        player.spr_x += player.speed;
        currentRow = 3; // ajuste se quiser mudar linha para direita
        isMoving = true;
    }

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
    if (
        player.x < carro1.x + carro1.width &&
        player.x + player.width > carro1.x &&
        player.y < carro1.y + carro1.height &&
        player.y + player.height > carro1.y
    ) {
        player.dead = true;
    }

    // COLISÃO COM CARRO 2
    if (
        player.x < carro2.x + carro2.width &&
        player.x + player.width > carro2.x &&
        player.y < carro2.y + carro2.height &&
        player.y + player.height > carro2.y
    ) {
        player.dead = true;
    }

     // mover carros
      moverCarro(carro1);
      moverCarro(carro2);

    draw();                               
    requestAnimationFrame(move);
}

requestAnimationFrame(move); 