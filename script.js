
// CANVAS E CONTEXTO
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

// PONTUAÇÃO
let score = document.querySelector("#score").innerHTML;

// JOGO
let game = {
    width: 800,
    height: 600
};

// PLAYER
let player = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
};

let sprite = new Image();
sprite.src = "./assets/Prototype_Character.png";


sprite.onload = () => {
    ctx.drawImage(sprite, player.x, player.y);
}


// CONTROLES
let keys = {
    up: false, 
    down: false,
    left: false, 
    right: false
};

// I dont know what o put there
let trash = {
    x: Math.random() * game.width,
    y: Math.random() * game.height,
    radius: 25, // Tamanho do circulo
    startAngle: 0,
    endAngle: Math.PI * 2,
    anticlockwise: true,
}

// EVENTOS DAS TECLAS
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") keys.up = true;
    if (e.key === "ArrowDown")  keys.down = true;
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
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
    
    // COR E DESENHO DO PLAYER
    ctx.fillStyle = "black"; 
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // MAPA
    // ctx.fillStyle = "green"; 
    // ctx.fillRect(0, 0, game.width, 75);

    // ctx.fillStyle = "darkgray"; 
    // ctx.fillRect(0, 75, game.width, 75);

    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 150, game.width, 75);

    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 225, game.width, 75);

    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 300, game.width, 75);

    // ctx.fillStyle = "gray"; 
    // ctx.fillRect(0, 375, game.width, 75);

    // ctx.fillStyle = "darkgray"; 
    // ctx.fillRect(0, 450, game.width, 75);

    // ctx.fillStyle = "green"; 
    // ctx.fillRect(0, 525, game.width, 75);

    // CHECA COLISÃO E REPOSICIONA O LIXO
    if (trash.x < player.x + player.width && trash.x + trash.radius > player.x && trash.y < player.y + player.height && trash.y + trash.radius > player.y) {
        trash.x = Math.random() * game.width;
        trash.y = Math.random() * game.height;

        // ADICIONA A PONTUAÇÃO
        score++;
        document.querySelector("#score").innerHTML = score;
    }

    // COR E DESENHO DO LIXO
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(trash.x, trash.y, trash.radius, trash.startAngle, trash.endAngle, trash.anticlockwise);
    ctx.fill();

    // ATUALIZA O DESENHO
    anim = requestAnimationFrame(draw);
}

// MOVE O PLAYER
function move() {
    if (keys.up) player.y -= player.speed;
    if (keys.down) player.y += player.speed;
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;

    // COLISÃO COM PAREDES
    if (player.x < 0) player.x = 0;
    if (player.y < 0) player.y = 0;
    if (player.x + player.width > game.width) player.x = game.width - player.width;
    if (player.y + player.height > game.height) player.y = game.height - player.height;

    draw();                               
    requestAnimationFrame(move);
}

requestAnimationFrame(move); 