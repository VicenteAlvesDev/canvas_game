
// =====================
// SETUP
// =====================

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

let recycled = parseInt(document.querySelector("#trash").innerHTML);
let difficultyLevel = parseInt(document.querySelector("#difficult").innerHTML);

let loadingScreen = document.getElementById("loading-screen");
let loadingTitle = document.getElementById("loading-title");
let loadingBar = document.getElementById("loading-bar");
let loadingBarContainer = document.getElementById("loading-bar-container");
let loadingStatus = document.getElementById("loading-status");

// modal
const modal = document.getElementById("nameModal");
const inputName = document.getElementById("playerNameInput");
const btnConfirm = document.getElementById("confirmNameBtn");

// Evita que teclas do jogo acionem a rolagem da página
document.addEventListener("keydown", function(e) {

    if (document.activeElement === inputName) {
        return;
    }
    
    const teclas = ["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD"];

    if (teclas.includes(e.code)) {
        e.preventDefault();
    }
});

// =====================
// AUDIO
// =====================

let currentMusic = null;

let startMusic = new Audio("../assets/sfx/music/music_start.mp3");
startMusic.loop = true;

let gameMusic = new Audio("../assets/sfx/music/music_game.mp3");
gameMusic.loop = true;

let endMusic = new Audio("../assets/sfx/music/music_end.wav");
let sfxCollect = new Audio("../assets/sfx/snd_collect.wav");
let sfxDiscart = new Audio("../assets/sfx/snd_deposite.wav");
let sfxDash =  new Audio("../assets/sfx/snd_dash.mp3")


// Volume Músicas
startMusic.volume = 0.3;
gameMusic.volume = 0.45;
endMusic.volume = 0.55;

// Volume SFX
sfxCollect.volume = 0.9;
sfxDiscart.volume = 0.3;
sfxDash.volume = 0.3;

function playMusic(music) {
    if (currentMusic !== music) {
        if (currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }
        currentMusic = music;
        currentMusic.play();
    }
}

// =====================
// INPUT
// =====================

let keys = {}
window.addEventListener("keydown", (event) => {
    keys[event.key.toLowerCase()] = true;
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});

// =====================
// MAPA
// =====================

let tileSize = 85.71428571428571;

let map = [
  ["g2","g","g1","g","g2","g1","g1","g","g2","g1","g"], 
  ["w","w","w","w","w","w","w","w","w","w","w"],
  ["s","s","s","s","s","s","s","s","s","s","s"],
  ["m","m","m","m","m","m","m","m","m","m","m"],
  ["e","e","e","e","e","e","e","e","e","e","e"],
  ["w","w","w","w","w","w","w","w","w","w","w"],
  ["g","g1","g2","g2","g1","g","g2","g","g1","g1","g"]  
];

const tileImgs = {
  g: new Image(),
  g1: new Image(),
  g2: new Image(),
  w: new Image(),
  s: new Image(),
  m: new Image(),
  e: new Image(),
};

tileImgs.g.src = "../assets/spr/background/spr_grass.png";
tileImgs.g1.src = "../assets/spr/background/spr_grass1.png";
tileImgs.g2.src = "../assets/spr/background/spr_grass2.png";
tileImgs.w.src = "../assets/spr/background/spr_walkroad.png";
tileImgs.s.src = "../assets/spr/background/spr_street_start.png";
tileImgs.m.src = "../assets/spr/background/spr_street_mid.png";
tileImgs.e.src = "../assets/spr/background/spr_street_end.png";

function drawMap() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let tileType = map[y][x];           
      let tileImage = tileImgs[tileType];
      ctx.drawImage(tileImage, x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

// =====================
// UTIL
// =====================

function collisionCheck(obj1, obj2, type = "normal") {
    if (type === "better") {
        return obj1.x + 10 < (obj2.x + 15) + obj2.width - 30 &&
               (obj1.x + 10) + (obj1.width - 20) > obj2.x + 15 &&
               obj1.y + 20 < (obj2.y + 30) + obj2.height - 70 &&
               (obj1.y + 20) + (obj1.height - 20) > obj2.y + 30;
    }

    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function drawHitbox(obj, color = "red") {
    if (obj == carro1 || obj == carro2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x + 15, obj.y + 30, obj.width - 30, obj.height - 70);
    } else if (obj == player) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x + 10, obj.y + 20, obj.width - 20, obj.height - 20);
    } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    }
}

function approach(val1, val2, amount) {
    if (val1 < val2) {
        val1 += amount
        if (val1 > val2) {
            return val2;
        }
    } else {
        val1 -= amount
        if (val1 < val2) {
            return val2;
        }
    }
    return val1;
}

function drawLayer(img, offset, speedFactor = 1) {
    let x = -(offset % canvas.width);

    ctx.drawImage(img, x, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x + canvas.width, 0, canvas.width, canvas.height);
}

function showTip() {
    let tipText = tips.phrases[Math.floor(Math.random() * tips.phrases.length)];

    tips.active = {
        text: tipText,
        x: player.x + player.width + 10,
        y: player.y - 20,
        tempo: 240,
        opacity: 1
    };
}

// =====================
// ENTIDADES
// =====================

let game = {
    width: 800,
    height: 600,
    gravity: 0.5,
    state: "loading",
    progress: 0,
    version: 3.0
};

let menu = {
    selected: 0,
    options: ["INICIAR", "PERSONALIZAÇÃO"],
    canMove: true,
    canPressStart: true,
};

let bgOffset = {
    sky: 0,
    far: 0,
    mid: 0,
    front: 0
};

let tips = {
    active: null,
    timer: 0,
    shakeAmount: 0,
    lastRycledCount: 0,
    phrases: [
        "Descartar lixo no chão fere o direito de todos a um espaço limpo.",
        "A coleta seletiva depende da participação consciente da comunidade.",
        "O espaço público é de todos. Cuidar dele é um ato de cidadania.",
        "Jogar lixo no chão não é liberdade - é falta de respeito com quem vive ao lado.",
        "Cada lata no chão é um direito à saúde que alguém perde.",
        "O lixeiro não faz milagres: ele depende da sua consciência.",
        "Democracia também é decidir, em conjunto, manter a cidade limpa.",
        "Reciclar é um voto pelo futuro coletivo.",
        "Uma comunidade limpa nasce da soma de pequenas escolhas.",
        "Não espere o poder público fazer tudo. Sua ação importa."
    ]
}

let player = {
    name: "Sr Cidadão",
    x: 350,
    y: 430,
    z: 0,
    vz: 0,
    width: 50,
    height: 50,
    speed: 4,
    isMoving: false,
    isJumping: false,
    isDashing: false,
    withTrash: false,
    currentFrame: 0, // Quadro atual da animação
    currentRow: 5,
    spriteWidth: 1280 / 4, // Largura de um frame da spritesheet
    spriteHeight: 2560 / 8, // Altura do frame 
    animCounter: 0, // Tempo da Animação
    dashForce: 6,
    dashTime: 0,
    dashDistance: 10,
    dashCooldown: 0,
    dashCooldownMax: 30 // 60 frames (~1 segundo se for 60 FPS)
};

let name = {
    x: 350,
    y: 430 + 50,
};

let shadow = {
    x: 350,
    y: 430,
    width: 50,
    height: 20,
};

let trash = {
    x: Math.random() * (game.width - 50),
    y: Math.random() * (game.height - 50),
    width: 50,
    height: 50,
}

let bin  = {
    x: 40,
    y: 420,
    width: 80,
    height: 80,
}

let carro1 = {
    x: -200,
    y: 160,
    width: 94 * 1.5, 
    height: 87 * 1.5, 
    speed: 3,
    currentFrame: 0, // Quadro atual da animação
    currentRow: 2,
    spriteWidth: 376 / 4, // Largura de um frame da spritesheet
    spriteHeight: 348 / 4, // Altura do frame (supondo uma linha só)
    animCounterCarro: 0, // Tempo da Animação
};

let carro2 = {
    x: 800,
    y: 290,
    width: 94 * 1.5,
    height: 87 * 1.5,
    speed: 3,
    currentFrame: 0, // Quadro atual da animação
    currentRow: 1,
    spriteWidth: 376 / 4, // Largura de um frame da spritesheet
    spriteHeight: 348 / 4, // Altura do frame (supondo uma linha só)
    animCounterCarro: 0, // Tempo da Animação
};

// =====================
// SPRITES / ANIMAÇÃO
// =====================

let player_spr = new Image();
player_spr.src = "../assets/spr/spr_player.png";

let shadow_spr = new Image();
shadow_spr.src = "../assets/spr/spr_shadow.png";

let trash_spr = new Image();
trash_spr.src = "../assets/spr/spr_trash.png";

let bin_spr = new Image();
bin_spr.src = "../assets/spr/spr_bin.png";

let carro_spr = new Image();
carro_spr.src = "../assets/spr/spr_truck_white.png";

let carro2_spr = new Image();
carro2_spr.src = "../assets/spr/spr_truck_black.png";

let bg_sky = new Image();
bg_sky.src = "../assets/spr/background/sky.png";

let bg_far = new Image();
bg_far.src = "../assets/spr/background/far.png";

let bg_mid = new Image();
bg_mid.src = "../assets/spr/background/mid.png";

let bg_front = new Image();
bg_front.src = "../assets/spr/background/front.png";

// =====================
// DRAW (RENDER)
// =====================

function drawPlayer() {
    ctx.drawImage (
        player_spr,
        player.currentFrame * player.spriteWidth,            
        player.currentRow * player.spriteHeight,
        player.spriteWidth, 
        player.spriteHeight,             
        player.x, 
        player.y - player.z,                    
        player.width, 
        player.height
    );
}

function drawName() {

    if (tips.active) return;
    
    ctx.font = "bold 14px 'Pixelify Sans', monospace";

    ctx.lineWidth = 3;              // espessura da borda
    ctx.strokeStyle = "#000";       // cor da borda (preto)

    ctx.strokeText(player.name, name.x, name.y); // desenha a borda
    ctx.fillStyle = "#fff";         // cor do texto
    ctx.fillText(player.name, name.x, name.y);   // preenche o texto
    ctx.textAlign = "center";
}

function drawShadow() {
    ctx.save(); // guarda o estado atual
    ctx.globalAlpha = 0.3; // transparência (ajusta aqui: 0.2, 0.25, 0.3...)

    ctx.drawImage(
        shadow_spr,
        shadow.x,
        shadow.y,
        shadow.width,
        shadow.height
    );

    ctx.restore(); // volta ao normal
}

function drawTrash() {
    ctx.drawImage(trash_spr, trash.x, trash.y, trash.width, trash.height);
}

function drawBin() {
    ctx.drawImage(bin_spr, bin.x, bin.y, bin.width, bin.height);
}

function drawCar() {
    ctx.drawImage(
        carro_spr,
        carro1.currentFrame * carro1.spriteWidth,
        carro1.currentRow * carro1.spriteHeight,
        carro1.spriteWidth, 
        carro1.spriteHeight,
        carro1.x, 
        carro1.y,
        carro1.width, 
        carro1.height
    );
}

function drawCar2() {
    ctx.drawImage(
        carro2_spr,
        carro2.currentFrame * carro2.spriteWidth,
        carro2.currentRow * carro2.spriteHeight,
        carro2.spriteWidth,
        carro2.spriteHeight,
        carro2.x, 
        carro2.y,
        carro2.width, 
        carro2.height
    );
}

function drawTips() {
    if (!tips.active) return;

    // Atualiza posição da dica para acompanhar o player
    tips.active.x = player.x + player.width + 10;
    tips.active.y = player.y - 20 - (60 - tips.active.tempo) * 0.5; // Sobe lentamente
    
    // Esmaece com o tempo
    tips.active.opacity = tips.active.tempo / 60;
    
    ctx.save();
    
    // Aplica shake se houver
    if (tips.shakeAmount > 0) {
        const shakeX = (Math.random() - 0.5) * tips.shakeAmount;
        const shakeY = (Math.random() - 0.5) * tips.shakeAmount;
        ctx.translate(shakeX, shakeY);
    }
    
    // CONFIGURAÇÕES DO TEXTO
    ctx.font = "bold 14px 'Pixelify Sans', monospace";
    
    // QUEBRA DE LINHA AUTOMÁTICA
    const maxWidth = 250;
    const palavras = tips.active.text.split(' ');
    const linhas = [];
    let linhaAtual = '';
    
    for (let i = 0; i < palavras.length; i++) {
        const testeLinha = linhaAtual ? linhaAtual + ' ' + palavras[i] : palavras[i];
        const metrics = ctx.measureText(testeLinha);
        
        if (metrics.width > maxWidth && linhaAtual.length > 0) {
            linhas.push(linhaAtual);
            linhaAtual = palavras[i];
        } else {
            linhaAtual = testeLinha;
        }
    }
    linhas.push(linhaAtual);
    
    const lineHeight = 20;
    
    // Sombra
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // DESENHA TEXTO
    for (let i = 0; i < linhas.length; i++) {
        ctx.fillStyle = `rgba(255, 220, 50, ${tips.active.opacity})`;
        ctx.fillText(
            linhas[i],
            tips.active.x,
            tips.active.y - (linhas.length - i - 1) * lineHeight
        );
    }
    
    ctx.restore();
    
    // Timer
    tips.active.tempo--;
    if (tips.active.tempo <= 0) {
        tips.active = null;
    }
}

// =====================
// GAME STATES
// =====================
function loading_loop() {
    let displayProgress = Math.floor(game.progress).toString().slice(0, 2);

    game.progress = approach(game.progress, 100, 2);

    loadingBar.style.width = game.progress + "%";
    loadingStatus.textContent = "Carregando... " + displayProgress + "%";

    if (game.progress >= 100 && game.state == "loading") {  
        loadingStatus.textContent = "Clique com o Mouse para começar";
        loadingTitle.classList.add("remove");
        loadingBarContainer.classList.add("remove");

        game.state = "start";
        loadingScreen.classList.add("remove");
    }
}

function start_loop() {

    let gamepad = navigator.getGamepads()[0];

    let _Up = keys["arrowup"] || keys["w"] || (gamepad && gamepad.axes[1] < -0.5);
    let _Down = keys["arrowdown"] || keys["s"] || (gamepad && gamepad.axes[1] > 0.5);
    let _Start = keys["enter"] || (gamepad && gamepad.buttons[9].pressed);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "left";

    // Velocidades
    bgOffset.sky += 0.05;
    bgOffset.far += 0.2;
    bgOffset.mid += 0.5;
    bgOffset.front += 1;

    drawLayer(bg_sky, bgOffset.sky);
    drawLayer(bg_far, bgOffset.far);
    drawLayer(bg_mid, bgOffset.mid);
    drawLayer(bg_front, bgOffset.front);

    // Overlay Escuro
    let gradient = ctx.createLinearGradient(0, 0, canvas.width * 0.5, 0);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = "white";
    ctx.font = "20px 'Pixelify Sans'";
    ctx.fillText("COLETOR CIDADÃO", 60, 100);

    ctx.font = "64px 'Pixelify Sans'";
    ctx.fillText("RENOVADO", 60, 160);

    // Modal
    btnConfirm.addEventListener("click", () => {
        const valor = inputName.value.trim();

        if (valor !== "") {
            player.name = valor;
        }

        modal.style.display = "none";
    });

    function switchModal() {
        const modal = document.querySelector(".modal");
        const actualStyle = modal.style.display;

        if (actualStyle === "block") {
            modal.style.display = "none";
        } else {
            modal.style.display = "flex";
        }
    }

    // Menu - Só funciona se o modal NÃO estiver aberto
    if (modal.style.display !== "flex") {
        if (_Up && menu.canMove) {
            menu.selected--;
            menu.canMove = false;
        }

        if (_Down && menu.canMove) {
            menu.selected++;
            menu.canMove = false;
        }

        if (!_Up && !_Down) {
            menu.canMove = true;
        }
    }

    if (menu.selected < 0) menu.selected = menu.options.length - 1;
    if (menu.selected >= menu.options.length) menu.selected = 0;

    for (let i = 0; i < menu.options.length; i++) {
        if (i === menu.selected) {
            ctx.fillStyle = "yellow";
        } else {
            ctx.fillStyle = "white";
        }

        ctx.font = "28px 'Pixelify Sans'";
        ctx.fillText(menu.options[i], 60, 300 + i * 40);
    }

    if (_Start && menu.canPressStart && modal.style.display !== "flex") {
        menu.canPressStart = false;

        if (menu.selected === 0) {
            game.state = "gameplay";
        }
        if (menu.selected === 1) {
            switchModal();
        }
    }
        
    if (!_Start) {
        menu.canPressStart = true;
    }


}

// Atualiza a lógica do jogo
function canvas_update() {

    // Outros
    let gamepad = navigator.getGamepads()[0];
    player.isMoving = false;

    // Teclas
    let _Right = keys["arrowright"] || keys["d"] || (gamepad && (gamepad.axes[0] > 0.5 || gamepad.buttons[15].pressed));
    let _Left = keys["arrowleft"] || keys["a"] || (gamepad && (gamepad.axes[0] < -0.5 || gamepad.buttons[14].pressed));
    let _Down = keys["arrowdown"] || keys["s"] || (gamepad && (gamepad.axes[1] > 0.5 || gamepad.buttons[13].pressed));
    let _Up = keys["arrowup"] || keys["w"] || (gamepad && (gamepad.axes[1] < -0.5 || gamepad.buttons[12].pressed));
    let _Jump = keys[" "] || (gamepad && gamepad.buttons[0].pressed);
    let _Dash = keys["q"] || (gamepad && (gamepad.buttons[7].pressed));

    playMusic(gameMusic);

    // Movimentação do Player
    if (_Right && _Up) {
        player.x += player.speed;
        player.y -= player.speed;
        player.currentRow = 4;
        player.isMoving = true;
    }

    else if (_Right && _Down) {
        player.x += player.speed;
        player.y += player.speed;
        player.currentRow = 7;
        player.isMoving = true;
    }

    else if (_Left && _Up) {
        player.x -= player.speed;
        player.y -= player.speed;
        player.currentRow = 3;
        player.isMoving = true;
    }

    else if (_Left && _Down) {
        player.x -= player.speed;
        player.y += player.speed;
        player.currentRow = 6;
        player.isMoving = true;
    }

    else if (_Right) {
        player.x += player.speed;
        player.currentRow = 1;
        player.isMoving = true;
    }

    else if (_Left) {
        player.x -= player.speed;
        player.currentRow = 0;
        player.isMoving = true;
    }

    else if (_Down) {
        player.y += player.speed;
        player.currentRow = 5;
        player.isMoving = true;
    }

    else if (_Up) {
        player.y -= player.speed;
        player.currentRow = 2;
        player.isMoving = true;
    }

    if (_Jump && player.z === 0) {
        player.vz = 10;
        player.isJumping = true;
    }

    // gravidade
    player.vz -= game.gravity;
    player.z += player.vz;

    // chão
    if (player.z <= 0) {
        player.z = 0;
        player.vz = 0;
        player.isJumping = false;
    }

    if (_Dash && !player.isDashing && player.dashCooldown <= 0) {
        player.isDashing = true;
        sfxDash.currentTime = 0;
        sfxDash.play();
        player.dashTime = 0
        player.dashCooldown = player.dashCooldownMax;
    }

    if (player.isDashing == true) {
        let a = 0;
        let b = 0;

        // Direções diagonais
        if (player.currentRow === 4) { // direita + cima
            a += player.speed * 2;
            b -= player.speed * 2;
        }

        else if (player.currentRow === 7) { // direita + baixo
            a += player.speed * 2;
            b += player.speed * 2;
        }

        else if (player.currentRow === 3) { // esquerda + cima
            a -= player.speed * 2;
            b -= player.speed * 2;
        }

        else if (player.currentRow === 6) { // esquerda + baixo
            a -= player.speed * 2;
            b += player.speed * 2;
        }

        // Direções retas
        else if (player.currentRow === 1) { // direita
            a += player.speed * 2;
        }

        else if (player.currentRow === 0) { // esquerda
            a -= player.speed * 2;
        }

        else if (player.currentRow === 5) { // baixo
            b += player.speed * 2;
        }

        else if (player.currentRow === 2) { // cima
            b -= player.speed * 2;
        }

        // Dash
        player.x += a;
        player.y += b;

        player.dashTime = approach(player.dashTime, player.dashDistance, 1)

        if (player.dashTime >= player.dashDistance) {
            player.isDashing = false;
        }
    }

    if (player.dashCooldown > 0) {
        player.dashCooldown--;
    }

    // Colisão limite do mapa
    if (player.x < 0) { player.x = 0 };
    if (player.y < 0) { player.y = 0 };
    if (player.x + player.width > game.width) { player.x = game.width - player.width };
    if (player.y + player.height > game.height) { player.y = game.height - player.height; }

    if (collisionCheck(player, trash)) {
        player.withTrash = true;
        trash.x = 9999;
        trash.y = 9999;
        trash.width = 40 + Math.random() * 60;
        trash.height = trash.width;

        // SFX
        sfxCollect.currentTime = 0;
        sfxCollect.play();
    }

    if (collisionCheck(player, bin)) {
        if (player.withTrash) {
            player.withTrash = false;
            trash.x = Math.random() * (game.width - 50);
            trash.y = Math.random() * (game.height - 50);
            recycled += 1;
            document.querySelector("#trash").innerHTML = recycled;

            // VERIFICA SE DEVE MOSTRAR DICA (a cada 5 reciclagens)
            if (Math.floor(recycled / 5) > Math.floor(tips.lastRecycledCount / 5)) {
                showTip();
                tips.shakeAmount = 8; // Inicia o shake
            }
            tips.lastRecycledCount = recycled;

            //SFX
            sfxDiscart.currentTime = 0;
            sfxDiscart.play();
        }
    }

    // Atualiza o shake (diminui gradualmente)
    if (tips.shakeAmount > 0) {
        tips.shakeAmount -= 0.5;
        if (tips.shakeAmount < 0) tips.shakeAmount = 0;
    }

    function trocarCorCarro(sprite) {
        if (Math.random() < 0.5) {
            sprite.src = "../assets/spr/spr_truck_white.png";
        } else {
            sprite.src = "../assets/spr/spr_truck_black.png";
        }
    }

    // Movimento dos Carros
    carro1.x += carro1.speed;
    carro2.x -= carro2.speed;

    if (carro1.x > canvas.width + 200) {
        trocarCorCarro(carro_spr);
        carro1.x = -200;
    } 
    
    if (carro2.x < -200) {
        trocarCorCarro(carro2_spr);
        carro2.x = 800
    }

    // Colisão com os Carros
    if (player.z === 0 && collisionCheck(player, carro1, "better")) {
        game.state = "death";
    }

    if (player.z === 0 && collisionCheck(player, carro2, "better")) {
        game.state = "death";
    }
    // Sistema de Dificuldade
    let currentLevel = Math.floor(recycled / 5);

    if (currentLevel > difficultyLevel) {
        difficultyLevel = currentLevel;
        document.querySelector("#difficult").innerHTML = difficultyLevel
        carro1.speed += 1;
        carro2.speed += 1;
    }

    name.x = player.x + 25
    name.y = (player.y - 10) - player.z

    shadow.x = (player.x + player.z * 0.1) 
    shadow.y = player.y + 35
    shadow.width = 50 - player.z * 0.3;
    shadow.height = 20 - player.z * 0.1;

}

// Desenha na tela
function canvas_draw() {

    // Limpa a Tela
    ctx.clearRect(0, 0, game.width, game.height); 

    // Aplica shake na tela toda se houver
    if (tips.shakeAmount > 0) {
        ctx.save();
        const shakeX = (Math.random() - 0.5) * tips.shakeAmount;
        const shakeY = (Math.random() - 0.5) * tips.shakeAmount;
        ctx.translate(shakeX, shakeY);
    }

    // Desenha o Mapa
    drawMap();

    // Animação
    if (player.isMoving) {
        player.animCounter++;

        if (player.animCounter >= 10) {
            player.animCounter = 0;
            player.currentFrame++;
            if (player.currentFrame > 3) {
                player.currentFrame = 0;
            }
        }
    } else {
        player.currentFrame = 0;
        player.animCounter = 0;
    }

    // Animação Carro
    carro1.animCounterCarro++
    if (carro1.animCounterCarro >= 10) {
        carro1.animCounterCarro = 0
        carro1.currentFrame++;
        carro2.currentFrame++;
        if (carro1.currentFrame > 3) {
            carro1.currentFrame = 0;
            carro2.currentFrame = 0;
        }
    }

    if (player.y + player.height > carro2.y + carro2.height) {

        // player vs trashBin
        if (player.y + player.height +10 > bin.y + bin.height) {
            drawTrash()
            drawBin()
            drawCar()
            drawName()
            drawShadow()
            drawCar2()
            drawPlayer()   // player na frente de tudo
        } else {
            drawTrash()
            drawCar()
            drawName()
            drawShadow()
            drawCar2()
            drawPlayer()   // player na frente do carro
            drawBin()      // bin na frente do player
        }

    } else {

        // player vs trashBin
        if (player.y + player.height +10 > bin.y + bin.height) {
            drawTrash()
            drawBin()
            drawCar()
            drawName()
            drawShadow()
            drawPlayer()
            drawCar2()
        } else {
            drawTrash()
            drawCar()
            drawName()
            drawShadow()
            drawPlayer()
            drawBin()
            drawCar2()
        }

    }

    // Desenha a dica por cima de tudo
    drawTips();
    
    // Restaura o contexto se houve shake
    if (tips.shakeAmount > 0) {
        ctx.restore();
    }

    /* Debug
    drawHitbox(player, "lime");   // player verde
    drawHitbox(carro1, "red");    // carro 1 vermelho
    drawHitbox(carro2, "red");    // carro 2 vermelho
    drawHitbox(trash, "yellow");   
    drawHitbox(bin, "pink");   
    */
};

function end_loop() {

    let gamepad = navigator.getGamepads()[0];
    let _Restart = keys["r"] || (gamepad && gamepad.buttons[0].pressed);
    let _Return = keys["t"] || (gamepad && gamepad.buttons[1].pressed);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    playMusic(endMusic);

    // Fundo com gradiente
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#aa1a1a");
    gradient.addColorStop(1, "#6d1313");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = "white";
    ctx.font = "72px 'Pixelify Sans'";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, 200);

    // Subtítulo
    ctx.font = "24px 'Pixelify Sans'";
    ctx.fillText("Você não conseguiu reciclar tudo a tempo!", canvas.width / 2, 250);

    // Texto
    ctx.font = "16px 'Pixelify Sans'";
    ctx.fillStyle = "white";
    ctx.fillText("Pressione R ou ✕ para reiniciar", 400, 440);
    ctx.fillText("Pressione T ou ◯ para retornar ao menu", 400, 460);

    // Reinicia o jogo se pressionar Enter ou Start
    if (_Restart) {
        // Reseta variáveis do jogo
        recycled = 0;
        difficultyLevel = 0;
        document.querySelector("#trash").innerHTML = recycled;
        document.querySelector("#difficult").innerHTML = difficultyLevel

        // Posiciona player e lixo
        player.x = 350;
        player.y = 430;
        player.withTrash = false;

        trash.x = Math.random() * (game.width - 50);
        trash.y = Math.random() * (game.height - 50);

        // Posiciona carros
        carro1.x = -200;
        carro2.x = 800;
        carro1.speed = 3;
        carro2.speed = 3;

        player.currentRow = 5;

        game.state = "gameplay";
    }

    if (_Return) {
        // Reseta variáveis do jogo
        recycled = 0;
        difficultyLevel = 0;
        document.querySelector("#trash").innerHTML = recycled;
        document.querySelector("#difficult").innerHTML = difficultyLevel

        // Reseta Menu
        menu.selected = 0;
        bgOffset.sky = 0;
        bgOffset.far = 0;
        bgOffset.mid = 0;
        bgOffset.front = 0;

        // Posiciona player e lixo
        player.x = 350;
        player.y = 430;
        player.withTrash = false;

        trash.x = Math.random() * (game.width - 50);
        trash.y = Math.random() * (game.height - 50);

        // Posiciona carros
        carro1.x = -200;
        carro2.x = 800;
        carro1.speed = 3;
        carro2.speed = 3;

        player.currentRow = 5;

        game.state = "start";
        playMusic(startMusic);
    }
}

// =====================
// LOOP
// =====================

function game_loop() {
    if (game.state == "loading") {
        loading_loop()
    } else if (game.state == "start") {
        start_loop();
    } else if (game.state == "gameplay") {
        canvas_update();
        canvas_draw();
    } else if (game.state == "death") {
        end_loop();
    }
    requestAnimationFrame(game_loop);
}

game_loop();
