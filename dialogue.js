class DialogueManager {
  // Se true indica che il giocatore sta scegliendo un dialogo alternativo
  choiceInProgress = false;
  // le scelte disponibili in questo particolare dialogo
  currentChoices = null;
  // Il puntatore per la scelta di un dialogo quando ci sono piu alternative
  currentChoice = -1;
  // Se true indica che la conversazione è in corso
  inProgress = false;
  // Dialogo corrente
  currentDialogue = null;
  // Se true indica che la battaglia è stata triggherata
  battleIsTriggered = false;
  briscolaIsTriggered = false;

  constructor({ dialogues, entity }) {
    this.dialogues = dialogues;

    if (!dialogues || dialogues?.start) {
      console.error('"start" dialogue missing');
    }
    this.entity = entity; // può essere l'NPC o un MapObject. Colui che trigghera il dialogo
    this.state = {};
  }

  /**
   * Avvia tutti i gestori
   */
  handle() {
    if (this.choiceInProgress) {
      this.handleChoices();
    } else {
      this.handleStandardDialogue();
    }
  }

  /**
   * Inizializza il manager
   */
  init() {
    this.inProgress = true;
    this.loadNextDialogue();

    // Per evitare che il giocatore passi subito al secondo dialogo
    GLOBALS.interactionCooldown = Infinity;
    setTimeout(() => {
      GLOBALS.interactionCooldown = 0;
    }, CONFIG.keyboard.interactionCooldown);
  }

  /**
   * Carica il dialogo successivo a quello corrente. Se non ce nè uno presente, allora viene
   * impostato con il primo ("start")
   */
  loadNextDialogue() {
    if (!this.currentDialogue) {
      this.currentDialogue = this.dialogues.start;
      return;
    }

    let nextDialogueId =
      this.currentChoice >= 0
        ? this.currentDialogue.choices[this.currentChoice].next
        : this.currentDialogue.next;

    if (this.currentDialogue.textVariants) {
      const variant = this.currentDialogue.textVariants[CONFIG.player.main];
      nextDialogueId = variant.next;
    }

    if (!nextDialogueId) {
      // Devo dare il tempo all'index di prendere l'id della battle e posso farlo solo
      // se la conversazione rimane in piedi
      if (this.currentDialogue.battleId) {
        this.battleIsTriggered = true;
        return;
      }

      if (this.currentDialogue.briscolaId) {
        this.briscolaIsTriggered = true;
        return;
      }

      this.stopDialogue();
      return;
    }

    this.currentDialogue = this.dialogues[nextDialogueId];
  }

  /**
   * Ferma il dialogo
   */
  stopDialogue() {
    this.inProgress = false;
    GLOBALS.interactionCooldown =
      Date.now() + CONFIG.keyboard.interactionCooldown;
  }

  /**
   * Restituisce il battle id del dialogo
   */
  get battleId() {
    return this.currentDialogue.battleId;
  }

  /**
   * Restituisce il briscola id del dialogo
   */
  get briscolaId() {
    return this.currentDialogue.briscolaId;
  }

  /**
   * Restituisce il testo del dialogo
   */
  get currentDialogText() {
    if (this.currentDialogue.textVariants) {
      const variant = this.currentDialogue.textVariants[CONFIG.player.main];
      return variant.text;
    }

    return this.currentDialogue.text;
  }

  /**
   * Permette di navigare in avanti le scelte di dialogo
   */
  nextChoice() {
    this.currentChoice++;
    if (this.currentChoice >= this.currentChoices.length) {
      this.currentChoice = 0;
    }
  }

  /**
   * Permette di navigare in indietro le scelte di dialogo
   */
  previousChoice() {
    this.currentChoice--;
    if (this.currentChoice < 0) {
      this.currentChoice = this.currentChoices.length - 1;
    }
  }

  /**
   * Permette di selezionare una scelta di dialogo
   */
  selectChoice() {
    this.loadNextDialogue();
    this.currentChoice = -1;
    this.choiceInProgress = false;
  }

  draw() {
    this.drawBalloon();
  }

  /**
   * Disegna il fumetto
   */
  drawBalloon() {
    const {
      padding,
      fontSize,
      marginBottom,
      shadow,
      backgroundColor,
      width,
      height,
    } = CONFIG.battle.actionBox;

    let buttons = [BUTTONS.ok];

    let entityName = this.entity.name;

    let x = this.entity.position.x;
    let y =
      this.entity.position.y - CONFIG.battle.actionBox.height - marginBottom;

    // when a player is speaking
    if (this.currentDialogue.speaker) {
      const player = GLOBALS.players[this.currentDialogue.speaker];
      const partner = getOtherPlayer(this.currentDialogue.speaker);

      if (this.currentDialogue.speaker === CONFIG.player.main) {
        x = player.position.x;
        y = player.position.y - CONFIG.battle.actionBox.height - marginBottom;
      } else {
        x = partner.position.x + GLOBALS.partnerDrift.x;
        y =
          partner.position.y -
          CONFIG.battle.actionBox.height -
          marginBottom +
          GLOBALS.partnerDrift.y;
      }

      entityName = player.name;
    }

    ctx.fillStyle = backgroundColor;

    let fillStyles = [];
    let newFillStyle = backgroundColor;

    for (var i = 0; i < this.currentDialogue.choices?.length - 1; i++) {
      newFillStyle = darkenHexColor(newFillStyle, 10);
      fillStyles.push(newFillStyle);
    }

    // -2 perchè devo escludere quella che sto gia mostrando
    for (var i = this.currentDialogue.choices?.length - 2; i >= 0; i--) {
      ctx.fillStyle = fillStyles[i];
      drawRoundedRect(
        ctx,
        x - (i + 1) * 10,
        y - (i + 1) * 10,
        width,
        height,
        25
      );
    }

    applyShadow({
      ...shadow,
    });
    ctx.fillStyle = backgroundColor;
    drawRoundedRect(ctx, x, y, width, height, 25);

    const isThought = this.currentDialogue.type === "thought";

    if (isThought) {
      // Disegna i puntini di collegamento
      ctx.beginPath();
      ctx.arc(x + 40, y + height - 10, 6, 0, Math.PI * 2); // Puntino grande
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 35, y + height + 5, 4, 0, Math.PI * 2); // Puntino medio
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x + 32, y + height + 15, 2, 0, Math.PI * 2); // Puntino piccolo
      ctx.fill();
    } else {
      // Aggiungi il triangolo in basso
      ctx.beginPath(); // Inizia un nuovo percorso
      ctx.moveTo(x + 20, y + CONFIG.battle.actionBox.height - 2); // Punto sinistro del triangolo
      ctx.lineTo(x + 40, y + CONFIG.battle.actionBox.height - 2); // Punto destro del triangolo
      ctx.lineTo(x + 30, y + CONFIG.battle.actionBox.height - 2 + 20); // Punta del triangolo
      ctx.closePath(); // Chiude il triangolo

      ctx.fill(); // riempie il triangolo
    }

    resetShadow();

    ctx.textAlign = CONFIG.dialogue.textAlign;
    ctx.font = `bold ${16}px ${CONFIG.dialogue.fontFamily}`;
    ctx.fillStyle = "black";
    ctx.fillText(entityName, x + padding, y + padding * 1.5);

    ctx.beginPath(); // Inizia un nuovo percorso di disegno
    ctx.moveTo(x + padding, y + padding * 2); // Punto di partenza
    ctx.lineTo(x - padding + width, y + padding * 2); // Punto finale
    ctx.strokeStyle = "black"; // Colore della linea
    ctx.lineWidth = 2; // Spessore della linea
    ctx.stroke();

    ctx.textAlign = CONFIG.typography.textAlign;
    ctx.font = `${fontSize}px ${CONFIG.typography.fontFamily}`;

    if (this.currentDialogue.choices) {
      if (!this.choiceInProgress) {
        this.choiceInProgress = true;
        this.currentChoices = this.currentDialogue.choices;
        this.currentChoice = 0;
      }
      this.currentDialogue.choices.forEach((choice, index) => {
        if (this.currentChoice === index) {
          ctx.fillText(
            `Risposta #${index + 1}`,
            x + width - padding - textWidth(`Risposta #${index + 1}`),
            y + padding * 1.3
          );

          const wrappedDescription = wrapText(choice.text, width - padding * 2);

          wrappedDescription.forEach((line, index) => {
            ctx.fillText(line, x + padding, y + padding * 2 + (index + 1) * 20);
          });
        }
      });
      buttons = [BUTTONS.horizontalScroll, BUTTONS.confirm];
    } else {
      const wrappedDescription = wrapText(
        this.currentDialogText,
        width - padding * 2
      );

      wrappedDescription.forEach((line, index) => {
        let text = line;

        if (isThought) {
          if (index === 0) {
            text = `(${line}`;
          }
          if (index === wrappedDescription.length - 1) {
            text = `${text})`;
          }
        }
        ctx.fillText(text, x + padding, y + padding * 3.5 + index * 20);
      });
    }

    this.drawHotkeys(x, y, buttons);
  }

  /**
   * Disegna i pulsanti che si possono premere nel fumetto
   * @param {*} x posizione X del fumetto
   * @param {*} y posizione Y del fumetto
   * @param {*} buttons bottoni da mostrare
   */
  drawHotkeys(x, y, buttons = []) {
    const { padding, width, height } = CONFIG.battle.actionBox;
    const { gap, height: hotkeyHeight } = CONFIG.dialogue.hotkeys;

    const totalWidth = buttons.reduce((acc, button, index) => {
      acc += button.width;
      if (index < buttons.length - 1) {
        acc += gap;
      }
      return acc;
    }, 0);

    let startX = x + width - totalWidth;

    buttons.forEach((button) => {
      drawHotkey(ctx, startX, y + height - padding + hotkeyHeight, button);
      startX += button.width + gap;
    });
  }

  /**
   * Gestisce i comandi da tastiera quando ci sono dei dialoghi alternativi
   */
  handleChoices() {
    const now = Date.now();

    if (
      now > GLOBALS.interactionCooldown &&
      GLOBALS.lastKeyPressedId !== GLOBALS.keyboard.keyId
    ) {
      GLOBALS.lastKeyPressedId = GLOBALS.keyboard.keyId;
      GLOBALS.interactionCooldown = now + CONFIG.keyboard.choicesCooldown;

      switch (true) {
        case GLOBALS.keyboard.isRight: {
          this.previousChoice();
          break;
        }
        case GLOBALS.keyboard.isLeft: {
          this.nextChoice();
          break;
        }
        case GLOBALS.keyboard.isInteract: {
          this.selectChoice();
          break;
        }
      }
    }
  }

  /**
   * Gestisce i comandi da tastiera mentre un dialogo standard è in corso
   */
  handleStandardDialogue() {
    const now = Date.now();

    if (
      GLOBALS.keyboard.isInteract &&
      now > GLOBALS.interactionCooldown &&
      GLOBALS.lastKeyPressedId !== GLOBALS.keyboard.keyId
    ) {
      GLOBALS.lastKeyPressedId = GLOBALS.keyboard.keyId;
      GLOBALS.interactionCooldown = now + CONFIG.keyboard.interactionCooldown;

      this.loadNextDialogue();
    }
  }
}
