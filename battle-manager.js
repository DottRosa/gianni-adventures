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
  // Puntatore che indica il target dell'attacco
  targetPointer = 0;
  // Puntatore che indica l'azione scelta nell'action box
  actionPointer = 0;
  // Cooldown dell'interazione dei tasti della tastiera
  interactionCooldown;
  // Numero che rappresenta il turno in corso
  currentTurn;
  // Rappresenta l'attacco di questo turno
  currentAttack;
  // Indica che l'animazione dell'attacco è terminata
  attackAnimationEnded = false;
  // Contiene la lista dei target selezionabili durante l'attacco
  selectableTargets = [];
  // I turni di gioco. Ogni turno contiene il giocatore
  turns = [];
  // L'ultimo tasto premuto nella tastiera
  lastKeyPressedId;
  // Lista delle fasi compiute. L'ultima è quella in atto. Serve a poter tornare indietro
  phasesHistory = [CONFIG.battle.phases.selection];
  // Gli attaccanti del turno
  attackers = [];
  // I difensori del turno
  defenders = [];

  battleEnd = false;

  constructor(battle) {
    this.battle = battle;
  }

  buildTurns() {
    const turns = [
      players[CONFIG.player.gianni],
      players[CONFIG.player.fabrissazzo],
    ];

    this.battle.enemies.forEach((enemy) => {
      turns.push(enemy);
    });

    turns.sort((a, b) => {
      return a.stats.currentVelocity > b.stats.currentVelocity ? -1 : 1;
    });

    return turns;
  }

  /**
   * Da invocare prima dell'inizio della battaglia. Istanzia tutte le variabili
   * e prepara tutti i valori necessari ai fini della battaglia.
   */
  init() {
    // Calculate turns
    const turns = [];
    for (var i = 0; i < 50; i++) {
      turns.push(...this.buildTurns());
    }

    this.turns = turns;
    this.currentTurn = 0;
    this.handleAttackersAndDefenders();

    const { horizontalGap, width, areaPaddingX } = CONFIG.battle.healthBar;

    Object.keys(players).forEach((key, index) => {
      players[key].currentDirection = CONFIG.directions.right;
      players[key].battlePosition = {
        x: areaPaddingX + width / 2 + horizontalGap * index,
        y: CONFIG.tile.canvasHeight / 2,
      };
    });

    for (var i = 0; i < this.battle.enemies.length; i++) {
      const posX =
        CONFIG.tile.canvasWidth - areaPaddingX / 2 - width - horizontalGap * i;

      const posY = CONFIG.tile.canvasHeight / 2;

      this.battle.enemies[this.battle.enemies.length - 1 - i].battlePosition = {
        x: posX,
        y: posY,
      };
    }

    // Avoid clicking on interaction when entering the battle
    this.interactionCooldown = Infinity;
    setTimeout(() => {
      this.interactionCooldown = 0;
    }, CONFIG.keyboard.interactionCooldown);

    // ASSETS.music.battle.play();
  }

  /**
   * Valorizza gli attaccanti e i difensori in base al personaggio che sta giocando in questo momento.
   * Se il personaggio attivo è un giocatore, allora gli attaccanti saranno i giocatori ed i
   * difensori saranno i nemici, altrimenti viceversa.
   */
  handleAttackersAndDefenders() {
    if (this.isPlayerTurn) {
      this.attackers = [...Object.values(players)];
      this.defenders = [...this.battle.enemies];
    } else {
      this.attackers = [...this.battle.enemies];
      this.defenders = [...Object.values(players)];
    }
  }

  drawCharacters() {
    [...this.attackers, ...this.defenders].forEach((character) => {
      character.drawBattle(character.isDefeated);
    });
  }

  drawCharacterCard(characters, isEnemy = false) {
    const {
      horizontalGap,
      width,
      height,
      areaPaddingX,
      statBarGap,
      ranges,
      statsVerticalGap,
    } = CONFIG.battle.healthBar;

    let x = areaPaddingX;

    if (isEnemy) {
      x = CONFIG.tile.canvasWidth - areaPaddingX / 2 - horizontalGap * 3;
    }

    let y = CONFIG.tile.canvasHeight - CONFIG.battle.arenaPaddingY - 150;

    function drawStatBar(x, y, character, type = "health") {
      let statLabel = "HP";
      if (type === "stamina") {
        statLabel = "ST";
      }
      // Testo della statistica
      ctx.fillStyle = "black";
      ctx.textAlign = CONFIG.battle.healthBar.textAlign;
      ctx.fillText(statLabel, x, y);

      let percent = character.stats.currentHealth / character.stats.health;
      if (type === "stamina") {
        percent = character.stats.currentStamina / character.stats.stamina;
      }
      // Calcolo il colore della barra in base alla vita corrente
      let barColor;

      if (type === "health") {
        if (percent > ranges.high.threshold) {
          barColor = ranges.high.color;
        } else if (percent > ranges.medium.threshold) {
          barColor = ranges.medium.color;
        } else {
          barColor = ranges.low.color;
        }
      } else {
        barColor = CONFIG.battle.healthBar.stamina.color;
      }

      // Disegno la barra della vita
      const barX = x + statBarGap;
      const barY = y - height;

      ctx.strokeStyle = CONFIG.battle.healthBar.border.color;
      ctx.lineWidth = CONFIG.battle.healthBar.border.width;
      ctx.strokeRect(barX, barY, width, height);
      ctx.fillStyle = barColor;
      ctx.fillRect(barX, barY, width * percent, height);

      // Testo della vita
      ctx.textAlign = "right";
      ctx.fillStyle = CONFIG.typography.textColor;
      ctx.fillStyle = "white"; // Colore del riempimento del testo
      ctx.strokeStyle = "black"; // Colore del contorno
      ctx.lineWidth = 3; // Spessore del contorno

      const textX = barX + width;
      const textY = y - height / 2 - CONFIG.battle.healthBar.fontSize / 4;

      const statText =
        type === "health"
          ? `${character.stats.currentHealth}/${character.stats.health}`
          : `${character.stats.currentStamina}/${character.stats.stamina}`;

      ctx.strokeText(statText, textX, textY);
      ctx.fillText(statText, textX, textY);
    }

    function drawStatusEffect(x, y, character) {
      if (character.stats.hasStatusEffect) {
        ctx.fillStyle = CONFIG.typography.textColor;
        ctx.font = `${CONFIG.battle.healthBar.fontSize}px ${CONFIG.typography.fontFamily}`;
        ctx.textAlign = CONFIG.battle.healthBar.textAlign;
        ctx.fillText(character.stats.currentStatusEffect.name, x, y);
      }
    }

    characters.forEach((character) => {
      ctx.fillStyle = CONFIG.typography.textColor;
      ctx.font = `${CONFIG.battle.healthBar.fontSize}px ${CONFIG.typography.fontFamily}`;
      // ctx.textAlign = CONFIG.battle.healthBar.textAlign;
      ctx.textAlign = "left";

      ctx.fillText(character.name, x, y);

      ctx.textAlign = CONFIG.battle.healthBar.textAlign;

      drawStatBar(x, y + statsVerticalGap, character, "health");
      drawStatBar(x, y + statsVerticalGap * 2, character, "stamina");
      drawStatusEffect(x + statBarGap, y + statsVerticalGap * 3, character);

      x += horizontalGap;
    });
  }

  drawPlayersHealthBar() {
    const list = [];
    Object.keys(players).forEach((key) => {
      list.push(players[key]);
    });

    this.drawCharacterCard(list);
  }

  drawEnemiesHealthBar() {
    // Non posso fare qui il ciclo perchè i blocchi vanno disegnati uno in parte all'altro
    this.drawCharacterCard(this.battle.enemies, true);
  }

  drawTargetPointer() {
    const { battle, tile, player } = CONFIG;
    const { pointer } = battle;
    const width = pointer.width;
    const height = pointer.height;
    const startY = tile.canvasHeight / 2 + height * 4;

    const drawCircle = (posX, posY) => {
      posX += players[player.gianni].displayedWidth / 2;
      posY -= height * 2; // Posizionare il cerchio sopra al personaggio

      ctx.beginPath();
      ctx.arc(posX, posY, 50, 0, 2 * Math.PI);
      ctx.strokeStyle = pointer.border.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    this.getTargets().forEach((target) => {
      drawCircle(target.battlePosition.x, startY);
    });
  }

  drawActionSelectionPointer() {
    const { padding, marginBottom, choices, width } = CONFIG.battle.actionBox;

    const x = this.currentCharacter.battlePosition.x;
    const y =
      this.currentCharacter.battlePosition.y -
      CONFIG.battle.actionBox.height -
      marginBottom;

    const firstChoiceY = y + padding * 2;
    ctx.strokeStyle = CONFIG.battle.actionBox.border.color;
    ctx.lineWidth = CONFIG.battle.actionBox.border.width;

    if (this.actionPointer >= CONFIG.battle.actionBox.maxItemsToDisplay) {
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
    const x = this.currentCharacter.battlePosition.x - enemyDrift;
    const y =
      this.currentCharacter.battlePosition.y -
      CONFIG.battle.actionBox.height -
      marginBottom;

    applyShadow({
      ...shadow,
    });

    ctx.fillStyle = backgroundColor;
    drawRoundedRect(ctx, x, y, width, height, 25);

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

    const drawTargetPhase = (x, y) => {
      const wrappedDescription = wrapText(
        this.currentAttack.description,
        width - padding * 2
      );

      ctx.font = `bold ${fontSize}px ${CONFIG.typography.fontFamily}`;
      ctx.fillText(this.currentAttack.name, x + padding, y + padding * 2);

      ctx.font = `${fontSize}px ${CONFIG.typography.fontFamily}`;
      wrappedDescription.forEach((line, index) => {
        ctx.fillText(line, x + padding, y + padding * 4 + index * 20);
      });

      ctx.beginPath(); // Inizia un nuovo percorso di disegno
      ctx.moveTo(x + padding, height * 2 - padding * 1.8); // Punto di partenza
      ctx.lineTo(x - padding + width, height * 2 - padding * 1.8); // Punto finale
      ctx.strokeStyle = "blue"; // Colore della linea
      ctx.lineWidth = 1; // Spessore della linea
      ctx.stroke(); // Traccia la linea
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();

      const damage = `Danni: ${this.currentAttack.damage}`;

      ctx.fillText(
        `Danni: ${this.currentCharacter.getAttackDamage(this.currentAttack)}`,
        x + padding,
        height * 2 - padding / 2
      );

      ctx.fillText(
        `Stamina: ${this.currentAttack.cost}`,
        x + padding * 2 + textWidth(damage),
        height * 2 - padding / 2
      );
    };

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

          if (!options || options.length === 0) {
            ctx.fillText(
              `Nessun elemento da mostrare`,
              x + padding,
              y + padding * 2
            );
          }

          for (var i = 0; i < options.length; i++) {
            let details = ``;
            let disabled = false;
            let disabledY = 0;

            if (this.phaseIsAttacksOptions) {
              details = `${this.currentCharacter.getAttackDamage(options[i])}`;
            } else if (this.phaseIsSpecialAttacksOptions) {
              details = `${this.currentCharacter.getAttackDamage(options[i])}/${
                options[i].cost
              }`;
              disabled =
                options[i].cost > this.currentCharacter.stats.currentStamina;
            } else if (this.phaseIsBackpackOptions) {
              details = `x${options[i].quantity}`;
            }

            if (
              this.actionPointer < CONFIG.battle.actionBox.maxItemsToDisplay &&
              i >= 0 &&
              i < CONFIG.battle.actionBox.maxItemsToDisplay
            ) {
              ctx.fillText(
                `${i + 1}. ${options[i].name}`,
                x + padding,
                y + padding * 2 + i * CONFIG.battle.actionBox.choices.gap
              );
              ctx.fillText(
                details,
                x - padding + width - textWidth(details) - 7,
                y + padding * 2 + i * CONFIG.battle.actionBox.choices.gap
              );
              disabledY =
                y + padding * 2 + i * CONFIG.battle.actionBox.choices.gap;
            }

            if (
              this.actionPointer >= CONFIG.battle.actionBox.maxItemsToDisplay &&
              i >=
                this.actionPointer -
                  (CONFIG.battle.actionBox.maxItemsToDisplay - 1) &&
              i < this.actionPointer + 1
            ) {
              ctx.fillText(
                `${i + 1}. ${options[i].name}`, // Mostra l'indice reale (1-based)
                x + padding,
                y +
                  padding * 2 +
                  (i -
                    (this.actionPointer -
                      (CONFIG.battle.actionBox.maxItemsToDisplay - 1))) *
                    CONFIG.battle.actionBox.choices.gap
              );
              ctx.fillText(
                details,
                x - padding + width - textWidth(details) - 7,
                y +
                  padding * 2 +
                  (i -
                    (this.actionPointer -
                      (CONFIG.battle.actionBox.maxItemsToDisplay - 1))) *
                    CONFIG.battle.actionBox.choices.gap
              );

              disabledY =
                y +
                padding * 2 +
                (i -
                  (this.actionPointer -
                    (CONFIG.battle.actionBox.maxItemsToDisplay - 1))) *
                  CONFIG.battle.actionBox.choices.gap;
            }

            if (disabled) {
              ctx.beginPath();
              // Definisci il punto iniziale del segmento
              ctx.moveTo(x + padding, disabledY - 5); // Coordinate (x1, y1)

              // Definisci il punto finale del segmento
              ctx.strokeStyle = "red";
              ctx.lineTo(x + width - textWidth(details), disabledY - 5); // Coordinate (x2, y2)
              ctx.stroke();
              ctx.closePath();
            }
          }
          break;
        }
        case CONFIG.battle.phases.target: {
          drawTargetPhase(x, y);
          break;
        }
      }
    } else {
      switch (this.currentPhase) {
        case CONFIG.battle.phases.selection: {
          ctx.fillText(
            this.currentCharacter.battleDialogue,
            x + padding,
            y + padding * 2
          );
          break;
        }
        case CONFIG.battle.phases.target: {
          drawTargetPhase(x, y);
          break;
        }
      }
    }
  }

  drawAttack() {
    if (this.currentPhase !== CONFIG.battle.phases.performAttack) {
      return;
    }

    const targets = this.getTargets().map((target) => {
      return {
        x: target.battlePosition.x,
        y: target.battlePosition.y,
      };
    });

    this.currentAttack.animate(targets);

    if (this.currentAttack.animationIsFinished()) {
      this.currentFrame = 0;
      this.attackAnimationEnded = true;
      this.currentAttack.resetAnimation();
    }
  }

  drawTurns() {
    const { radius, backgroundColor, currentTurnBackgroundColor, gap } =
      CONFIG.battle.turns;

    const quantityToDisplay = this.attackers.length + this.defenders.length;

    const boxWidth = (radius * 2 + gap) * quantityToDisplay - gap - gap / 3;

    let x =
      CONFIG.tile.canvasWidth -
      CONFIG.tile.canvasWidth / 2 +
      boxWidth / 2 +
      gap * 3;
    let y = CONFIG.battle.arenaPaddingY;

    const turnsMask = this.turns.slice(
      this.currentTurn,
      this.currentTurn + quantityToDisplay
    );

    turnsMask.reverse().forEach((turn, index) => {
      ctx.beginPath();
      ctx.arc(x + 25, y + 50, radius, 0, 2 * Math.PI); // Centra il cerchio
      ctx.fillStyle =
        turnsMask.length - 1 === index
          ? currentTurnBackgroundColor
          : backgroundColor; // Sfondo bianco
      ctx.fill(); // Riempi il cerchio

      ctx.lineWidth = 2;
      ctx.stroke(); // Disegna il contorno

      // Disegna l'icona
      turn.drawIcon(x, y, turn.isDefeated);

      x -= radius * 2 + gap; // Sposta la posizione
    });

    const turnString = `È il turno di ${this.currentCharacter.name}`;
    const textBoxWidth = textWidth(turnString);
    x = CONFIG.tile.canvasWidth / 2 + textBoxWidth / 2;
    y = CONFIG.battle.arenaPaddingY * 2.5 + radius * 2;
    ctx.fillStyle = CONFIG.typography.textColor;
    ctx.fillText(turnString, x, y);
  }

  drawStatusEffects() {
    [...this.attackers, ...this.defenders].forEach((character) => {
      character.drawStatusEffect();
    });
  }

  /**
   * Sposta il selettore del target verso destra
   */
  moveTargetPointerRight() {
    this.targetPointer++;
    if (this.targetPointer >= this.selectableTargets.length) {
      this.targetPointer = 0;
    }
  }

  /**
   * Sposta il selettore del target verso sinistra
   */
  moveTargetPointerLeft() {
    this.targetPointer--;
    if (this.targetPointer < 0) {
      this.targetPointer = this.selectableTargets.length - 1;
    }
  }

  /**
   * Sposta il selettore dell'azione in alto
   */
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

  /**
   * Sposta il selettore dell'azione in basso
   */
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

  /**
   * Gestisce le interazioni con la tastiera in base ai tasti premuti ed alla fase in corso
   */
  handleKeyboard(keyboard) {
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

  /**
   * Gestisce la fase di selezione iniziale. All'inizio si può scegliere di eseguire un attacco,
   * usare un oggetto o ritirarsi temporaneamente.
   */
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

  /**
   * Crea un array che contiene tutti i possibili target selezionabili durante l'attacco
   */
  setSelectableTargets() {
    const selectableTargets = [];
    if (this.currentAttack.targetAll) {
      [...this.attackers, ...this.defenders]
        .filter((character) => !character.isDefeated)
        .forEach((character) => {
          selectableTargets.push(character);
        });
    }

    if (this.currentAttack.targetAllAlliesGroup) {
      this.attackers
        .filter((character) => !character.isDefeated)
        .forEach((character) => {
          selectableTargets.push(character);
        });
    }
    if (this.currentAttack.targetSelf) {
      selectableTargets.push(this.turns[this.currentTurn]);
    }
    if (this.currentAttack.targetAlly) {
      for (var i = 0; i < this.attackers.length; i++) {
        if (
          this.attackers[i].id !== this.turns[this.currentTurn].id &&
          !this.attackers[i].isDefeated
        ) {
          selectableTargets.push(this.attackers[i]);
        }
      }
    }

    if (this.currentAttack.targetEnemy || this.currentAttack.targetAllEnemies) {
      this.defenders
        .filter((character) => !character.isDefeated)
        .forEach((character) => {
          selectableTargets.push(character);
        });
    }

    this.selectableTargets = selectableTargets;
  }

  /**
   * Gestisce la selezione di un attacco
   */
  handleAttacksOptionsPhase() {
    switch (true) {
      case keyboard.isInteract: {
        this.nextPhase();
        this.currentAttack =
          this.currentCharacter.freeAttacks[this.actionPointer];

        this.setSelectableTargets();

        this.targetPointer = 0;
        ASSETS.soundEffects.selection.play();
        return;
      }
    }
    if (this.isPlayerTurn) {
      this.handleActionPointer();
      this.handleCancelAsBack();
    }
  }

  /**
   * Gestisce la selezione di un attacco speciale
   */
  handleSpecialAttacksOptionsPhase() {
    switch (true) {
      case keyboard.isInteract: {
        if (!this.currentCharacter.costAttacks.length) {
          return;
        }
        if (
          this.currentCharacter.costAttacks[this.actionPointer].cost >
          this.currentCharacter.stats.currentStamina
        ) {
          ASSETS.soundEffects.wrong.play();
          return;
        }
        this.nextPhase();
        this.currentAttack =
          this.currentCharacter.costAttacks[this.actionPointer];

        this.setSelectableTargets();

        this.targetPointer = 0;
        ASSETS.soundEffects.selection.play();
        return;
      }
    }
    if (this.isPlayerTurn) {
      this.handleActionPointer();
      this.handleCancelAsBack();
    }
  }

  /**
   * Gestisce la selezione di un oggetto dallo zaino
   */
  handleBackpackOptionsPhase() {
    switch (true) {
      case keyboard.isInteract: {
        this.nextPhase();
        this.currentAttack = backpack.itemsList[this.actionPointer].attack;

        this.setSelectableTargets();

        this.targetPointer = 0;
        ASSETS.soundEffects.selection.play();
        return;
      }
    }
    if (this.isPlayerTurn) {
      this.handleActionPointer();
      this.handleCancelAsBack();
    }
  }

  /**
   * Gestisce la selezione di un target
   */
  handleTargetPhase() {
    switch (true) {
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
    if (this.isPlayerTurn) {
      ASSETS.soundEffects.cancel.pause();
      switch (true) {
        case keyboard.isLeft: {
          this.moveTargetPointerLeft();
          return;
        }
        case keyboard.isRight: {
          this.moveTargetPointerRight();
          return;
        }
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
    return this.turns[this.currentTurn];
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

  /**
   * Imposta la fase corrente a quella precedente
   */
  prevPhase() {
    this.phasesHistory = this.phasesHistory.slice(0, -1);
  }

  /**
   * Imposta la fase corrente a quella successiva
   */
  nextPhase() {
    switch (this.currentPhase) {
      case CONFIG.battle.phases.selection: {
        if (!this.isPlayerTurn) {
          this.phasesHistory.push(CONFIG.battle.phases.target);
          return;
        }
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

  checkEndBattle() {
    const enemiesDefeated = this.battle.enemies.every(
      (enemy) => enemy.isDefeated
    );

    const playersDefeated = Object.keys(players).every(
      (key) => players[key].isDefeated
    );
    if (enemiesDefeated || playersDefeated) {
      this.battleEnd = true;
      EVENTS.battle.inProgress = false;
    }
  }

  /**
   * Prepara il necessario all'inizio di un nuovo turno, calcolando il giocatore
   * attivo, attaccanti e difensori
   */
  startNextTurn() {
    this.checkEndBattle();
    this.handleStatusEffectDuration(); // in questo punto il giocatore attivo è ancora quello del turno precedente
    this.resetCurrentPhase();
    this.targetPointer = 0;
    this.actionPointer = 0;
    this.currentTurn++;
    this.handleAttackersAndDefenders();
    if (this.currentCharacter.isDefeated) {
      this.startNextTurn();
      return;
    }
    this.handleStatusEffect(); // qui il giocatore è quello del turno corrente
    this.checkEndBattle();
    if (!this.isPlayerTurn) {
      this.handleEnemyTurn();
      return;
    }
  }

  /**
   * Gestisce l'attacco selezionato, applicando danni ed effetti
   */
  handleAttack() {
    if (
      this.currentPhase === CONFIG.battle.phases.performAttack &&
      this.attackAnimationEnded
    ) {
      ASSETS.soundEffects.damage.play();

      const targets = this.getTargets();

      this.currentAttack.execute({
        performer: this.currentCharacter,
        targets,
      });

      this.resetCurrentPhase();
      this.startNextTurn();
      this.actionPointer = 0;
      this.targetPointer = 0;
      this.attackAnimationEnded = false;
    }
  }

  /**
   * L'IA che gestisce il turno dei nemici
   */
  handleEnemyTurn() {
    // attack selection
    if (this.currentCharacter.attacks.length) {
      const attack =
        this.currentCharacter.attacks[
          getRandomIndex(this.currentCharacter.attacks)
        ];

      this.currentAttack = attack;
      // target selection
      this.setSelectableTargets();
      let tries = 5;
      while (tries >= 0) {
        if (this.selectableTargets.length) {
          break;
        }
        this.currentAttack =
          this.currentCharacter.attacks[
            getRandomIndex(this.currentCharacter.attacks)
          ];
        this.setSelectableTargets();
        tries--;
      }
      if (!this.selectableTargets.length) {
        this.startNextTurn();
      }
    } else {
      this.startNextTurn();
    }
  }

  handleStatusEffect() {
    if (this.currentCharacter.stats.hasStatusEffect) {
      this.currentCharacter.stats.applyStatusEffect();
    }
  }

  handleStatusEffectDuration() {
    if (this.currentCharacter.stats.hasStatusEffect) {
      this.currentCharacter.stats.reduceStatusEffectDuration();
    }
  }

  getTargets() {
    if (
      this.currentAttack.targetAll ||
      this.currentAttack.targetAllEnemies ||
      this.currentAttack.targetAllAlliesGroup
    ) {
      return this.selectableTargets;
    } else {
      // targetEnemy, targetSelf, targetAlly
      const targetPlayer = this.selectableTargets[this.targetPointer];
      return [targetPlayer];
    }
  }

  /**
   * Da richiamare all'avvio della battaglia per permettere allo script principale di
   * avviare la gestione della tastiera
   */
  handle(keyboard) {
    this.handleKeyboard(keyboard);
    this.handleAttack();
  }

  draw() {
    this.battle.background.draw();
    this.drawCharacters();
    this.drawPlayersHealthBar();
    this.drawEnemiesHealthBar();
    this.drawTurns();
    this.drawStatusEffects();
    this.drawActionBox();
    this.drawPointer();
    this.drawAttack();
  }
}
