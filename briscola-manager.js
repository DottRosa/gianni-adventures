class BriscolaManager {
  inProgress = false;
  briscola;
  briscolaPlayers;
  deck;
  phasesHistory = [CONFIG.briscola.phases.partnerChoice];
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

  createDeck() {}

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
    }
  }

  /**
   * Gestisce la fase di selezione iniziale. All'inizio si può scegliere di eseguire un attacco,
   * usare un oggetto o ritirarsi temporaneamente.
   */
  handlPartnerChoicePhase() {
    switch (true) {
      case GLOBALS.keyboard.isInteract: {
        // this.nextPhase();
        // this.actionPointer = 0; // resetto per usarlo per il submenu
        // ASSETS.soundEffects.selection.play();
        return;
      }
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
        this.partnerChoicePointer.x += this.partnerChoicePointer.x < 4 ? 1 : 0;
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

    const x = canvasWidth / 2 - cell * 2 - cell / 2;
    const y = canvasHeight - cell * 2 - cell / 2;
    let shift = cell;
    let partnerIndex = 0;

    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 5; j++) {
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
          this.briscolaPlayers[partnerIndex].character.drawIcon(
            x + shift * j,
            y + shift * i
          );
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
      this.partnerChoicePointer.y * 5 + this.partnerChoicePointer.x;
    return this.briscolaPlayers[partnerIndex];
  }

  drawParterChoiceDetails() {
    const { cell, detailsBox } = CONFIG.briscola.partnerSelection;
    const { canvasHeight, canvasWidth } = CONFIG.tile;

    const x = canvasWidth / 2 - cell * 2 - cell / 2;
    const y = canvasHeight - cell * 2 - cell - detailsBox.height;

    ctx.fillRect(x, y, cell * 5, detailsBox.height);
    ctx.strokeRect(x, y, cell * 5, detailsBox.height);

    const partner = this.partnerHovered;

    ctx.font = detailsBox.fontName;
    ctx.fillStyle = "black";

    if (partner) {
      const posX = canvasWidth / 2 - textWidth(partner.character.name) / 2;
      const posY = y + cell / 3;
      ctx.fillText(partner.character.name, posX, posY);

      let distance = 35;

      [...partner.pros, ...partner.cons].forEach((item, index) => {
        ctx.font = detailsBox.fontDescription; //serve ai fini del calcolo
        const wrappedDescription = wrapText(item.description, cell * 5 - 20);
        ctx.font = detailsBox.fontTitle;

        ctx.fillText(item.title, x + 10, posY + distance);

        ctx.font = detailsBox.fontDescription;
        wrappedDescription.forEach((line, index) => {
          distance += 20;
          ctx.fillText(line, x + 10, y + cell / 3 + distance);
        });
        distance += 35;
      });
    } else {
      const noPartnerMessage = "Scelta causale";
      const posX = canvasWidth / 2 - textWidth(noPartnerMessage) / 2;
      ctx.fillText(noPartnerMessage, posX, y + cell / 3);
    }
  }

  drawPartnerChoice() {
    if (this.phaseIsPartnerChoice) {
      this.drawPartnerChoiceGrid();
      this.drawCharacters();
      this.drawParterChoiceDetails();
    }
  }
  drawCharacters() {
    if (this.phaseIsPartnerChoice) {
      // da fare con le grafiche giuste
    }
  }

  draw() {
    this.briscola.background.draw();
    this.drawPartnerChoice();
  }
}
