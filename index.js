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

const collision = new Collision(COLLISIONS_FIRST_MAP, 70);

const PLAYER_VELOCITY = FRAME_VELOCITY;
const START_COORDS = { cellX: 16, cellY: 21 };

const background = new Background({
  position: getCoordsByCell(START_COORDS.cellX, START_COORDS.cellY),
  imageSrc: `${ASSETS_FOLDER}/first-map.png`,
});

const collisionsGround = new Background({
  position: getCoordsByCell(16, 21),
  imageSrc: `${ASSETS_FOLDER}/collisions.png`,
});

const npcs = [
  new NPC({
    spriteImages: {
      left: `${ASSETS_FOLDER}/npc-sprite.png`,
      right: `${ASSETS_FOLDER}/npc-sprite.png`,
    },
    mapPositionCell: {
      cellX: 17,
      cellY: 22,
    },
    backgroundPosition: {
      x: background.position.x,
      y: background.position.y,
    },
  }),
  new NPC({
    spriteImages: {
      left: `${ASSETS_FOLDER}/npc-sprite.png`,
      right: `${ASSETS_FOLDER}/npc-sprite.png`,
    },
    mapPositionCell: {
      cellX: 36,
      cellY: 17,
    },
    backgroundPosition: {
      x: background.position.x,
      y: background.position.y,
    },
  }),
];

const backgrounds = [background];

const players = {
  gianni: new Sprite({
    spriteImages: {
      left: `${ASSETS_FOLDER}/gianni-sprite-left.png`,
      right: `${ASSETS_FOLDER}/gianni-sprite-right.png`,
    },
  }),
  fabris: new Sprite({
    spriteImages: {
      left: `${ASSETS_FOLDER}/fabris-sprite-left.png`,
      right: `${ASSETS_FOLDER}/fabris-sprite-right.png`,
    },
  }),
};

let backgroundPosition = { x: 0, y: 0 };
let partnerDrift = { x: 0, y: 0 };
let mainPlayer = "gianni";
let partnerPlayer = "fabris";

const DISTANCE_BETWEEN_PARTNERS = 50;

function handlePlayersMovement() {
  const moveX = keyboard.isRight ? -1 : keyboard.isLeft ? 1 : 0;
  const moveY = keyboard.isDown ? -1 : keyboard.isUp ? 1 : 0;

  if (moveX !== 0) {
    players[partnerPlayer].direction = moveX > 0 ? "left" : "right";
    players[mainPlayer].direction = moveX > 0 ? "left" : "right";
  }

  const nextValueX = background.position.x + moveX * PLAYER_VELOCITY;
  const nextValueY = background.position.y + moveY * PLAYER_VELOCITY;

  let canMoveX = !collision.isColliding(nextValueX, background.position.y);
  let canMoveY = !collision.isColliding(background.position.x, nextValueY);

  // Diagonal check
  if (moveX !== 0 && moveY !== 0) {
    if (!canMoveX && !canMoveY) {
      // No movement if both directions have collisions
      canMoveX = false;
      canMoveY = false;
    } else if (!canMoveX) {
      canMoveY = true;
      canMoveX = false;
    } else if (!canMoveY) {
      canMoveX = true;
      canMoveY = false;
    }
  }

  if (canMoveX) {
    backgroundPosition.x += moveX * PLAYER_VELOCITY;
  }
  if (canMoveY) {
    backgroundPosition.y += moveY * PLAYER_VELOCITY;
  }

  backgrounds.forEach((b) => {
    b.position.x += backgroundPosition.x;
    b.position.y += backgroundPosition.y;
  });

  backgroundPosition = { x: 0, y: 0 };

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

function debug() {
  // Specifiche del box bianco
  const boxX = 10; // Posizione orizzontale del box
  const boxY = 10; // Posizione verticale del box
  const boxWidth = 200; // Larghezza del box
  const boxHeight = 50; // Altezza del box

  // Disegna il box bianco con bordo nero
  ctx.fillStyle = "white"; // Colore di riempimento del box
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight); // Disegna il rettangolo
  ctx.strokeStyle = "black"; // Colore del bordo
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight); // Disegna il bordo

  // Specifiche del testo
  ctx.font = "10px Arial"; // Font e dimensione del testo
  ctx.fillStyle = "black"; // Colore del testo
  ctx.textAlign = "left"; // Allinea il testo a sinistra
  ctx.textBaseline = "top"; // Posiziona il testo dall'alto

  // Scrivi il testo all'interno del box
  ctx.fillText(
    `x: ${background.position.x}, y: ${background.position.y}`,
    boxX + 10,
    boxY + 10
  );

  const cell = getCellByCoords(background.position.x, background.position.y);

  ctx.fillText(`cellX: ${cell.cellX}, y: ${cell.cellY}`, boxX + 10, boxY + 20);
}

// Funzione di animazione
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clean canvas
  backgrounds.forEach((b) => b.draw());

  players[partnerPlayer].draw(partnerDrift.x, partnerDrift.y);
  players[mainPlayer].draw();

  handlePlayersMovement();
  handleSwitch();

  npcs.forEach((n) => {
    n.updatePosition(backgrounds[0].position);
    n.draw();
  });

  debug();

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
