class BriscolaManager {
  inProgress = false;
  deck;

  constructor({ briscola }) {
    this.briscola = briscola;
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

  handle() {}

  draw() {}
}
