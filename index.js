// Definizione delle costanti e variabili necessarie
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const MOVEMENT_FRAMES = 12;
const FRAME_VELOCITY = TILE_DIM / MOVEMENT_FRAMES;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const background = new Background({
  position: getCoordsByCell(16, 21),
  imageSrc: `${ASSETS_FOLDER}/first-map.png`,
});

const player = new Sprite({
  spriteImages: {
    left: `${ASSETS_FOLDER}/gianni.png`,
    right: `${ASSETS_FOLDER}/gianni.png`,
  },
  velocity: FRAME_VELOCITY,
});

// Gestione delle chiavi
const keys = {
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

// Variabili di stato per il movimento
let isMoving = false;
let currentDirection = null;
let nextDirection = null;
let movementProgress = 0;
let startPosition = { ...background.position };
let incrementsCounter = 0;
let facingDirection = "down"; // Direzione verso cui il personaggio è rivolto

// Funzione di animazione
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Pulisce il canvas
  background.draw();
  player.draw();

  window.requestAnimationFrame(animate);
}

// Inizializza l'animazione
animate();

// Gestione degli eventi di tastiera
window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    e.preventDefault(); // Previene lo scroll della pagina
    keys[key].pressed = true;
  }
});

window.addEventListener("keyup", (e) => {
  const key = e.key;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    keys[key].pressed = false;
  }
});
