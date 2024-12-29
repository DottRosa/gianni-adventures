class BriscolaManager {
  inProgress = false;
  briscola;
  briscolaPlayers;
  deck;
  phasesHistory = [CONFIG.briscola.phases.partnerChoice];
  showPlayerDetails = false;
  partnerChoicePointer = {
    x: 0,
    y: 0,
  };
  morale = {
    teamPlayer: 100,
    teamAdversaries: 100,
  };

  constructor({ briscola }) {
    this.briscola = briscola;
    this.briscolaPlayers = Object.keys(BRISCOLA_PLAYERS).map((key) => {
      return BRISCOLA_PLAYERS[key];
    });

    this.fabrisTeam = [
      new BriscolaPlayer({ character: GLOBALS.players.fabrissazzo }),
    ];

    this.adversariesTeam = this.briscola.adversaries;
  }

  get partner() {
    return this.partnerChoicePointer;
  }

  isAdversary(character) {
    return this.adversariesTeam.some((adversary) => {
      return adversary.character.id === character.id;
    });
  }

  prevPhase() {
    this.phasesHistory.pop();
  }

  /**
   * Imposta la fase corrente a quella successiva
   */
  nextPhase() {
    switch (this.currentPhase) {
      case CONFIG.briscola.phases.partnerChoice: {
        this.phasesHistory.push(CONFIG.briscola.phases.partnerConfirmation);
        return;
      }
      case CONFIG.briscola.phases.partnerConfirmation: {
        this.phasesHistory.push(CONFIG.briscola.phases.gameStart);
        return;
      }
    }
  }

  init() {
    this.inProgress = true;
    this.deck = new BriscolaDeck();

    // Per evitare che il giocatore passi subito al secondo dialogo
    GLOBALS.interactionCooldown = Infinity;
    setTimeout(() => {
      GLOBALS.interactionCooldown = 0;
    }, CONFIG.keyboard.interactionCooldown);
  }

  get currentPhase() {
    return this.phasesHistory[this.phasesHistory.length - 1];
  }

  get phaseIsPartnerChoice() {
    return this.currentPhase === CONFIG.briscola.phases.partnerChoice;
  }

  get phaseIsPartnerConfirmation() {
    return this.currentPhase === CONFIG.briscola.phases.partnerConfirmation;
  }

  get phaseIsDeckPreparation() {
    return this.currentPhase === CONFIG.briscola.phases.gameStart;
  }

  /**
   * Gestisce le interazioni con la tastiera in base ai tasti premuti ed alla fase in corso
   */
  handleKeyboard() {
    const now = Date.now();

    if (
      now > GLOBALS.interactionCooldown &&
      GLOBALS.lastKeyPressedId !== GLOBALS.keyboard.keyId // avoid keep pressing the same key and executing the code
    ) {
      GLOBALS.lastKeyPressedId = GLOBALS.keyboard.keyId;
      GLOBALS.interactionCooldown = now + CONFIG.keyboard.choicesCooldown;

      ASSETS.soundEffects.choices.pause();
      ASSETS.soundEffects.choices.currentTime = 0;
      ASSETS.soundEffects.selection.pause();
      ASSETS.soundEffects.selection.currentTime = 0;

      if (this.phaseIsPartnerChoice) {
        this.handlPartnerChoicePhase();
        return;
      }
      if (this.phaseIsPartnerConfirmation) {
        this.handlPartnerConfirmationPhase();
        return;
      }
      if (this.phaseIsDeckPreparation) {
        this.handleDeckPreparation();
        return;
      }
    }
  }

  /**
   * Gestisce il mescolamento
   */
  handleDeckPreparation() {}

  /**
   * Gestisce la fase di selezione iniziale. All'inizio si può scegliere di eseguire un attacco,
   * usare un oggetto o ritirarsi temporaneamente.
   */
  handlPartnerChoicePhase() {
    switch (true) {
      case GLOBALS.keyboard.isUp: {
        this.partnerChoicePointer.y -= this.partnerChoicePointer.y > 0 ? 1 : 0;
        return;
      }
      case GLOBALS.keyboard.isDown: {
        this.partnerChoicePointer.y += this.partnerChoicePointer.y > 0 ? 0 : 1;
        return;
      }
      case GLOBALS.keyboard.isLeft: {
        this.partnerChoicePointer.x -= this.partnerChoicePointer.x > 0 ? 1 : 0;
        return;
      }
      case GLOBALS.keyboard.isRight: {
        this.partnerChoicePointer.x +=
          this.partnerChoicePointer.x <
          Math.floor(this.briscolaPlayers.length / 2)
            ? 1
            : 0;
        return;
      }
      case GLOBALS.keyboard.isRightTrigger: {
        this.showPlayerDetails = !this.showPlayerDetails;
        return;
      }
      case GLOBALS.keyboard.isInteract: {
        if (
          this.partnerHovered?.isBlocked ||
          this.isAdversary(this.partnerHovered.character)
        ) {
          ASSETS.soundEffects.wrong.play();
          return;
        }
        ASSETS.soundEffects.selection.play();
        this.nextPhase();
        return;
      }
    }
  }

  handlPartnerConfirmationPhase() {
    switch (true) {
      case GLOBALS.keyboard.isInteract: {
        this.nextPhase();
        return;
      }
      case GLOBALS.keyboard.isCancel: {
        this.prevPhase();
        return;
      }
    }
  }

  handle() {
    this.handleKeyboard();
  }

  drawPartnerChoiceGrid() {
    const { cell, detailsBox } = CONFIG.briscola.partnerSelection;
    const { canvasHeight, canvasWidth } = CONFIG.tile;

    const x =
      canvasWidth / 2 - Math.ceil(this.briscolaPlayers.length / 4) * cell;
    const y = canvasHeight - cell * 2 - cell / 2;
    let shift = cell;
    let partnerIndex = 0;

    for (var i = 0; i < 2; i++) {
      for (var j = 0; j <= Math.floor(this.briscolaPlayers.length / 2); j++) {
        if (
          this.partnerChoicePointer.x === j &&
          this.partnerChoicePointer.y === i
        ) {
          ctx.fillStyle = "yellow";
        } else {
          ctx.fillStyle = "white";
        }
        ctx.fillRect(x + shift * j, y + shift * i, cell, cell);
        ctx.strokeRect(x + shift * j, y + shift * i, cell, cell);
        if (this.briscolaPlayers[partnerIndex]) {
          if (this.briscolaPlayers[partnerIndex].isBlocked) {
            ctx.drawImage(
              lockImage,
              x + shift * j,
              y + shift * i,
              cell / 2,
              cell / 2
            );
          } else {
            this.briscolaPlayers[partnerIndex].character.drawIcon(
              x + shift * j,
              y + shift * i
            );

            if (
              this.isAdversary(this.briscolaPlayers[partnerIndex].character)
            ) {
              ctx.font = detailsBox.fontDescription;
              ctx.fillStyle = "black";
              ctx.fillText("CPU", x + 5 + shift * j, y + 12.5 + shift * i);
            }
          }
        } else {
          ctx.font = detailsBox.font;
          ctx.fillStyle = "black";
          ctx.fillText("?", x + shift * j + cell / 2, y + shift * i + cell / 2);
          ctx.fillStyle = "white";
        }

        partnerIndex++;
      }
    }
  }

  get partnerHovered() {
    const partnerIndex =
      this.partnerChoicePointer.y * Math.ceil(this.briscolaPlayers.length / 2) +
      this.partnerChoicePointer.x;

    return this.briscolaPlayers[partnerIndex];
  }

  drawParterChoiceDetails() {
    const { cell, detailsBox } = CONFIG.briscola.partnerSelection;
    const { canvasHeight, canvasWidth } = CONFIG.tile;

    const boxWidth = cell * 5;

    const x = canvasWidth / 2 - cell * 2 - cell / 2;
    const y = canvasHeight - cell * 2 - cell - detailsBox.height;

    ctx.fillRect(x, y, boxWidth, detailsBox.height);
    ctx.strokeRect(x, y, boxWidth, detailsBox.height);

    const partner = this.partnerHovered;

    ctx.font = detailsBox.fontName;
    ctx.fillStyle = "black";

    if (!partner) {
      const noPartnerMessage = "Scelta causale";
      const posX = canvasWidth / 2 - textWidth(noPartnerMessage) / 2;
      ctx.fillText(noPartnerMessage, posX, y + detailsBox.height / 2);
      return;
    }

    if (partner.isBlocked) {
      const blockedPartner = "Personaggio bloccato";
      const posX = canvasWidth / 2 - textWidth(blockedPartner) / 2;
      ctx.fillText(blockedPartner, posX, y + detailsBox.height / 2);
      return;
    }

    const partnerName =
      partner.character.details?.nickname.fabrissazzo ?? partner.character.name;
    const posX = canvasWidth / 2 - textWidth(partnerName) / 2;
    const posY = y + cell / 3;
    ctx.fillText(partnerName, posX, posY);

    let distance = 15;

    let button = BUTTONS.briscolaPlayerDetails;

    if (this.showPlayerDetails) {
      distance += 30;
      button = BUTTONS.briscolaPlayerDetailsBack;
      ctx.font = detailsBox.fontDescription;

      Object.keys(BRISCOLA_PLAYER_DEFAULT_STATS).forEach((stat) => {
        ctx.fillText(
          BRISCOLA_PLAYER_DEFAULT_STATS_LABELS[stat],
          x + 10,
          posY + distance
        );
        ctx.fillText(
          partner.getVisualStatValue(stat),
          x + boxWidth - 50,
          posY + distance
        );
        distance += 20;
      });
    } else {
      ctx.font = detailsBox.fontDescription;
      const wrappedDescription = wrapText(partner.description, boxWidth - 20);

      wrappedDescription.forEach((line, index) => {
        distance += 20;
        ctx.fillText(line, x + 10, y + cell / 3 + distance);
      });

      distance += 35;

      [...partner.pros, ...partner.cons].forEach((item, index) => {
        ctx.font = detailsBox.fontDescription; //serve ai fini del calcolo
        const wrappedDescription = wrapText(item.description, boxWidth - 20);
        ctx.font = detailsBox.fontTitle;

        ctx.fillText(item.title, x + 10, posY + distance);

        ctx.font = detailsBox.fontDescription;
        wrappedDescription.forEach((line, index) => {
          distance += 20;
          ctx.fillText(line, x + 10, y + cell / 3 + distance);
        });
        distance += 35;
      });
    }
    drawHotkey(
      ctx,
      x + boxWidth - BUTTONS.confirm.width - button.width - 20,
      y + detailsBox.height - 30,
      button
    );
    drawHotkey(
      ctx,
      x + boxWidth - BUTTONS.confirm.width - 10,
      y + detailsBox.height - 30,
      BUTTONS.confirm
    );
  }

  drawPartnerChoiceConfirmationModal() {
    const { cell, detailsBox } = CONFIG.briscola.partnerSelection;
    const { canvasHeight, canvasWidth } = CONFIG.tile;

    const boxWidth = cell * 5;

    const x = canvasWidth / 2 - cell * 2 - cell / 2;
    const y = canvasHeight - cell * 2 - cell - detailsBox.height;

    ctx.fillRect(x, y, boxWidth, detailsBox.height);
    ctx.strokeRect(x, y, boxWidth, detailsBox.height);

    ctx.font = detailsBox.fontName;
    ctx.fillStyle = "black";

    const partner = this.partnerHovered;

    const partnerName =
      partner.character.details?.nickname.fabrissazzo ?? partner.character.name;
    const posX = canvasWidth / 2 - textWidth(partnerName) / 2;
    const posY = y + cell / 3;
    ctx.fillText(partnerName, posX, posY);

    ctx.font = detailsBox.fontDescription;
    const choiceQuestion = "Sei VERAMENTE sicuro della tua scelta?";
    const questionPosX = canvasWidth / 2 - textWidth(choiceQuestion) / 2;
    ctx.fillText(choiceQuestion, questionPosX, y + detailsBox.height / 2);

    const button = BUTTONS.back;

    drawHotkey(
      ctx,
      x + boxWidth - BUTTONS.confirm.width - button.width - 20,
      y + detailsBox.height - 30,
      button
    );
    drawHotkey(
      ctx,
      x + boxWidth - BUTTONS.confirm.width - 10,
      y + detailsBox.height - 30,
      BUTTONS.confirm
    );
  }

  drawPartnerChoice() {
    if (this.phaseIsPartnerChoice) {
      this.drawPartnerChoiceGrid();
      this.drawCharacters();
      this.drawParterChoiceDetails();
    }
  }

  drawPartnerConfirmation() {
    if (this.phaseIsPartnerConfirmation) {
      this.drawPartnerChoiceGrid();
      this.drawCharacters();
      this.drawPartnerChoiceConfirmationModal();
    }
  }

  drawCharacters() {
    if (this.phaseIsPartnerChoice) {
      // da fare con le grafiche giuste
    }
  }

  drawHUD() {
    if (this.phaseIsPartnerChoice || this.phaseIsPartnerConfirmation) {
      return;
    }

    const { canvasHeight, canvasWidth } = CONFIG.tile;

    const partnerName = this.partnerHovered.character.name;

    ctx.fillStyle = "black";

    ctx.fillText(partnerName, canvasWidth / 2 - textWidth(partnerName) / 2, 20);
  }

  draw() {
    this.briscola.background.draw();
    this.drawPartnerChoice();
    this.drawPartnerConfirmation();
    this.drawHUD();
  }
}

function convertArrayToObject(array, maxX, maxY) {
  const result = {};
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 0) {
      const x = i % maxX;
      const y = Math.floor(i / maxX);
      result[`${x},${y}`] = array[i];
    }
  }
  return result;
}
