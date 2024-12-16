class Briscola {
  availablePartners = [];
  background;

  constructor({
    adversaries = [],
    background = `${CONFIG.assets.folder}/battle.jpg`,
  }) {
    this.adversaries = adversaries;
    this.background = new Layer({
      position: {
        x: 0,
        y: 0,
      },
      imageSrc: background,
    });

    const adversaryIds = adversaries.map((adversary) => {
      return adversary.id;
    });

    this.availablePartners = Object.keys(BRISCOLA_PLAYERS).reduce(
      (acc, key) => {
        if (!adversaryIds.includes(BRISCOLA_PLAYERS[key].id)) {
          acc.push(BRISCOLA_PLAYERS[key]);
        }
        return acc;
      },
      []
    );
  }
}

const BRISCOLATE = {
  first: new Briscola({
    adversaries: [BRISCOLA_PLAYERS.cozza, BRISCOLA_PLAYERS.tumus],
  }),
};
