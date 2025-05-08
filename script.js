
let canvas = document.querySelector("#canvas");

// Pega o contexto 2D do canvas, que permite desenhar formas, imagens, texto etc.
let ctx = canvas.getContext("2d");

/* Tabela do player */
let player = [];
player.x = 100;
player.y = 300
player.width = 50;
player.height = 50;

let enemy = [];
enemy.x = 650;
enemy.y = 300;
enemy.width = 50;
enemy.height = 50;


ctx.fillStyle = "black"; // Define a cor usada para desenhar como preto ("#000000")
ctx.fillRect(player.x, player.y, player.width, player.height); // Desenha um retângulo preenchido de 50x50 pixels na posição (0, 0)

ctx.fillStyle = "red";
ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
