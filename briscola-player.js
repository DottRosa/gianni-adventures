class BriscolaPlayer {
  constructor({ name }) {
    this.id = name.toLowerCase().replaceAll(" ", "");
    this.name = name;
  }
}

const BRISCOLA_PLAYERS = {
  cozza: new BriscolaPlayer({ name: "cozza" }),
  tumus: new BriscolaPlayer({ name: "tumus" }),
  gianni: new BriscolaPlayer({ name: "gianni" }),
  tartaglione: new BriscolaPlayer({ name: "tartaglione" }),
  simonato: new BriscolaPlayer({ name: "simonato" }),
  rosa: new BriscolaPlayer({ name: "rosa" }),
};
