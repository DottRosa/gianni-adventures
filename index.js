// Definizione delle costanti e variabili necessarie
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const keyboard = new Keyboard();

let currentMap = MAPS[MAP_IDS.intro];

function handleFootstepsSound() {
  const moveX = keyboard.isRight || keyboard.isLeft;
  const moveY = keyboard.isUp || keyboard.isDown;

  const currentlyMoving = moveX || moveY;

  if (currentlyMoving) {
    ASSETS.soundEffects.footsteps.loop = true;
    ASSETS.soundEffects.footsteps
      .play()
      .catch((err) => console.error("Audio play error:", err));
  } else if (!currentlyMoving) {
    // Il giocatore si è fermato
    ASSETS.soundEffects.footsteps.pause();
    ASSETS.soundEffects.footsteps.currentTime = 0;
  }
}

let dialogueInProgress = false;
let battleInProgress = false;
let interactionCooldown = 0;
let lastKeyPressedId = null;

canvas.width = CONFIG.tile.canvasWidth;
canvas.height = CONFIG.tile.canvasHeight;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const players = {};
players[CONFIG.player.fabrissazzo] = new Player({
  spriteImages: {
    left: `${CONFIG.assetsFolder}/fabris-sprite-left.png`,
    right: `${CONFIG.assetsFolder}/fabris-sprite-right.png`,
  },
  name: "Fabris",
});

players[CONFIG.player.gianni] = new Player({
  spriteImages: {
    left: `${CONFIG.assetsFolder}/gianni-sprite-left.png`,
    right: `${CONFIG.assetsFolder}/gianni-sprite-right.png`,
  },
  name: "Gianni",
});

let backgroundPosition = { x: 0, y: 0 };
let partnerDrift = { x: 0, y: 0 };

function handlePlayersMovement() {
  const moveX = keyboard.isRight ? -1 : keyboard.isLeft ? 1 : 0;
  const moveY = keyboard.isDown ? -1 : keyboard.isUp ? 1 : 0;

  if (moveX !== 0) {
    players[CONFIG.player.partner].direction =
      moveX > 0 ? CONFIG.directions.left : CONFIG.directions.right;
    players[CONFIG.player.main].direction =
      moveX > 0 ? CONFIG.directions.left : CONFIG.directions.right;
  }

  const currentPosition = currentMap.currentPosition;

  const nextValueX = currentPosition.x + moveX * CONFIG.player.velocity;
  const nextValueY = currentPosition.y + moveY * CONFIG.player.velocity;

  let canMoveX = !currentMap.collisionsDetector.isColliding(
    nextValueX,
    currentPosition.y
  );
  let canMoveY = !currentMap.collisionsDetector.isColliding(
    currentPosition.x,
    nextValueY
  );

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
    backgroundPosition.x += moveX * CONFIG.player.velocity;
  }
  if (canMoveY) {
    backgroundPosition.y += moveY * CONFIG.player.velocity;
  }

  currentMap.updateLayerPosition(backgroundPosition.x, backgroundPosition.y);

  const nextMapId = currentMap.doorFound;
  if (nextMapId) {
    currentMap = MAPS[nextMapId];
  }

  backgroundPosition = { x: 0, y: 0 };

  // The partner follows the path of the main player
  if (keyboard.isRight) {
    if (partnerDrift.x > -1 * CONFIG.player.distanceBetweenPartners) {
      partnerDrift.x -= CONFIG.player.velocity;
    }
  }

  if (keyboard.isLeft) {
    if (partnerDrift.x < CONFIG.player.distanceBetweenPartners) {
      partnerDrift.x += CONFIG.player.velocity;
    }
  }

  if (keyboard.isUp) {
    if (partnerDrift.y < CONFIG.player.distanceBetweenPartners) {
      partnerDrift.y += CONFIG.player.velocity;
    }
  }

  if (keyboard.isDown) {
    if (partnerDrift.y > -1 * CONFIG.player.distanceBetweenPartners) {
      partnerDrift.y -= CONFIG.player.velocity;
    }
  }

  // Align the partner when the direction of the main player is only 1
  if (moveX === 0 && moveY !== 0) {
    const mult = partnerDrift.x < 0 ? 1 : partnerDrift.x > 0 ? -1 : 0;
    partnerDrift.x += (mult * CONFIG.player.velocity) / 2;
    if (Math.abs(partnerDrift.x) < CONFIG.player.velocity / 2) {
      partnerDrift.x = 0;
    }
  }

  if (moveX !== 0 && moveY === 0) {
    const mult = partnerDrift.y < 0 ? 1 : partnerDrift.y > 0 ? -1 : 0;
    partnerDrift.y += (mult * CONFIG.player.velocity) / 2;
    if (Math.abs(partnerDrift.y) < CONFIG.player.velocity / 2) {
      partnerDrift.y = 0;
    }
  }
}

function handleSwitch() {
  if (keyboard.isSwitch) {
    const temp = CONFIG.player.main;
    CONFIG.player.main = CONFIG.player.partner;
    CONFIG.player.partner = temp;

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
  ctx.textAlign = CONFIG.directions.left; // Allinea il testo a sinistra
  ctx.textBaseline = "top"; // Posiziona il testo dall'alto

  // Scrivi il testo all'interno del box
  ctx.fillText(
    `x: ${currentMap.currentPosition.x}, y: ${currentMap.currentPosition.y}`,
    boxX + 10,
    boxY + 10
  );

  const cell = currentMap.currentCell;

  ctx.fillText(`cellX: ${cell.cellX}, y: ${cell.cellY}`, boxX + 10, boxY + 20);
}

function drawDialogues() {
  currentMap.currentInteractionEntity.drawDialogue({ players, partnerDrift });
}

function handleInteractions() {
  const now = Date.now();

  if (
    dialogueInProgress &&
    currentMap.currentInteractionEntity.dialogueManager.choiceInProgress &&
    now > interactionCooldown &&
    lastKeyPressedId !== keyboard.keyId // avoid keep pressing the same key and executing the code
  ) {
    lastKeyPressedId = keyboard.keyId;
    interactionCooldown = now + CONFIG.keyboard.choicesCooldown;

    switch (true) {
      case keyboard.isDown: {
        currentMap.currentInteractionEntity.changeChoice(true);
        break;
      }
      case keyboard.isUp: {
        currentMap.currentInteractionEntity.changeChoice(false);
        break;
      }
      case keyboard.isInteract: {
        currentMap.currentInteractionEntity.dialogueManager.selectChoice();
        break;
      }
    }

    return; // next interaction handling will be skipped
  }

  if (
    keyboard.isInteract &&
    now > interactionCooldown &&
    lastKeyPressedId !== keyboard.keyId // avoid keep pressing the same key and executing the code
  ) {
    lastKeyPressedId = keyboard.keyId;
    interactionCooldown = now + CONFIG.keyboard.interactionCooldown;

    if (dialogueInProgress && currentMap.currentInteractionEntity) {
      const dialogueStatus =
        currentMap.currentInteractionEntity.dialogueManager.next();

      switch (dialogueStatus) {
        case CONFIG.dialogue.status.stop: {
          dialogueInProgress = false;
          currentMap.currentInteractionEntity = null;
          break;
        }
        case CONFIG.dialogue.status.battle: {
          battleInProgress = true;
          break;
        }
      }
      return;
    }

    currentMap.setNearestInteractionEntity();

    if (currentMap.currentInteractionEntity) {
      dialogueInProgress = true;
      currentMap.currentInteractionEntity.dialogueManager.start();
    }
  }
}

// Funzione di animazione
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clean canvas
  currentMap.drawBackgrounds();
  currentMap.drawNpcs();

  players[CONFIG.player.partner].draw(partnerDrift.x, partnerDrift.y);
  players[CONFIG.player.main].draw();

  currentMap.drawForegrounds();

  if (battleInProgress) {
    console.log("si parte");
  }

  if (!dialogueInProgress) {
    handlePlayersMovement();
    handleSwitch();
    handleFootstepsSound();
  } else {
    drawDialogues();
  }
  handleInteractions();

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
