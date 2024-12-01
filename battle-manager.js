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
    triggerPhase: CONFIG.battle.phases.backpackOptions,
  },
  {
    name: "Passa il turno",
    triggerPhase: CONFIG.battle.phases.skipTurn,
  },
];

class BattleManager {
  targetPointer = 0;
  actionPointer = 0;
  interactionCooldown;
  attackAnimationCooldown = 0;
  currentTurn;
  currentAttack;
  attackAnimationEnded = false;
  targetAllowedValues = [];
  turns = [];
  lastKeyPressedId;
  maxItemsToDisplay = 0;
  phasesHistory = [CONFIG.battle.phases.selection];

  constructor(battle) {
    this.battle = battle;
  }

  init() {
    // Calculate turns
    const turns = [
      {
        isPlayer: true,
        entity: players[CONFIG.player.gianni],
        originalIndex: 0,
      },
      {
        isPlayer: true,
        entity: players[CONFIG.player.fabrissazzo],
        originalIndex: 1,
      },
    ];

    this.battle.enemies.forEach((enemy, index) => {
      turns.push({
        isPlayer: false,
        entity: enemy,
        originalIndex: index + 2,
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
        CONFIG.battle.gapBetweenCharacters *
          (this.battle.enemies.length - 1 - i); // si parte dalla posizione piu a sinistra possibile

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
    players[CONFIG.player.gianni].drawFixed();
    players[CONFIG.player.fabrissazzo].drawFixed();
  }

  drawEnemies() {
    this.battle.enemies.forEach((e) => e.drawFixed());
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
      let y =
        CONFIG.tile.canvasHeight -
        CONFIG.battle.arenaPaddingY -
        height -
        verticalGap;
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

      // Disegno dei pallini della stamina
      const staminaY = y + height + 10; // Posizione Y dei pallini
      let staminaX = x; // Posizione iniziale X dei pallini
      for (let i = 0; i < character.characterBattleStats.currentStamina; i++) {
        drawBullet({
          x:
            staminaX +
            CONFIG.battle.healthBar.stamina.radius +
            (CONFIG.battle.healthBar.stamina.radius * 2 +
              CONFIG.battle.healthBar.stamina.gap) *
              i,
          y: staminaY,
          radius: CONFIG.battle.healthBar.stamina.radius,
          startAngle: 0,
          endAngle: Math.PI * 2,
          color: CONFIG.battle.healthBar.stamina.color,
        });
      }

      verticalGap -= 50;
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

  drawTargetPointer() {
    const { battle, tile, player } = CONFIG;
    const { pointer } = battle;
    const width = pointer.width;
    const height = pointer.height;
    const startY = tile.canvasHeight / 2 + height * 4;

    const getPlayerPosX = (index) =>
      battle.arenaPaddingX +
      players[player.gianni].displayedWidth / 4 +
      battle.gapBetweenCharacters * index +
      width / 4;

    const getEnemyPosX = (index) =>
      tile.canvasWidth -
      battle.arenaPaddingX -
      this.battle.enemies[0].displayedWidth / 2 -
      battle.gapBetweenCharacters +
      index * battle.gapBetweenCharacters -
      width / 4;

    const drawArrow = (posX, posY) => {
      ctx.beginPath();
      ctx.moveTo(posX, posY + height); // Base sinistra
      ctx.lineTo(posX + width / 2, posY); // Vertice superiore
      ctx.lineTo(posX + width, posY + height); // Base destra
      ctx.strokeStyle = pointer.border.color;
      ctx.lineWidth = pointer.border.width;
      ctx.stroke();
    };

    const drawCharacterName = (posX, posY, name) => {
      ctx.textAlign = "center";
      ctx.fillText(name, posX + width / 2, posY + height + 20);
    };

    if (this.currentAttack.targetAll) {
      Object.values(players).forEach((_, index) => {
        drawArrow(getPlayerPosX(index), startY);
      });
      this.battle.enemies.forEach((_, index) => {
        drawArrow(getEnemyPosX(index), startY);
      });
    } else if (this.currentAttack.targetAllEnemies) {
      this.battle.enemies.forEach((_, index) => {
        drawArrow(getEnemyPosX(index), startY);
      });
    } else if (this.currentAttack.targetAllPlayers) {
      Object.values(players).forEach((_, index) => {
        drawArrow(getPlayerPosX(index), startY);
      });
    } else {
      const targetIndex = this.targetAllowedValues[this.targetPointer];
      const isPlayer = targetIndex < Object.values(players).length;

      const posX = isPlayer
        ? getPlayerPosX(targetIndex)
        : getEnemyPosX(targetIndex - Object.values(players).length);

      drawArrow(posX, startY);

      const characterName = isPlayer
        ? Object.values(players)[targetIndex].name
        : this.battle.enemies[targetIndex - Object.values(players).length].name;

      drawCharacterName(posX, startY, characterName);
    }
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
      this.isPlayerTurn &&
      (this.phaseIsSelection ||
        this.phaseIsAttacksOptions ||
        this.phaseIsSpecialAttacksOptions ||
        this.phaseIsBackpackOptions)
    ) {
      this.drawActionSelectionPointer();
    } else if (this.phaseIsTarget) {
      this.drawTargetPointer();
    }
  }

  drawActionBox() {
    const { entity: activeCharacter } = this.turns[this.currentTurn];
    const {
      padding,
      fontSize,
      marginBottom,
      shadow,
      backgroundColor,
      width,
      height,
    } = CONFIG.battle.actionBox;

    const enemyDrift = this.isPlayerTurn
      ? 0
      : width - this.battle.enemies[0].displayedWidth - padding;
    const x = activeCharacter.position.x - enemyDrift;
    const y =
      activeCharacter.position.y -
      CONFIG.battle.actionBox.height -
      marginBottom;

    applyShadow({
      ...shadow,
    });

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, width, height);

    // Aggiungi il triangolo in basso
    ctx.beginPath(); // Inizia un nuovo percorso
    ctx.moveTo(x + enemyDrift + 20, y + CONFIG.battle.actionBox.height); // Punto sinistro del triangolo
    ctx.lineTo(x + enemyDrift + 40, y + CONFIG.battle.actionBox.height); // Punto destro del triangolo
    ctx.lineTo(x + enemyDrift + 30, y + CONFIG.battle.actionBox.height + 20); // Punta del triangolo
    ctx.closePath(); // Chiude il triangolo

    ctx.fill(); // riempie il triangolo

    resetShadow();

    ctx.textAlign = CONFIG.typography.textAlign;
    ctx.fillStyle = CONFIG.typography.textColor;
    ctx.font = `${fontSize}px ${CONFIG.typography.fontFamily}`;

    if (this.isPlayerTurn) {
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
        case CONFIG.battle.phases.attacksOptions:
        case CONFIG.battle.phases.specialAttacksOptions:
        case CONFIG.battle.phases.backpackOptions: {
          let options = [];
          if (this.phaseIsAttacksOptions) {
            options = this.currentCharacter.freeAttacks;
          } else if (this.phaseIsSpecialAttacksOptions) {
            options = this.currentCharacter.costAttacks;
          } else if (this.phaseIsBackpackOptions) {
            options = backpack.itemsList;
          }

          if (options.length === 0) {
            ctx.fillText(
              `Nessun elemento da mostrare`, // Mostra l'indice reale (1-based)
              x + padding,
              y + padding * 2
            );
          }

          for (var i = 0; i < options.length; i++) {
            let details = ``;
            if (this.phaseIsAttacksOptions) {
              details = `${options[i].damage}`;
            } else if (this.phaseIsSpecialAttacksOptions) {
              details = `${options[i].damage}/${options[i].cost}`;
            } else if (this.phaseIsBackpackOptions) {
              details = `x${options[i].quantity}`;
            }

            if (
              this.actionPointer < this.maxItemsToDisplay &&
              i >= 0 &&
              i < this.maxItemsToDisplay
            ) {
              ctx.fillText(
                `${i + 1}. ${options[i].name}`, // Mostra l'indice reale (1-based)
                x + padding,
                y + padding * 2 + i * CONFIG.battle.actionBox.choices.gap
              );
              ctx.fillText(
                details,
                x - padding + width - textWidth(details) - 7,
                y + padding * 2 + i * CONFIG.battle.actionBox.choices.gap
              );
            }

            if (
              this.actionPointer >= this.maxItemsToDisplay &&
              i >= this.actionPointer - (this.maxItemsToDisplay - 1) &&
              i < this.actionPointer + 1
            ) {
              ctx.fillText(
                `${i + 1}. ${options[i].name}`, // Mostra l'indice reale (1-based)
                x + padding,
                y +
                  padding * 2 +
                  (i - (this.actionPointer - (this.maxItemsToDisplay - 1))) *
                    CONFIG.battle.actionBox.choices.gap
              );
              ctx.fillText(
                details,
                x - padding + width - textWidth(details) - 7,
                y +
                  padding * 2 +
                  (i - (this.actionPointer - (this.maxItemsToDisplay - 1))) *
                    CONFIG.battle.actionBox.choices.gap
              );
            }
          }
          break;
        }
        case CONFIG.battle.phases.target: {
          const wrappedDescription = wrapText(
            this.currentAttack.description,
            width - padding * 2
          );

          ctx.fillText(this.currentAttack.name, x + padding, y + padding * 2);

          wrappedDescription.forEach((line, index) => {
            ctx.fillText(line, x + padding, y + padding * 3 + index * 20);
          });

          break;
        }
      }
    } else {
    }
  }

  /**
   * Draw the animation of an attack
   */
  drawAttack() {
    if (this.currentPhase !== CONFIG.battle.phases.performAttack) {
      return;
    }

    const index = this.targetAllowedValues[this.targetPointer];
    const turn = this.turns.find((turn) => turn.originalIndex === index);

    let gifX = turn.entity.position.x;
    let gifY = turn.entity.position.y;

    const propagations = [];
    const playersPropagation = {
      quantity: Object.values(players).length - 1,
      amount: CONFIG.battle.gapBetweenCharacters,
      startX: players[CONFIG.player.gianni].position.x,
      startY: players[CONFIG.player.gianni].position.y,
    };
    const enemiesPropagation = {
      quantity: this.battle.enemies.length - 1,
      amount: CONFIG.battle.gapBetweenCharacters,
      startX: this.battle.enemies[0].position.x,
      startY: this.battle.enemies[0].position.y,
    };

    if (this.currentAttack.targetAll) {
      propagations.push(playersPropagation, enemiesPropagation);
    } else if (this.currentAttack.targetAllPlayers) {
      propagations.push(playersPropagation);
    } else if (this.currentAttack.targetAllEnemies) {
      propagations.push(enemiesPropagation);
    }

    this.currentAttack.animate(gifX, gifY, propagations);

    if (this.currentAttack.animationIsFinished()) {
      this.currentFrame = 0;
      this.attackAnimationEnded = true;
      this.currentAttack.resetAnimation();
    }
  }

  drawTurns() {
    const { radius, backgroundColor, currentTurnBackgroundColor, gap } =
      CONFIG.battle.turns;

    const boxWidth = (radius * 2 + gap) * this.turns.length - gap - gap / 3;

    let x =
      CONFIG.tile.canvasWidth - CONFIG.tile.canvasWidth / 2 - boxWidth / 2;
    let y = CONFIG.battle.arenaPaddingY;
    this.turns.forEach((turn, index) => {
      ctx.beginPath();
      ctx.arc(x + 25, y + 50, radius, 0, 2 * Math.PI); // Centra il cerchio
      ctx.fillStyle =
        this.currentTurn === index
          ? currentTurnBackgroundColor
          : backgroundColor; // Sfondo bianco
      ctx.fill(); // Riempi il cerchio

      ctx.lineWidth = 2;
      ctx.stroke(); // Disegna il contorno

      // Disegna l'icona
      turn.entity.drawIcon(x, y);

      x += radius * 2 + gap; // Sposta la posizione
    });

    const turnString = `È il turno di ${this.currentCharacter.name}`;
    const textBoxWidth = textWidth(turnString);
    x = CONFIG.tile.canvasWidth / 2 + textBoxWidth / 2;
    y = CONFIG.battle.arenaPaddingY * 2.5 + radius * 2;
    ctx.fillStyle = CONFIG.typography.textColor;
    ctx.fillText(turnString, x, y);
  }

  draw() {
    this.battle.background.draw();
    this.drawPlayers();
    this.drawEnemies();
    this.drawPlayersHealthBar();
    this.drawEnemiesHealthBar();
    this.drawTurns();
    this.drawActionBox();
    this.drawPointer();
    this.drawAttack();
  }

  moveTargetPointerRight() {
    this.targetPointer++;
    if (this.targetPointer >= this.targetAllowedValues.length) {
      this.targetPointer = 0;
    }
  }

  moveTargetPointerLeft() {
    this.targetPointer--;
    if (this.targetPointer < 0) {
      this.targetPointer = this.targetAllowedValues.length - 1;
    }
  }

  moveActionPointerUp() {
    let max = 0;
    if (this.phaseIsSelection) {
      max = ACTION_CHOICES.length - 1;
    }
    if (this.phaseIsAttacksOptions) {
      max = this.currentCharacter.freeAttacks.length - 1;
    }
    if (this.phaseIsSpecialAttacksOptions) {
      max = this.currentCharacter.costAttacks.length - 1;
    }
    if (this.phaseIsBackpackOptions) {
      max = backpack.itemsList.length - 1;
    }
    this.actionPointer--;
    if (this.actionPointer < 0) {
      this.actionPointer = max;
    }
  }

  moveActionPointerDown() {
    let max = 0;
    if (this.phaseIsSelection) {
      max = ACTION_CHOICES.length;
    }
    if (this.phaseIsAttacksOptions) {
      max = this.currentCharacter.freeAttacks.length;
    }
    if (this.phaseIsSpecialAttacksOptions) {
      max = this.currentCharacter.costAttacks.length;
    }
    if (this.phaseIsBackpackOptions) {
      max = backpack.itemsList.length;
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

      if (this.phaseIsSelection) {
        this.handleSelectionPhase();
        return;
      }

      if (this.phaseIsAttacksOptions) {
        this.handleAttacksOptionsPhase();
        return;
      }

      if (this.phaseIsSpecialAttacksOptions) {
        this.handleSpecialAttacksOptionsPhase();
        return;
      }

      if (this.phaseIsBackpackOptions) {
        this.handleBackpackOptionsPhase();
        return;
      }

      if (this.phaseIsTarget) {
        this.handleTargetPhase();
        return;
      }
    }
  }

  handleSelectionPhase() {
    switch (true) {
      case keyboard.isInteract: {
        this.nextPhase();
        this.actionPointer = 0; // resetto per usarlo per il submenu
        ASSETS.soundEffects.selection.play();
        return;
      }
    }
    this.handleActionPointer();
  }

  setTargetAllowedValues() {
    const targetAllowedValues = [];
    if (this.currentAttack.targetAll) {
      targetAllowedValues.push(0, 1);
      for (var i = 0; i < this.battle.enemies.length; i++) {
        targetAllowedValues.push(i + 2);
      }
    }

    if (this.currentAttack.targetAllPlayers) {
      targetAllowedValues.push(0, 1);
    }
    if (this.currentAttack.targetSelf) {
      targetAllowedValues.push(this.turns[this.currentTurn].originalIndex);
    }
    if (this.currentAttack.targetAlly) {
      const index = Math.abs(this.turns[this.currentTurn].originalIndex - 1);
      targetAllowedValues.push(index);
    }

    if (this.currentAttack.targetEnemy || this.currentAttack.targetAllEnemies) {
      for (var i = 0; i < this.battle.enemies.length; i++) {
        targetAllowedValues.push(i + 2);
      }
    }

    this.targetAllowedValues = targetAllowedValues;
  }

  handleAttacksOptionsPhase() {
    switch (true) {
      case keyboard.isInteract: {
        this.nextPhase();
        this.currentAttack =
          this.currentCharacter.freeAttacks[this.actionPointer];

        this.setTargetAllowedValues();

        this.targetPointer = 0;
        ASSETS.soundEffects.selection.play();
        return;
      }
    }
    this.handleActionPointer();
    this.handleCancelAsBack();
  }

  handleSpecialAttacksOptionsPhase() {
    switch (true) {
      case keyboard.isInteract: {
        this.nextPhase();
        this.currentAttack =
          this.currentCharacter.costAttacks[this.actionPointer];

        this.setTargetAllowedValues();

        this.targetPointer = 0;
        ASSETS.soundEffects.selection.play();
        return;
      }
    }
    this.handleActionPointer();
    this.handleCancelAsBack();
  }

  handleBackpackOptionsPhase() {
    switch (true) {
      case keyboard.isInteract: {
        this.nextPhase();
        this.currentAttack = backpack.itemsList[this.actionPointer].attack;

        this.setTargetAllowedValues();

        this.targetPointer = 0;
        ASSETS.soundEffects.selection.play();
        return;
      }
    }
    this.handleActionPointer();
    this.handleCancelAsBack();
  }

  handleTargetPhase() {
    switch (true) {
      case keyboard.isLeft: {
        this.moveTargetPointerLeft();
        return;
      }
      case keyboard.isRight: {
        this.moveTargetPointerRight();
        return;
      }
      case keyboard.isInteract: {
        this.nextPhase();
        ASSETS.soundEffects.selection.play();
        return;
      }
      case keyboard.isCancel: {
        this.prevPhase();
        this.targetPointer = 0;
        ASSETS.soundEffects.cancel.play();
        return;
      }
    }
  }

  /**
   * Gestisce il puntatore nelle fasi di selezione. Funziona sia per il menu principale,
   * che per la selezione di attacchi, attacchi speciali ed oggetti
   */
  handleActionPointer() {
    switch (true) {
      case keyboard.isUp: {
        this.moveActionPointerUp();
        ASSETS.soundEffects.choices.play();
        return;
      }
      case keyboard.isDown: {
        this.moveActionPointerDown();
        ASSETS.soundEffects.choices.play();
        return;
      }
    }
  }

  /**
   * Gestisce il tornare indietro dalle fasi di attacco, attacco speciale, zaino e target
   */
  handleCancelAsBack() {
    switch (true) {
      case keyboard.isCancel: {
        this.prevPhase();
        this.actionPointer = 0; // resetto per usarlo per il submenu
        ASSETS.soundEffects.cancel.play();
        return;
      }
    }
  }

  get currentCharacter() {
    return this.turns[this.currentTurn].entity;
  }

  get currentPhase() {
    return this.phasesHistory[this.phasesHistory.length - 1];
  }

  get phaseIsSelection() {
    return this.currentPhase === CONFIG.battle.phases.selection;
  }

  get phaseIsAttacksOptions() {
    return this.currentPhase === CONFIG.battle.phases.attacksOptions;
  }

  get phaseIsSpecialAttacksOptions() {
    return this.currentPhase === CONFIG.battle.phases.specialAttacksOptions;
  }

  get phaseIsBackpackOptions() {
    return this.currentPhase === CONFIG.battle.phases.backpackOptions;
  }

  get phaseIsTarget() {
    return this.currentPhase === CONFIG.battle.phases.target;
  }

  get isPlayerTurn() {
    return this.turns[this.currentTurn].isPlayer;
  }

  resetCurrentPhase() {
    this.phasesHistory = [CONFIG.battle.phases.selection];
  }

  prevPhase() {
    this.phasesHistory = this.phasesHistory.slice(0, -1);
  }

  nextPhase() {
    switch (this.currentPhase) {
      case CONFIG.battle.phases.selection: {
        this.phasesHistory.push(
          ACTION_CHOICES[this.actionPointer].triggerPhase
        );
        if (this.currentPhase === CONFIG.battle.phases.skipTurn) {
          this.startNextTurn();
        }
        return;
      }
      case CONFIG.battle.phases.attacksOptions:
      case CONFIG.battle.phases.specialAttacksOptions:
      case CONFIG.battle.phases.backpackOptions: {
        this.phasesHistory.push(CONFIG.battle.phases.target);
        return;
      }
      case CONFIG.battle.phases.target: {
        this.phasesHistory.push(CONFIG.battle.phases.performAttack);
        return;
      }
    }
  }

  startNextTurn() {
    this.resetCurrentPhase();
    this.targetPointer = 0;
    this.actionPointer = 0;
    this.currentTurn++;
    if (this.currentTurn >= this.turns.length) {
      this.currentTurn = 0;
    }
  }

  handleAttack() {
    if (
      this.currentPhase === CONFIG.battle.phases.performAttack &&
      this.attackAnimationEnded
    ) {
      const { entity: activeCharacter } = this.turns[this.currentTurn];
      let targets = [];

      ASSETS.soundEffects.damage.play();
      if (this.currentAttack.targetAll) {
        targets.push(...this.battle.enemies);
        targets.push(...Object.values(players));
      } else if (this.currentAttack.targetAllEnemies) {
        targets = this.battle.enemies;
      } else if (this.currentAttack.targetEnemy) {
        const entity = this.battle.enemies[this.targetPointer];
        targets = [entity];
      } else if (this.currentAttack.targetAllPlayers) {
        targets = Object.values(players);
      } else {
        const targetPlayer =
          this.targetAllowedValues[this.targetPointer] === 0
            ? players[CONFIG.player.gianni]
            : players[CONFIG.player.fabrissazzo];

        targets = [targetPlayer];
      }

      if (this.currentAttack.hasCost) {
        activeCharacter.characterBattleStats.dealStaminaUsage(
          this.currentAttack.cost
        );
      }

      this.currentAttack.effect({
        performer: activeCharacter,
        players,
        targets,
      });

      this.resetCurrentPhase();
      this.startNextTurn();
      this.actionPointer = 0;
      this.targetPointer = 0;
      this.attackAnimationEnded = false;
    }
  }

  handle(keyboard) {
    this.handlePointer(keyboard);
    this.handleAttack();
  }
}
