// PASSARE LA BATTLE AD UN BATTLE MANAGER CHE SI PREOCCUPA DI GESTIRE IL TUTTO

class Battle {
  pointerPosition = 0;
  interactionCooldown = 0;
  currentTurn;
  turns = [];
  lastKeyPressedId;

  constructor({
    background = `${CONFIG.assetsFolder}/battle.jpg`,
    enemies = [],
  }) {
    this.background = new Layer({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: background,
    });
    this.enemies = enemies;
  }

  init() {
    // Calculate turns
    const turns = [
      {
        isPlayer: true,
        entity: players[CONFIG.player.gianni],
      },
      {
        isPlayer: true,
        entity: players[CONFIG.player.fabrissazzo],
      },
    ];

    this.enemies.forEach((enemy, index) => {
      turns.push({
        isPlayer: false,
        entity: enemy,
      });
    });

    turns.sort((a, b) => {
      return a.entity.characterBattleStats.currentVelocity >
        b.entity.characterBattleStats.currentVelocity
        ? -1
        : 1;
    });

    this.turns = turns;
    this.currentTurn = 0;
  }

  get charactersQuantity() {
    return Object.values(players).length + this.enemies.length;
  }

  drawPlayers() {
    players[CONFIG.player.gianni].currentDirection = CONFIG.directions.right;
    players[CONFIG.player.fabrissazzo].currentDirection =
      CONFIG.directions.right;

    players[CONFIG.player.gianni].drawAtPosition(
      CONFIG.battle.arenaPaddingX,
      CONFIG.tile.canvasHeight / 2
    );
    players[CONFIG.player.fabrissazzo].drawAtPosition(
      CONFIG.battle.arenaPaddingX + CONFIG.battle.gapBetweenCharacters,
      CONFIG.tile.canvasHeight / 2
    );
  }

  drawEnemies() {
    for (var i = 0; i < this.enemies.length; i++) {
      const posX =
        CONFIG.tile.canvasWidth - // the full width of the canvas
        CONFIG.battle.arenaPaddingX - // the padding of the arena
        this.enemies[i].displayedWidth - // the width of the character, because it start to draw images from top-left corner
        CONFIG.battle.gapBetweenCharacters * i; // space between characters

      const posY = CONFIG.tile.canvasHeight / 2;

      this.enemies[i].drawAtPosition(posX, posY);
    }
  }

  drawHealth(characters, isEnemy = false) {
    let verticalGap = CONFIG.battle.healthBar.verticalGap;
    const width = CONFIG.battle.healthBar.width;
    const height = CONFIG.battle.healthBar.height;

    let x = CONFIG.battle.arenaPaddingX;
    if (isEnemy) {
      x = CONFIG.tile.canvasWidth - CONFIG.battle.arenaPaddingX - width;
    }

    characters.forEach((character) => {
      let y = verticalGap;
      const healthPercent =
        character.characterBattleStats.currentHealth /
        character.characterBattleStats.health;

      let barColor;
      if (healthPercent > CONFIG.battle.healthBar.ranges.high.threshold) {
        barColor = CONFIG.battle.healthBar.ranges.high.color;
      } else if (
        healthPercent > CONFIG.battle.healthBar.ranges.medium.threshold
      ) {
        barColor = CONFIG.battle.healthBar.ranges.medium.color;
      } else {
        barColor = CONFIG.battle.healthBar.ranges.low.color;
      }

      ctx.fillStyle = CONFIG.typography.textColor;
      ctx.font = `${CONFIG.battle.healthBar.fontSize}px ${CONFIG.typography.fontFamily}`;
      ctx.textAlign = CONFIG.battle.healthBar.textAlign;
      ctx.fillText(character.name, x, y - 5);

      ctx.strokeStyle = CONFIG.battle.healthBar.border.color;
      ctx.lineWidth = CONFIG.battle.healthBar.border.width;
      ctx.strokeRect(x, y, width, height);

      ctx.fillStyle = barColor;
      ctx.fillRect(x, y, width * healthPercent, height);

      ctx.textAlign = "right";
      ctx.fillStyle = CONFIG.typography.textColor;
      ctx.fillText(
        `${character.characterBattleStats.currentHealth}/${character.characterBattleStats.health}`,
        x + width,
        y - 5
      );
      verticalGap += 50;
    });
  }

  drawPlayersHealthBar() {
    this.drawHealth([
      players[CONFIG.player.gianni],
      players[CONFIG.player.fabrissazzo],
    ]);
  }

  drawEnemiesHealthBar() {
    this.drawHealth(this.enemies, true);
  }

  drawPointer() {
    const width = CONFIG.battle.pointer.width;
    const height = CONFIG.battle.pointer.height;

    let posX = // pos X for players
      CONFIG.battle.arenaPaddingX +
      players[CONFIG.player.gianni].displayedWidth / 4 +
      CONFIG.battle.gapBetweenCharacters * this.pointerPosition +
      width / 4;

    if (this.pointerPosition > Object.values(players).length - 1) {
      posX = // pos X for enemies
        CONFIG.tile.canvasWidth -
        CONFIG.battle.arenaPaddingX -
        this.enemies[0].displayedWidth / 2 -
        CONFIG.battle.gapBetweenCharacters +
        (this.pointerPosition - this.enemies.length) *
          CONFIG.battle.gapBetweenCharacters -
        width / 4;
    }

    const startY = CONFIG.tile.canvasHeight / 2 - height * 2;

    // Disegna la parentesi angolare verso il basso
    ctx.beginPath();
    ctx.moveTo(posX, startY);
    ctx.lineTo(posX + width / 2, startY + height); // Vertex
    ctx.lineTo(posX + width, startY);
    ctx.strokeStyle = CONFIG.battle.pointer.border.color;
    ctx.lineWidth = CONFIG.battle.pointer.border.width;
    ctx.stroke();

    // Draw the character name
    let characterName = "";
    if (this.pointerPosition === 0) {
      characterName = players[CONFIG.player.gianni].name;
    } else if (this.pointerPosition === 1) {
      characterName = players[CONFIG.player.fabrissazzo].name;
    } else {
      characterName =
        this.enemies[this.pointerPosition - Object.values(players).length].name;
    }

    const textX = posX + width / 2;
    const textY = startY - 10;
    ctx.textAlign = "center";
    ctx.fillText(characterName, textX, textY);
  }

  drawDialogueBox() {
    const posX = CONFIG.battle.arenaPaddingX;
    const posY = CONFIG.tile.canvasHeight / 2 + CONFIG.tile.tileDim * 2;
    const width = CONFIG.tile.canvasWidth - posX * 2;
    const height =
      CONFIG.tile.canvasHeight - posY - CONFIG.battle.arenaPaddingY;
    ctx.fillStyle = CONFIG.dialogue.balloon.backgroundColor;
    ctx.fillRect(posX, posY, width, height);

    ctx.strokeStyle = CONFIG.dialogue.balloon.borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(posX, posY, width, height);

    ctx.textAlign = "left";
    ctx.fillStyle = CONFIG.dialogue.textColor;
    ctx.font = `20px ${CONFIG.typography.fontFamily}`;

    ctx.fillText(
      `È il turno di ${
        this.turns[this.currentTurn].entity.name
      }. Seleziona la tua mossa`,
      posX,
      posY + 25
    );
  }

  draw() {
    this.background.draw();
    this.drawPlayers();
    this.drawEnemies();
    this.drawPlayersHealthBar();
    this.drawEnemiesHealthBar();
    this.drawPointer();
    this.drawDialogueBox();
  }

  movePointerRight() {
    this.pointerPosition++;
    if (this.pointerPosition >= this.charactersQuantity) {
      this.pointerPosition = 0;
    }
  }

  movePointerLeft() {
    this.pointerPosition--;
    if (this.pointerPosition < 0) {
      this.pointerPosition = this.charactersQuantity - 1;
    }
  }

  handlePointer(keyboard) {
    const now = Date.now();

    if (
      now > this.interactionCooldown &&
      this.lastKeyPressedId !== keyboard.keyId // avoid keep pressing the same key and executing the code
    ) {
      this.lastKeyPressedId = keyboard.keyId;
      this.interactionCooldown = now + CONFIG.keyboard.choicesCooldown;

      switch (true) {
        case keyboard.isLeft: {
          this.movePointerLeft();
          break;
        }
        case keyboard.isRight: {
          this.movePointerRight();
          break;
        }
        case keyboard.isInteract: {
          // EVENTS.dialogue.entity.dialogueManager.selectChoice();
          break;
        }
      }

      return; // next interaction handling will be skipped
    }
  }

  handle(keyboard) {
    this.handlePointer(keyboard);
  }
}