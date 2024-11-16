// Definizione delle costanti e variabili necessarie
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const keyboard = new Keyboard();

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

const PLAYER_VELOCITY = FRAME_VELOCITY;

const players = {
  gianni: new Sprite({
    spriteImages: {
      left: `${ASSETS_FOLDER}/gianni.png`,
      right: `${ASSETS_FOLDER}/gianni.png`,
    },
    velocity: PLAYER_VELOCITY,
  }),
  fabris: new Sprite({
    spriteImages: {
      left: `${ASSETS_FOLDER}/fabris.png`,
      right: `${ASSETS_FOLDER}/fabris.png`,
    },
    velocity: PLAYER_VELOCITY,
  }),
};

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

let startPosition = { ...background.position };
let partnerDrift = { x: 0, y: 0 };
let mainPlayer = "gianni";
let partnerPlayer = "fabris";

const DISTANCE_BETWEEN_PARTNERS = 50;

function handlePlayersMovement() {
  const moveX = keyboard.isRight ? -1 : keyboard.isLeft ? 1 : 0;
  const moveY = keyboard.isDown ? -1 : keyboard.isUp ? 1 : 0;

  background.position.x += moveX * PLAYER_VELOCITY;
  background.position.y += moveY * PLAYER_VELOCITY;

  // The partner follows the path of the main player
  if (keyboard.isRight) {
    if (partnerDrift.x > -1 * DISTANCE_BETWEEN_PARTNERS) {
      partnerDrift.x -= PLAYER_VELOCITY;
    }
  }

  if (keyboard.isLeft) {
    if (partnerDrift.x < DISTANCE_BETWEEN_PARTNERS) {
      partnerDrift.x += PLAYER_VELOCITY;
    }
  }

  if (keyboard.isUp) {
    if (partnerDrift.y < DISTANCE_BETWEEN_PARTNERS) {
      partnerDrift.y += PLAYER_VELOCITY;
    }
  }

  if (keyboard.isDown) {
    if (partnerDrift.y > -1 * DISTANCE_BETWEEN_PARTNERS) {
      partnerDrift.y -= PLAYER_VELOCITY;
    }
  }

  // Align the partner when the direction of the main player is only 1
  if (moveX === 0 && moveY !== 0) {
    const mult = partnerDrift.x < 0 ? 1 : partnerDrift.x > 0 ? -1 : 0;
    partnerDrift.x += (mult * PLAYER_VELOCITY) / 2;
    if (Math.abs(partnerDrift.x) < PLAYER_VELOCITY / 2) {
      partnerDrift.x = 0;
    }
  }

  if (moveX !== 0 && moveY === 0) {
    const mult = partnerDrift.y < 0 ? 1 : partnerDrift.y > 0 ? -1 : 0;
    partnerDrift.y += (mult * PLAYER_VELOCITY) / 2;
    if (Math.abs(partnerDrift.y) < PLAYER_VELOCITY / 2) {
      partnerDrift.y = 0;
    }
  }
}

function handleSwitch() {
  if (keyboard.isSwitch) {
    const temp = mainPlayer;
    mainPlayer = partnerPlayer;
    partnerPlayer = temp;

    keyboard.unsetSwitch();
  }
}

// Funzione di animazione
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clean canvas
  background.draw();
  players[partnerPlayer].draw(partnerDrift.x, partnerDrift.y);
  players[mainPlayer].draw();
  handlePlayersMovement();
  handleSwitch();
  window.requestAnimationFrame(animate);
}

// Inizializza l'animazione
animate();

// Gestione degli eventi di tastiera
window.addEventListener("keydown", (e) => {
  keyboard.registerKeyPressed(e);
});

window.addEventListener("keyup", (e) => {
  keyboard.unsetKeyPressed(e);
});
