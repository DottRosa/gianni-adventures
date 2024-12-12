class DialogueManager {
  choiceInProgress = false;
  currentChoices = null;
  currentChoice = -1;

  constructor(dialogues) {
    this.dialogues = dialogues;
    this.currentDialogue = null;
    this.state = {};
  }

  start(dialogueId) {
    let dialogue = this.dialogues.start;
    if (!dialogue) {
      console.error('"start" dialogue missing');
    }

    if (dialogueId) {
      dialogue = this.dialogues[dialogueId];
    }

    if (!dialogue) {
      return null;
    }

    if (dialogue.textVariants) {
      const variant = dialogue.textVariants[CONFIG.player.main];
      if (variant) {
        this.currentDialogue = dialogue;
      }
    }

    this.currentDialogue = dialogue;
  }

  next() {
    let nextId = this.currentDialogue.next;
    if (this.currentDialogue.textVariants) {
      const variant = this.currentDialogue.textVariants[CONFIG.player.main];
      nextId = variant.next;
    }

    if (!nextId) {
      if (this.currentDialogue.battleId) {
        return CONFIG.dialogue.status.battle;
      }

      return CONFIG.dialogue.status.stop;
    }

    this.start(nextId);
    return CONFIG.dialogue.status.continue;
  }

  get battleId() {
    return this.currentDialogue.battleId;
  }

  get ended() {
    return !this.currentDialogue.next;
  }

  get currentDialogText() {
    if (this.currentDialogue.textVariants) {
      const variant = this.currentDialogue.textVariants[CONFIG.player.main];
      return variant.text;
    }

    return this.currentDialogue.text;
  }

  nextChoice() {
    this.currentChoice++;
    if (this.currentChoice >= this.currentChoices.length) {
      this.currentChoice = 0;
    }
  }

  previousChoice() {
    this.currentChoice--;
    if (this.currentChoice < 0) {
      this.currentChoice = this.currentChoices.length - 1;
    }
  }

  selectChoice() {
    let nextId = this.currentDialogue.choices[this.currentChoice].next;
    this.currentChoice = -1;
    this.choiceInProgress = false;

    if (!nextId) {
      return false;
    }

    this.start(nextId);
    return true;
  }

  draw({ position, name, players, partnerDrift }) {
    // when the npc is speaking
    let boxX = position.x + 20;
    let boxY = position.y - CONFIG.dialogue.balloon.height;
    let entityName = name;

    // when a player is speaking
    if (this.currentDialogue.speaker) {
      const player = players[this.currentDialogue.speaker];

      if (this.currentDialogue.speaker === CONFIG.player.main) {
        boxX = player.position.x + 20;
        boxY = player.position.y - CONFIG.dialogue.balloon.height;
      } else {
        boxX = player.position.x + 20 + partnerDrift.x;
        boxY =
          player.position.y - CONFIG.dialogue.balloon.height + partnerDrift.y;
      }

      entityName = player.name;
    }

    ctx.fillStyle = CONFIG.dialogue.balloon.backgroundColor;
    ctx.fillRect(
      boxX,
      boxY,
      CONFIG.dialogue.balloon.width,
      CONFIG.dialogue.balloon.height
    );

    ctx.strokeStyle = CONFIG.dialogue.balloon.borderColor;
    ctx.strokeRect(
      boxX,
      boxY,
      CONFIG.dialogue.balloon.width,
      CONFIG.dialogue.balloon.height
    );

    ctx.textAlign = CONFIG.dialogue.textAlign;
    ctx.font = CONFIG.dialogue.fontBold;
    ctx.fillStyle = CONFIG.dialogue.nameColor;
    ctx.fillText(
      entityName,
      boxX + 5,
      boxY + 5,
      boxY + CONFIG.dialogue.balloon.height / 2
    );

    ctx.font = CONFIG.dialogue.fontNormal;
    ctx.fillStyle = CONFIG.dialogue.textColor;

    if (this.currentDialogue.choices) {
      if (!this.choiceInProgress) {
        this.choiceInProgress = true;
        this.currentChoices = this.currentDialogue.choices;
        this.currentChoice = 0;
      }
      this.currentDialogue.choices.forEach((choice, index) => {
        const prefix = this.currentChoice === index ? "> " : "";
        ctx.fillText(
          `${prefix}${choice.text}`,
          boxX + (prefix ? 5 : 15),
          boxY + 20 + index * 15,
          boxY + CONFIG.dialogue.balloon.height / 2 + index * 15
        );
      });
    } else {
      ctx.fillText(
        this.currentDialogText,
        boxX + 5,
        boxY + 20,
        boxY + CONFIG.dialogue.balloon.height / 2
      );
    }
  }

  draw2({ position, name, partnerDrift }) {
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

    let entityName = name;

    let x = position.x;
    let y = position.y - CONFIG.battle.actionBox.height - marginBottom;

    // when a player is speaking
    if (this.currentDialogue.speaker) {
      const player = players[this.currentDialogue.speaker];
      const partner = getOtherPlayer(this.currentDialogue.speaker);

      if (this.currentDialogue.speaker === CONFIG.player.main) {
        x = player.position.x;
        y = player.position.y - CONFIG.battle.actionBox.height - marginBottom;
      } else {
        x = partner.position.x + partnerDrift.x;
        y =
          partner.position.y -
          CONFIG.battle.actionBox.height -
          marginBottom +
          partnerDrift.y;
      }

      entityName = player.name;
    }

    applyShadow({
      ...shadow,
    });

    ctx.fillStyle = backgroundColor;
    // ctx.fillRect(x, y, width, height);

    drawRoundedRect(ctx, x, y, width, height, 25);

    // Aggiungi il triangolo in basso
    ctx.beginPath(); // Inizia un nuovo percorso
    ctx.moveTo(x + 20, y + CONFIG.battle.actionBox.height - 2); // Punto sinistro del triangolo
    ctx.lineTo(x + 40, y + CONFIG.battle.actionBox.height - 2); // Punto destro del triangolo
    ctx.lineTo(x + 30, y + CONFIG.battle.actionBox.height - 2 + 20); // Punta del triangolo
    ctx.closePath(); // Chiude il triangolo

    ctx.fill(); // riempie il triangolo

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
        ctx.fillText(line, x + padding, y + padding * 3.5 + index * 20);
      });
    }

    this.drawHotkeys(x, y, buttons);
  }

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
}
