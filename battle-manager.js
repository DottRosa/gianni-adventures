class BattleManager {
  targetSelectionPointer = 0;
  actionPointer = 0;
  interactionCooldown = 0;
  currentTurn;
  currentPhase = CONFIG.battle.phases.selection;
  turns = [];
  lastKeyPressedId;

  constructor(battle) {
    this.battle = battle;
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

    this.battle.enemies.forEach((enemy, index) => {
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
    for (var i = 0; i < this.battle.enemies.length; i++) {
      const posX =
        CONFIG.tile.canvasWidth - // the full width of the canvas
        CONFIG.battle.arenaPaddingX - // the padding of the arena
        this.battle.enemies[i].displayedWidth - // the width of the character, because it start to draw images from top-left corner
        CONFIG.battle.gapBetweenCharacters * i; // space between characters

      const posY = CONFIG.tile.canvasHeight / 2;

      this.battle.enemies[i].drawAtPosition(posX, posY);
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

      const staminaGap = 5; // Distanza tra i pallini
      const staminaRadius = 3; // Raggio del pallino

      // Disegno dei pallini della stamina
      const staminaY = y + height + 10; // Posizione Y dei pallini
      let staminaX = x; // Posizione iniziale X dei pallini
      for (let i = 0; i < character.characterBattleStats.currentStamina; i++) {
        ctx.beginPath();
        ctx.arc(
          staminaX + staminaRadius + (staminaRadius * 2 + staminaGap) * i,
          staminaY,
          staminaRadius,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "blue";
        ctx.fill();
        ctx.closePath();
      }

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
    this.drawHealth(this.battle.enemies, true);
  }

  drawTargetSelectionPointer() {
    const width = CONFIG.battle.pointer.width;
    const height = CONFIG.battle.pointer.height;

    let posX = // pos X for players
      CONFIG.battle.arenaPaddingX +
      players[CONFIG.player.gianni].displayedWidth / 4 +
      CONFIG.battle.gapBetweenCharacters * this.targetSelectionPointer +
      width / 4;

    if (this.targetSelectionPointer > Object.values(players).length - 1) {
      posX = // pos X for enemies
        CONFIG.tile.canvasWidth -
        CONFIG.battle.arenaPaddingX -
        this.battle.enemies[0].displayedWidth / 2 -
        CONFIG.battle.gapBetweenCharacters +
        (this.targetSelectionPointer - this.battle.enemies.length) *
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
    if (this.targetSelectionPointer === 0) {
      characterName = players[CONFIG.player.gianni].name;
    } else if (this.targetSelectionPointer === 1) {
      characterName = players[CONFIG.player.fabrissazzo].name;
    } else {
      characterName =
        this.battle.enemies[
          this.targetSelectionPointer - Object.values(players).length
        ].name;
    }

    const textX = posX + width / 2;
    const textY = startY - 10;
    ctx.textAlign = "center";
    ctx.fillText(characterName, textX, textY);
  }

  drawActionSelectionPointer() {
    const { x, y, padding, choices } = CONFIG.battle.actionBox;
    const firstChoiceY = y + CONFIG.battle.actionBox.choices.marginTop;
    ctx.strokeStyle = CONFIG.battle.actionBox.border.color;
    ctx.lineWidth = CONFIG.battle.actionBox.border.width;

    ctx.strokeRect(
      x + padding,
      firstChoiceY - 22.5 + choices.gap * this.actionPointer,
      200,
      30
    );
  }

  drawPointer() {
    if (this.currentPhase === CONFIG.battle.phases.selection) {
      this.drawActionSelectionPointer();
    } else if (this.currentPhase === CONFIG.battle.phases.option) {
    } else if (this.currentPhase === CONFIG.battle.phases.target) {
      this.drawTargetSelectionPointer();
    }
  }

  drawDialogueBox() {
    const { x, y, width, height, padding, fontSize, backgroundColor } =
      CONFIG.battle.actionBox;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);

    ctx.strokeStyle = CONFIG.battle.actionBox.border.color;
    ctx.lineWidth = CONFIG.battle.actionBox.border.width;
    ctx.strokeRect(x, y, width, height);

    ctx.textAlign = "left";
    ctx.fillStyle = CONFIG.typography.textColor;
    ctx.font = `${fontSize}px ${CONFIG.typography.fontFamily}`;

    if (this.turns[this.currentTurn].isPlayer) {
      switch (this.currentPhase) {
        case CONFIG.battle.phases.selection: {
          ctx.fillText(
            `È il turno di ${this.turns[this.currentTurn].entity.name}:`,
            x + padding,
            y + padding * 2
          );
          ctx.fillText(
            `Attacco`,
            x + 25,
            y + CONFIG.battle.actionBox.choices.marginTop
          );
          ctx.fillText(
            `Attacco Speciale`,
            x + 25,
            y +
              CONFIG.battle.actionBox.choices.marginTop +
              CONFIG.battle.actionBox.choices.gap
          );
          ctx.fillText(
            `Zaino`,
            x + 25,
            y +
              CONFIG.battle.actionBox.choices.marginTop +
              CONFIG.battle.actionBox.choices.gap * 2
          );
          break;
        }
      }
    } else {
    }
  }

  draw() {
    this.battle.background.draw();
    this.drawPlayers();
    this.drawEnemies();
    this.drawPlayersHealthBar();
    this.drawEnemiesHealthBar();
    this.drawDialogueBox();
    this.drawPointer();
  }

  moveTargetSelectionPointerRight() {
    this.targetSelectionPointer++;
    if (this.targetSelectionPointer >= this.battle.charactersQuantity) {
      this.targetSelectionPointer = 0;
    }
  }

  moveTargetSelectionPointerLeft() {
    this.targetSelectionPointer--;
    if (this.targetSelectionPointer < 0) {
      this.targetSelectionPointer = this.battle.charactersQuantity - 1;
    }
  }

  moveActionPointerUp() {
    this.actionPointer--;
    if (this.actionPointer < 0) {
      this.actionPointer = 3 - 1;
    }
  }

  moveDialoguePointerDown() {
    this.actionPointer++;
    if (this.actionPointer >= 3) {
      this.actionPointer = 0;
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

      ASSETS.soundEffects.choices.pause();
      ASSETS.soundEffects.choices.currentTime = 0;
      ASSETS.soundEffects.selection.pause();
      ASSETS.soundEffects.selection.currentTime = 0;

      if (this.currentPhase === CONFIG.battle.phases.selection) {
        switch (true) {
          case keyboard.isUp: {
            this.moveActionPointerUp();
            ASSETS.soundEffects.choices.play();
            break;
          }
          case keyboard.isDown: {
            this.moveDialoguePointerDown();
            ASSETS.soundEffects.choices.play();
            break;
          }
          case keyboard.isInteract: {
            // EVENTS.dialogue.entity.dialogueManager.selectChoice();
            ASSETS.soundEffects.selection.play();
            break;
          }
        }
      } else if (this.currentPhase === CONFIG.battle.phases.option) {
      } else if (this.currentPhase === CONFIG.battle.phases.target) {
        switch (true) {
          case keyboard.isLeft: {
            this.moveTargetSelectionPointerLeft();
            break;
          }
          case keyboard.isRight: {
            this.moveTargetSelectionPointerRight();
            break;
          }
          case keyboard.isInteract: {
            // EVENTS.dialogue.entity.dialogueManager.selectChoice();
            break;
          }
        }
      }

      return; // next interaction handling will be skipped
    }
  }

  handle(keyboard) {
    this.handlePointer(keyboard);
  }
}
