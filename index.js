// Definizione delle costanti e variabili necessarie

GLOBALS.keyboard = new Keyboard();

ctx.textBaseline = "top";

let currentMap = MAPS[MAP_IDS.intro];
let currentBattle = null;
let currentBriscola = null;
let currentDialogue = null;

function handleFootstepsSound() {
  const moveX = GLOBALS.keyboard.isRight || GLOBALS.keyboard.isLeft;
  const moveY = GLOBALS.keyboard.isUp || GLOBALS.keyboard.isDown;

  const currentlyMoving = moveX || moveY;

  if (currentlyMoving) {
    ASSETS.soundEffects.footsteps.loop = true;
    ASSETS.soundEffects.footsteps
      .play()
      .catch((err) => console.error("Audio play error:", err));
  } else if (!currentlyMoving) {
    ASSETS.soundEffects.footsteps.pause();
    ASSETS.soundEffects.footsteps.currentTime = 0;
  }
}

let interactionCooldown = 0;
let lastKeyPressedId = null;

canvas.width = CONFIG.tile.canvasWidth;
canvas.height = CONFIG.tile.canvasHeight;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let backgroundPosition = { x: 0, y: 0 };

function handlePlayersMovement() {
  const moveX = GLOBALS.keyboard.isRight ? -1 : GLOBALS.keyboard.isLeft ? 1 : 0;
  const moveY = GLOBALS.keyboard.isDown ? -1 : GLOBALS.keyboard.isUp ? 1 : 0;

  if (moveX !== 0) {
    GLOBALS.players[CONFIG.player.partner].direction =
      moveX > 0 ? CONFIG.directions.left : CONFIG.directions.right;
    GLOBALS.players[CONFIG.player.main].direction =
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
  if (GLOBALS.keyboard.isRight) {
    if (GLOBALS.partnerDrift.x > -1 * CONFIG.player.distanceBetweenPartners) {
      GLOBALS.partnerDrift.x -= CONFIG.player.velocity;
    }
  }

  if (GLOBALS.keyboard.isLeft) {
    if (GLOBALS.partnerDrift.x < CONFIG.player.distanceBetweenPartners) {
      GLOBALS.partnerDrift.x += CONFIG.player.velocity;
    }
  }

  if (GLOBALS.keyboard.isUp) {
    if (GLOBALS.partnerDrift.y < CONFIG.player.distanceBetweenPartners) {
      GLOBALS.partnerDrift.y += CONFIG.player.velocity;
    }
  }

  if (GLOBALS.keyboard.isDown) {
    if (GLOBALS.partnerDrift.y > -1 * CONFIG.player.distanceBetweenPartners) {
      GLOBALS.partnerDrift.y -= CONFIG.player.velocity;
    }
  }

  // Align the partner when the direction of the main player is only 1
  if (moveX === 0 && moveY !== 0) {
    const mult =
      GLOBALS.partnerDrift.x < 0 ? 1 : GLOBALS.partnerDrift.x > 0 ? -1 : 0;
    GLOBALS.partnerDrift.x += (mult * CONFIG.player.velocity) / 2;
    if (Math.abs(GLOBALS.partnerDrift.x) < CONFIG.player.velocity / 2) {
      GLOBALS.partnerDrift.x = 0;
    }
  }

  if (moveX !== 0 && moveY === 0) {
    const mult =
      GLOBALS.partnerDrift.y < 0 ? 1 : GLOBALS.partnerDrift.y > 0 ? -1 : 0;
    GLOBALS.partnerDrift.y += (mult * CONFIG.player.velocity) / 2;
    if (Math.abs(GLOBALS.partnerDrift.y) < CONFIG.player.velocity / 2) {
      GLOBALS.partnerDrift.y = 0;
    }
  }
}

function handleSwitch() {
  if (GLOBALS.keyboard.isSwitch) {
    const temp = CONFIG.player.main;
    CONFIG.player.main = CONFIG.player.partner;
    CONFIG.player.partner = temp;

    GLOBALS.keyboard.unsetSwitch();
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
  // ctx.textBaseline = "top"; // Posiziona il testo dall'alto

  // Scrivi il testo all'interno del box
  ctx.fillText(
    `x: ${currentMap.currentPosition.x}, y: ${currentMap.currentPosition.y}`,
    boxX + 10,
    boxY + 10
  );

  const cell = currentMap.currentCell;

  ctx.fillText(`cellX: ${cell.cellX}, y: ${cell.cellY}`, boxX + 10, boxY + 20);

  // Disegna la linea orizzontale
  ctx.beginPath();
  ctx.moveTo(0, CONFIG.tile.canvasHeight / 2); // Inizia a sinistra
  ctx.lineTo(CONFIG.tile.canvasWidth, CONFIG.tile.canvasHeight / 2); // Termina a destra
  ctx.strokeStyle = "blue"; // Colore della linea
  ctx.lineWidth = 1; // Spessore della linea
  ctx.stroke();

  // Disegna la linea verticale
  ctx.beginPath();
  ctx.moveTo(CONFIG.tile.canvasWidth / 2, 0); // Inizia in alto
  ctx.lineTo(CONFIG.tile.canvasWidth / 2, CONFIG.tile.canvasHeight); // Termina in basso
  ctx.strokeStyle = "red"; // Colore della linea
  ctx.lineWidth = 1; // Spessore della linea
  ctx.stroke();
}

function drawDialogues() {
  currentDialogue.drawDialogue({
    players: GLOBALS.players,
    partnerDrift: GLOBALS.partnerDrift,
  });
}

function handleInteractions() {
  const now = Date.now();

  if (
    GLOBALS.keyboard.isInteract &&
    now > GLOBALS.interactionCooldown &&
    GLOBALS.lastKeyPressedId !== GLOBALS.keyboard.keyId // avoid keep pressing the same key and executing the code
  ) {
    GLOBALS.lastKeyPressedId = GLOBALS.keyboard.keyId;
    GLOBALS.interactionCooldown = now + CONFIG.keyboard.interactionCooldown;

    const entity = currentMap.getNearestInteractionEntity();

    if (entity) {
      currentDialogue = new DialogueManager({
        dialogues: entity.dialogues,
        entity,
      });
      currentDialogue.init();
    }
  }
}

// Funzione di animazione
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clean canvas

  if (currentBattle?.inProgress) {
    currentBattle.draw();
    currentBattle.handle();
  } else if (currentBriscola?.inProgress) {
    currentBriscola.draw();
    currentBriscola.handle();
  } else {
    currentMap.drawBackgrounds();
    currentMap.drawNpcs();

    GLOBALS.players[CONFIG.player.partner].draw(
      GLOBALS.partnerDrift.x,
      GLOBALS.partnerDrift.y
    );
    GLOBALS.players[CONFIG.player.main].draw();

    currentMap.drawForegrounds();

    if (currentDialogue?.inProgress) {
      currentDialogue.draw();
      currentDialogue.handle();

      if (currentDialogue.battleIsTriggered) {
        const battleId = currentDialogue.battleId;
        currentBattle = new BattleManager(BATTLES[currentMap.id][battleId]);
        currentBattle.init();
        currentDialogue.stopDialogue();
      }

      if (currentDialogue.briscolaIsTriggered) {
        const briscolaId = currentDialogue.briscolaId;
        currentBriscola = new BriscolaManager({
          briscola: BRISCOLATE[briscolaId],
        });
        currentBriscola.init();
        currentDialogue.stopDialogue();
      }
    } else {
      handlePlayersMovement();
      handleSwitch();
      handleFootstepsSound();
      handleInteractions();
    }
  }

  debug();

  window.requestAnimationFrame(animate);
}

// Inizializza l'animazione
animate();

// Gestione degli eventi di tastiera
window.addEventListener("keydown", (e) => {
  GLOBALS.keyboard.registerKeyPressed(e);
});

window.addEventListener("keyup", (e) => {
  GLOBALS.keyboard.unsetKeyPressed(e);
});
