class BriscolaManager {
  inProgress = false;

  constructor({ briscola }) {
    this.briscola = briscola;
  }

  init() {
    this.inProgress = true;

    // Per evitare che il giocatore passi subito al secondo dialogo
    GLOBALS.interactionCooldown = Infinity;
    setTimeout(() => {
      GLOBALS.interactionCooldown = 0;
    }, CONFIG.keyboard.interactionCooldown);
  }

  handle() {}

  draw() {}
}
