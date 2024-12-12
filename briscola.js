class Briscola {
  availablePartners = [];

  constructor({ adversaries = [] }) {
    this.adversaries = adversaries;

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
    console.log(this.availablePartners);
  }
}

const BRISCOLATE = {
  first: new Briscola({
    adversaries: [BRISCOLA_PLAYERS.cozza, BRISCOLA_PLAYERS.tumus],
  }),
};
