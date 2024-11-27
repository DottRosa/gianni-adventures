const ACTION_CHOICES = [
  {
    name: "Attacco",
    triggerPhase: CONFIG.battle.phases.attacksOptions,
  },
  {
    name: "Attacco speciale",
    triggerPhase: CONFIG.battle.phases.specialAttacksOptions,
  },
  {
    name: "Zaino",
    triggerPhase: CONFIG.battle.phases.bagOptions,
  },
  {
    name: "Passa il turno",
    triggerPhase: CONFIG.battle.phases.skipTurn,
  },
];

class BattleManager {
  targetSelectionPointer = 0;
  actionPointer = 0;
  specialAttackPointer = 0;
  interactionCooldown;
  currentTurn;
  currentPhase = CONFIG.battle.phases.selection;
  turns = [];
  lastKeyPressedId;
  maxItemsToDisplay = 0;

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

    players[CONFIG.player.gianni].currentDirection = CONFIG.directions.right;
    players[CONFIG.player.fabrissazzo].currentDirection =
      CONFIG.directions.right;

    players[CONFIG.player.gianni].position = {
      x: CONFIG.battle.arenaPaddingX,
      y: CONFIG.tile.canvasHeight / 2,
    };

    players[CONFIG.player.fabrissazzo].position = {
      x: CONFIG.battle.arenaPaddingX + CONFIG.battle.gapBetweenCharacters,
      y: CONFIG.tile.canvasHeight / 2,
    };

    for (var i = 0; i < this.battle.enemies.length; i++) {
      const posX =
        CONFIG.tile.canvasWidth - // the full width of the canvas
        CONFIG.battle.arenaPaddingX - // the padding of the arena
        this.battle.enemies[i].displayedWidth - // the width of the character, because it start to draw images from top-left corner
        CONFIG.battle.gapBetweenCharacters * i; // space between characters

      const posY = CONFIG.tile.canvasHeight / 2;

      this.battle.enemies[i].position = {
        x: posX,
        y: posY,
      };
    }

    this.maxItemsToDisplay = CONFIG.battle.actionBox.maxItemsToDisplay;

    // Avoid clicking on interaction when entering the battle
    this.interactionCooldown = Infinity;
    setTimeout(() => {
      this.interactionCooldown = 0;
    }, CONFIG.keyboard.interactionCooldown);

    // ASSETS.music.battle.play();
  }

  drawPlayers() {
    players[CONFIG.player.gianni].draw2();
    players[CONFIG.player.fabrissazzo].draw2();
  }

  drawEnemies() {
    this.battle.enemies.forEach((e) => e.draw2());
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
    const { entity: activeCharacter } = this.turns[this.currentTurn];
    const { padding, marginBottom, choices, width } = CONFIG.battle.actionBox;

    const x = activeCharacter.position.x;
    const y =
      activeCharacter.position.y -
      CONFIG.battle.actionBox.height -
      marginBottom;

    const firstChoiceY = y + padding * 2;
    ctx.strokeStyle = CONFIG.battle.actionBox.border.color;
    ctx.lineWidth = CONFIG.battle.actionBox.border.width;

    if (this.actionPointer >= this.maxItemsToDisplay) {
      ctx.strokeRect(
        x + padding / 2,
        firstChoiceY - 22.5 + choices.gap * 3,
        width - padding,
        30
      );
    } else {
      ctx.strokeRect(
        x + padding / 2,
        firstChoiceY - 22.5 + choices.gap * this.actionPointer,
        width - padding,
        30
      );
    }
  }

  drawPointer() {
    if (
      this.currentPhase === CONFIG.battle.phases.selection ||
      this.currentPhase === CONFIG.battle.phases.attacksOptions
    ) {
      this.drawActionSelectionPointer();
    } else if (this.currentPhase === CONFIG.battle.phases.target) {
      this.drawTargetSelectionPointer();
    }
  }

  drawActionBox() {
    const { entity: activeCharacter, isPlayer } = this.turns[this.currentTurn];
    const { padding, fontSize, marginBottom, shadow, backgroundColor } =
      CONFIG.battle.actionBox;

    const x = activeCharacter.position.x;
    const y =
      activeCharacter.position.y -
      CONFIG.battle.actionBox.height -
      marginBottom;

    applyShadow({
      ...shadow,
    });

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
      x,
      y,
      CONFIG.battle.actionBox.width,
      CONFIG.battle.actionBox.height
    );

    // Aggiungi il triangolo in basso
    ctx.beginPath(); // Inizia un nuovo percorso
    ctx.moveTo(x + 20, y + CONFIG.battle.actionBox.height); // Punto sinistro del triangolo
    ctx.lineTo(x + 40, y + CONFIG.battle.actionBox.height); // Punto destro del triangolo
    ctx.lineTo(x + 30, y + CONFIG.battle.actionBox.height + 20); // Punta del triangolo
    ctx.closePath(); // Chiude il triangolo

    ctx.fill(); // riempie il triangolo

    resetShadow();

    ctx.textAlign = CONFIG.typography.textAlign;
    ctx.fillStyle = CONFIG.typography.textColor;
    ctx.font = `${fontSize}px ${CONFIG.typography.fontFamily}`;

    if (this.turns[this.currentTurn].isPlayer) {
      switch (this.currentPhase) {
        case CONFIG.battle.phases.selection: {
          ACTION_CHOICES.forEach((choice, index) => {
            ctx.fillText(
              choice.name,
              x + padding,
              y + padding * 2 + index * CONFIG.battle.actionBox.choices.gap
            );
          });
          break;
        }
        case CONFIG.battle.phases.attacksOptions: {
          const attacks = this.turns[this.currentTurn].entity.attacks;

          for (var i = 0; i < attacks.length; i++) {
            if (
              this.actionPointer < this.maxItemsToDisplay &&
              i >= 0 &&
              i < this.maxItemsToDisplay
            ) {
              ctx.fillText(
                `${i + 1}. ${attacks[i].name}`, // Mostra l'indice reale (1-based)
                x + padding,
                y + padding * 2 + i * CONFIG.battle.actionBox.choices.gap
              );
            }

            if (
              this.actionPointer >= this.maxItemsToDisplay &&
              i >= this.actionPointer - (this.maxItemsToDisplay - 1) &&
              i < this.actionPointer + 1
            ) {
              ctx.fillText(
                `${i + 1}. ${attacks[i].name}`, // Mostra l'indice reale (1-based)
                x + padding,
                y +
                  padding * 2 +
                  (i - (this.actionPointer - (this.maxItemsToDisplay - 1))) *
                    CONFIG.battle.actionBox.choices.gap
              );
            }
          }
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
    this.drawActionBox();
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
    let max = 0;
    if (this.currentPhase === CONFIG.battle.phases.selection) {
      max = ACTION_CHOICES.length - 1;
    }
    if (this.currentPhase === CONFIG.battle.phases.attacksOptions) {
      max = this.turns[this.currentTurn].entity.attacks.length - 1;
    }
    this.actionPointer--;
    if (this.actionPointer < 0) {
      this.actionPointer = max;
    }
  }

  moveActionPointerDown() {
    let max = 0;
    if (this.currentPhase === CONFIG.battle.phases.selection) {
      max = ACTION_CHOICES.length;
    }
    if (this.currentPhase === CONFIG.battle.phases.attacksOptions) {
      max = this.turns[this.currentTurn].entity.attacks.length;
    }
    this.actionPointer++;
    if (this.actionPointer >= max) {
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

      if (
        this.currentPhase === CONFIG.battle.phases.selection ||
        this.currentPhase === CONFIG.battle.phases.attacksOptions
      ) {
        switch (true) {
          case keyboard.isUp: {
            this.moveActionPointerUp();
            ASSETS.soundEffects.choices.play();
            break;
          }
          case keyboard.isDown: {
            this.moveActionPointerDown();
            ASSETS.soundEffects.choices.play();
            break;
          }
          case keyboard.isInteract: {
            this.currentPhase = ACTION_CHOICES[this.actionPointer].triggerPhase;
            this.actionPointer = 0; // resetto per usarlo per il submenu
            ASSETS.soundEffects.selection.play();
            break;
          }
          case keyboard.isCancel: {
            if (this.currentPhase === CONFIG.battle.phases.attacksOptions) {
              this.currentPhase = CONFIG.battle.phases.selection;
              this.actionPointer = 0; // resetto per usarlo per il submenu
              ASSETS.soundEffects.cancel.play();
            }
            break;
          }
        }
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
